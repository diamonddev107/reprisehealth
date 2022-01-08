

$(document).ready(function(){
  $("#MainContent .container").children().each(function() {
    $(this).html($(this).html().replace(/@name/g,"<span class='dynamic-name'></span>"));
    $(this).html($(this).html().replace(/@Name/g,"<span class='dynamic-name'></span>"));
  });

  var timestamp = new Date().getTime();
  var quiz = {};
  var questionsArray = [];
  var answerObject = {};
  quiz.questions = questionsArray;
  quiz.answers = answerObject;
  var $sectionCoverButton = $('.btn-section-cover');
  var $continueButton = $('.btn--quiz-continue');
  var $backButton = $('.btn--quiz-back');
  var $answerSelector = $('.btn--answer');
  var $categorySelector = $('.btn--category');
  var $rangeAnswer = $('.range-dot-wrapper');
  var $inlineContinues = $('form .inline-continue');
  // temp start
  var slideLen = $(".mySwiper").data("len");
  // temp end
  var swiper = new Swiper(".mySwiper", {
    allowTouchMove: false,
    speed: 1,
    direction: 'horizontal',
    on: {
      init: function(swiper) {
        checkForAutomaticTransition(swiper);
      },
      reachEnd: function(swiper) {
        reachSlideEnd();
      } 
    }
  });

  swiper.on('slideChangeTransitionEnd',function(){
    checkForAutomaticTransition(swiper);
  });

  function checkForAutomaticTransition(swiper) {
    // temp start
    // var indexBeforeLast = slideLen - 1;
    // var currentSlide = $(swiper.slides[indexBeforeLast]);
    // swiper.slideNext();
    // swiper.slideTo(65,10);
    // temp end
    if (swiper.realIndex == 0) {
      $backButton.addClass("hide");
    } else {
      $backButton.removeClass("hide");
    }

    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var whyWeAsk = currentSlide.data('why-we-ask');
    var offset = currentSlide.find(".slide-bottom").offset();
    var wowSlide = currentSlide.data('question-type');
    
    if (wowSlide == "Information Page" && quiz.healthCategories.length == 1) {
        var wowText = currentSlide.find(".question-heading").text();
        var singleResult = wowText.replace("those are some great goals", "That's a great goal");
        singleResult = singleResult.replace(/goals/g, "goal");
        currentSlide.find(".question-heading").text(singleResult);
    }
    if (whyWeAsk == '' || whyWeAsk == undefined) {
      $(".sidebar-button-slide").addClass("hide");
    } else {
      $(".sidebar-button-slide").removeClass("hide");
      $(".sidebar-button-slide .inner p").text(whyWeAsk);
      if (offset != undefined) {
        $(".sidebar-button-slide").css('top', offset.top);
      }
    }
    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var currentSection = currentSlide.data('slide-section');
    var whyWeAsk = currentSlide.data('why-we-ask');
    $(".sidebar-button-slide .inner p").text(whyWeAsk);

    setBreadCrumbsProgress(currentSection);
    
    if ( currentSlide.data('transition-time') ) {
      $('.breadcrumbs-progress-wrapper').addClass("hide");
      $('#MainContent .container').addClass("section-cover");
      $backButton.addClass("hide");
      $(".sidebar-button-slide").addClass("hide");
      // var transitionTime = currentSlide.data('transition-time') * 1000;
      // setTimeout(
      //   function() 
      //   {
      //     swiper.slideNext(300);
      //   }, transitionTime);
    } else {
      if (!currentSlide.find('.slide-inner').hasClass('full-screen')) {
        $('#MainContent .container').removeClass("section-cover");
        $('.breadcrumbs-progress-wrapper').removeClass("hide");  
      } else {
        $('#MainContent .container').addClass("section-cover");
        $backButton.addClass("hide");
        $('.breadcrumbs-progress-wrapper').addClass("hide");
      }
    };
    console.log(quiz);
    currentSlide.find(".slide-top").children().each(function() {
      var that = $(this);
      for (var key in quiz.answers) {
        if (that.html().indexOf(key) > -1) {
          var re = new RegExp(key, "g");
          var str = AdjustString(quiz.answers[key].split(","));
          that.html(that.html().replace(re, str));
        }
      }
    });
  }
  function reachSlideEnd() {
    $('.breadcrumbs-progress-wrapper').addClass("hide");
    $(".calculating-announcement-bar").addClass('show');
    $(".calculating-announcement-bar span").text(slideLen + "/" + slideLen + " Questions Completed");
    // $(".page.page-default").addClass('vh');
    $(".sidebar-button-slide").addClass("hide");
    setTimeout(
      function() 
      {
        var cat_arr = quiz.healthCategories;
        var cat_names = AdjustString(cat_arr);

        $(".pre-product-recommendation").removeClass("hide");
        // $("#created_for_someone").text("Created Just For " + quiz.name);
        $("#goals_for_category_names").text($("#goals_for_category_names").text().replace("@category-names", cat_names));
        $(".page.page-default").addClass("hide");
        $backButton.addClass("proper");
        $backButton.addClass("desktop-hide");
        $(".calculating-announcement-bar").removeClass('show');
      }, 5000
    );
  }
  function AdjustString(arr) {
    var return_str = '';
    for (var i = 0; i < arr.length; i++) {
      return_str += arr[i];
      if (arr.length > 1) {
        if (i < arr.length - 1) {
          if (arr.length >= 2 && i == arr.length - 2) {
            return_str += " and ";
          } else {
            return_str += ", ";
          }
        }
      }
    }
    return return_str;
  }
  // country list vertical slider
  var initial_slick_var = 0;
  $('.vertical-slide-item-wrapper .inner-wrapper').on('wheel', (function(e) {
    e.preventDefault();
    // $(".slick-slide.slick-active").removeClass('slick-active-center');
    // var current_index = $(".slick-current.slick-active").attr('data-slick-index');
    // var center_index = parseInt(current_index) + 3;
    // $(".slick-active[data-slick-index='"+center_index+"']").addClass('slick-active-center');

    if (e.originalEvent.deltaY < 0) {
      $(this).slick('slickPrev');
    } else {
      $(this).slick('slickNext');
    }
  }));
  $(".vertical-slider-inner .single-answer-input").on("click", function() {
    $(".vertical-slide-item-wrapper").removeClass("hide");
    if (initial_slick_var == 0) {
      $(".vertical-slide-item-wrapper .inner-wrapper").slick({
        centerMode: true,
        slidesToShow: 5,
        arrows: false,
        dots: false,
        vertical: true,
        infinite: true,
        draggable: false,
        verticalSwiping: true
      });
      $(".vertical-slide-item-wrapper .inner-wrapper").slick('slickNext');
      initial_slick_var++;
    }
  })
  $(".btn--quiz-vertical-slider-item").on("click", function() {
    $(this).closest(".vertical-slider-inner").find("#verticalSliderAnswer").val($(this).data("answer"));
    $(".btn--quiz-vertical-slider-item").removeClass("btn--quiz-active");
    $(this).addClass("btn--quiz-active");
    $(this).closest(".vertical-slider-inner").find(".btn--quiz-continue").removeClass("btn--quiz-continue-inactive");
    $(".vertical-slide-item-wrapper").addClass("hide");
  })
  // country list vertical slider
  $(".left-arrow-button").on("click", function(e) {
    $(".sidebar-button-slide").addClass("collapsed");
  })
  $(".sidebar-button-slide").on("click", function(e) {
    var target = $(e.target);
    if (!target.hasClass('left-arrow-button')) {
      if ($(".sidebar-button-slide").hasClass("collapsed")) {
        $(".sidebar-button-slide").removeClass("collapsed");  
      }  
    }
  })
  $(".learn-more-popup .close").on("click", function() {
    $(".learn-more-popup").removeClass("popup-open");
  })
  $(".btn-right-arrow-wrapper").closest(".item").on("click", function() {
    var product_title = $(this).closest(".item").find(".product-title").text();
    var product_url = $(this).closest(".item").find(".product-title").data("url");
    $(".learn-more-popup .product-title").text(product_title);
    $(".learn-more-popup .popup-learn-more-link").attr("href", product_url);
    $(".learn-more-popup").addClass("popup-open");
  })
  $("#checkout_our_recommendations").on("click", function() {
    // Select top 3 products from quiz result - start.
    var allArr = [];

    $("#devScoreWrapper .product-score-wrapper").each(function(e) {
      var temp = [];
      var s = Number($(this).find('span[data-total-score]').text());
      var h = $(this).find('span[data-product-handle]').text();
      temp.push(s);
      temp.push(h);
      allArr.push(temp);
    })

    allArr.sort(sortFunction);

    function sortFunction(a, b) {
      if (a[0] === b[0]) {
        return 0;
      }
      else {
        return (a[0] > b[0]) ? -1 : 1;
      }
    }

    var topArr = allArr.slice(0, 3);
    var topHandleArr= topArr.map(function(value,index) { return value[1]; });

    $(".recommended-products .products-wrapper .item").each(function() {
      if (!$(this).hasClass('arrow')) {
        var product_handle = $(this).data("product-handle");
        if (topHandleArr.indexOf(product_handle) < 0) {
          $(this).addClass('hide');
        }
      }
    })
    // Select top 3 products from quiz result - end.
    $(".pre-product-recommendation").addClass("hide");
    $(".recommended-products").removeClass("hide");
    $(".calculating-announcement-bar").addClass("show");
    $backButton.removeClass("proper");
  })
  $("#add_custom_bottle_to_cart").on("click", function() {
    var custom_bottle_variant_id = $("#custom_bottle_variant_id").val();
    var properties = {};
    properties['_customerName'] = quiz.name;
    $(".recommended-products .products-wrapper .item").each(function(i, e) {
      if (!$(this).hasClass('arrow')) {
        if (!$(this).hasClass('hide')) {
          var product_name = $(this).data("product-name");
          properties['product-'+ i] = product_name;
        }
      }
    })
    var addData = {
      items: [
        {
          'quantity': 1,
          'id': custom_bottle_variant_id,
          'properties': properties
        }
      ]
    }
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addData)
    })
    .then(response => {
      if (response.status == 200) {
        location.href='/cart';  
      }
    })
    .catch((error) => {
    });
  })
  $backButton.on('click', 'span', function() {
    swiper.slidePrev();
  })
  $backButton.on('click', 'img', function() {
    swiper.slidePrev();
  })
  // $(".range-bar-item").on("click", function() {
  //   var index = $(this).index();
  //   $('.range-dot-wrapper[data-index="'+index+'"]').trigger("click");
  // })
  $(".range-slider-bar").on("input", function() {
    var index = Math.floor($(this).val());
    $(this).closest(".number-range").find('.range-dot-wrapper[data-index="'+index+'"]').trigger("click");  
  })
  $rangeAnswer.on('click',function(e){
    var thisSlide = $(this).closest('.swiper-slide');
    var thisQuestion = this.closest('.number-range');
    var thisRangeBar = $(thisQuestion).find('.range-bar-inner');
    var thisRangeBarItems = thisRangeBar.find('.range-bar-item');
    var thisEmoticonWrapper = $(thisQuestion).find('.range-emoticon');
    var thisMessageWrapper = $(thisQuestion).find('.range-message');
    var emoticonImages = $(thisEmoticonWrapper).find('img');
    var emoticonMessages = $(thisMessageWrapper).find('p');
    var index = $(this).index();
    $(this).closest(".number-range").find(".range-slider-bar").val(index + 1);

    
    $(thisQuestion).find('.range-dot-wrapper').removeClass('range-dot-wrapper-active').addClass('range-dot-wrapper-inactive');
    $(this).removeClass('range-dot-wrapper-inactive').addClass('range-dot-wrapper-active');
    $(emoticonImages).each(function(i,e){
      if ( i == index ) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $(emoticonMessages).each(function(i,e){
      if ( i == index ) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $(thisRangeBarItems).each(function(i,e){
      if ( i == index ) {
        $(this).removeClass('range-bar-item-inactive').addClass('range-bar-item-active').addClass('range-bar-item-selected');
      } else if ( i < index ) {
        $(this).removeClass('range-bar-item-inactive').addClass('range-bar-item-active').removeClass('range-bar-item-selected');
      } else {
        $(this).removeClass('range-bar-item-active').addClass('range-bar-item-inactive').removeClass('range-bar-item-selected');
      }
    });
  });
  $categorySelector.on('click',function(e){
    var $button = $(this);
    var thisQuestionAnswersWrapper = $button.closest('.slide-answer-wrapper');
    var thisQuestionWrapper = $button.closest('.slide-inner');
    var thisSlideWrapper = $button.closest('.swiper-slide');
    var thisQuestionType = $(thisSlideWrapper).data('question-type');

    $button.toggleClass('btn--quiz-active');
    checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
    checkQuizMax($(this).closest(".slide-answer-wrapper-categories").data("max-choices-allowed"), thisQuestionAnswersWrapper);
    setActiveCategorySlides(thisQuestionAnswersWrapper);
  });
  $(".other-answer-continue").on("click", function() {
    var singleInputEl = $(this).parent().find('input');
    var singleInput = singleInputEl.val();
    var nothingSelectedEl = $(this).closest(".slide-inner").find('.nothing-selected');

    if (singleInput.length == 0) {
      nothingSelectedEl.slideDown();  
    } else {
      $(this).closest(".slide-inner").find(".btn--answer[data-answer='Other']").attr("data-answer", singleInput);
      $(this).closest(".slide-inner").find(".btn--answer[data-answer='"+singleInput+"']").trigger("click");
    }
  })
  $answerSelector.on('click',function(e){
    var answerValue= $(this).attr('data-answer');
    var skipValue= $(this).data('skip-question');

    var $button = $(this);
    var thisQuestionAnswersWrapper = $button.closest('.slide-answer-wrapper');
    var thisQuestionWrapper = $button.closest('.slide-inner');
    var thisSlideWrapper = $button.closest('.swiper-slide');
    var thisQuestionType = $(thisSlideWrapper).data('question-type');

    // convert this logic to just check if this is a single or multiple answer question
    if ( thisQuestionType == "Yes/No" || thisQuestionType == "Multiple Choice" ) {
      var thisQuestionAnswers = thisQuestionWrapper.find('.btn--quiz');
      $(thisQuestionAnswers).removeClass('btn--quiz-active');
    } else {
      //
    }
    $button.toggleClass('btn--quiz-active');

    if (thisQuestionType == "Yes/No") {
      console.log(skipValue);
      disableSlide(skipValue);
    }
    
    // yes/no questions should automatically continue
    if ( thisQuestionType == "Yes/No" || thisQuestionType == "Multiple Choice" ) {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax(3, thisQuestionAnswersWrapper);
      var thisSlide = $(this).closest('.swiper-slide');
      
      if (answerValue == "Other") {
        $(this).closest(".slide-inner").find(".other-answer-wrapper").addClass("show");
        return false;
      }
      setTimeout(
        function() 
        {
          slideContinueFromThisSlide(thisSlide);    
        }, 300);
    } else {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax(3, thisQuestionAnswersWrapper);

      if (answerValue == "Other") {
        $(this).closest(".slide-inner").find(".other-answer-wrapper").addClass("show");
        return false;
      }
    }

  });
  $("input[type='text']").keypress(function(e){
    if (e.keyCode === 13) {
      if ($(this).attr("id") == "otherAnswer") {
        $(this).closest("form").find(".other-answer-continue").trigger("click");  
      } else {
        $(this).closest("form").find(".inline-continue").trigger("click");
      }
    }
  });
  $inlineContinues.on('click',function(){
    var thisQuestionWrapper = $(this).closest('.slide-inner');
    var singleInputEl = $(this).parent().find('input');
    var singleInput = singleInputEl.val();
    var nothingSlected = $(thisQuestionWrapper).find('.nothing-selected');
    // var nameFields = $("span[data-user-name]");

    if ( singleInput.length === 0 ) {
      $(nothingSlected).text("Please enter your info :)").slideDown();
    } else {
      if (singleInputEl.attr("name") == "userName") {
        if (!/^[A-Za-z\s]+$/.test(singleInput)) {
          $(nothingSlected).text("Invalid Username").slideDown(); 
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userZip") {
        if (!/^\d{5}(-\d{4})?$/.test(singleInput)) {
          $(nothingSlected).text("Invalid Zip Code").slideDown(); 
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userAge") {
        if ( !( singleInput > 1 && singleInput < 100 ) ){
          $(nothingSlected).text("Invalid Age").slideDown();
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userEmail") {
        if (!singleInput.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          $(nothingSlected).text("Invalid Email").slideDown();
          return false;
        }
      }
      if (quiz.name == undefined) {
        $('.dynamic-name').html(singleInput);
        var uniqueSessionEmail = singleInput + "_" + timestamp + "@klevahealthquiz.com";
        quiz.email = uniqueSessionEmail;
        quiz.name = singleInput;
        // $(nameFields).html(singleInput);
      }
      swiper.slideNext();
    }
  });
  $sectionCoverButton.on('click',function(){
    // swiper.slideNext();
    var thisSlide = $(this).closest('.swiper-slide');
    slideContinueFromThisSlide(thisSlide); 
  });
  $continueButton.on('click',function(){
    
    var thisSlide = $(this).closest('.swiper-slide');

    var thisQuestionType = thisSlide.data('question-type');
    var otherOption = thisSlide.find(".btn--answer[data-answer='Other']");
    if ( thisQuestionType == "Multiple Select" && otherOption.hasClass("btn--quiz-active") ) {
      var singleInputEl = thisSlide.find('.single-answer-input');
      var singleInput = singleInputEl.val();
      var nothingSelectedEl = thisSlide.find('.nothing-selected');
  
      if (singleInput.length == 0) {
        nothingSelectedEl.slideDown();
        return false;
      } else {
        otherOption.attr("data-answer", singleInput);
      }
    }

    if (!$(this).hasClass("btn--quiz-continue-inactive")) {
      slideContinueFromThisSlide(thisSlide);  
    } else {
      $(this).closest(".slide-continue-wrapper").find(".nothing-selected").slideDown();
    }
  });
  function slideContinueFromThisSlide(thisSlide) {
    var isScoreableSlide = thisSlide.data('scoreable-slide');
    var selectedAnswersSelector = $(thisSlide).find('.btn--quiz-active');
    var skipQuestionOfSelectedAnswer = $(selectedAnswersSelector).data('skip-question');
    
    if ( !skipQuestionOfSelectedAnswer || skipQuestionOfSelectedAnswer.length === 0 ) {

    } else {
      disableSlide(skipQuestionOfSelectedAnswer);
    }
    if ( isScoreableSlide ) {
      updateProductScores(thisSlide);
    }

    var thisQuestionDataObject = createDataObject(thisSlide);

    var thisContinueWrapper = $(this).closest('.slide-continue-wrapper');
    var nothingSelectedEl = thisContinueWrapper.find('.nothing-selected');
    if ( $(this).hasClass('btn--quiz-continue-inactive') ) {
      nothingSelectedEl.slideDown();
    } else {
      var numberOfSlides = swiper.slides.length;
      var nextSlideIndex = swiper.realIndex + 1;
      var nextSlide = $(swiper.slides[nextSlideIndex]);
      
      for (var i = nextSlideIndex; i < numberOfSlides; i++) { 
        var targetSlide = $(swiper.slides[i]);
        var targetSlideState = targetSlide.data('show-slide');
        if ( targetSlideState ) {
          quiz.questions.push(thisQuestionDataObject);
          quiz.answers['{{ answer from slide '+thisSlide.data('unique-slide-id')+' }}'] = thisSlide.data('answer-value');
          swiper.slideTo(i,10);
          break;
        }
      }
    }

  }
  function disableSlide(id) {
    swiper.slides.each(function(e,i){
      var slideId = $(this).data('unique-slide-id');
      if ( slideId == id ) {
        $(this).attr('data-show-slide',"false");
      }
    });
  }
  function submitToKlaviyo(q) {
    var email = q.email;
    var name = q.name;
    var healthTopics = q.healthCategories.toString();
    var questionsArr = q.questions;

    _learnq.push(['identify', {
      '$email' : email,
      '$first_name' : name,
      '$last_name' : 'KlevaUser',
      'Health Interests' : healthTopics
    }]);

    questionsArr.forEach((item, index)=>{
      var questionID = item.ID;
      var questionText = item.text;
      var questionAnswer = item.answer;
      var qA = questionText + "--" + questionAnswer;

      _learnq.push(['identify', {
        '$email' : email,
        [questionID] : qA
      }]);
    })

    // _learnq.push(['identify', {
    //   '$email' : 'george.washington@example.com',
    //   '$first_name' : 'George',
    //   '$last_name' : 'Washington',
    //   'Birth Year' : 1732
    // }]);
  }
  function createDataObject(slide) {
    var thisSlideText = slide.data('question-text');
    var thisSlideId = slide.data('unique-slide-id');
    var thisSlideType = slide.data('question-type');
    var thisSlideAnswer = slide.data('answer-value');
    var thisQuestionObject = {};
    thisQuestionObject.ID = thisSlideId;
    thisQuestionObject.type = thisSlideType;
    thisQuestionObject.text = thisSlideText;
    thisQuestionObject.answer = thisSlideAnswer;
    return thisQuestionObject;
  }
  function setBreadCrumbsProgress(sectionLabel) {
    switch(sectionLabel) {
      case 'Goals':
        $('#crumbGoals').addClass('current').removeClass('visited');
        $('#crumbLifestyle').removeClass('current').removeClass('visited');
        $('#crumbBasics').removeClass('current').removeClass('visited');
        $('#crumbValues').removeClass('current').removeClass('visited');
        $('#crumbResults').removeClass('current').removeClass('visited');
        break;
      case 'Lifestyle':
        $('#crumbGoals').removeClass('current').addClass('visited');
        $('#crumbLifestyle').addClass('current').removeClass('visited');
        $('#crumbBasics').removeClass('current').removeClass('visited');
        $('#crumbValues').removeClass('current').removeClass('visited');
        $('#crumbResults').removeClass('current').removeClass('visited');
        break;
      case 'Basic':
        $('#crumbGoals').removeClass('current').addClass('visited');
        $('#crumbLifestyle').removeClass('current').addClass('visited');
        $('#crumbBasics').addClass('current').removeClass('visited');
        $('#crumbValues').removeClass('current').removeClass('visited');
        $('#crumbResults').removeClass('current').removeClass('visited');
        break;
      case 'Values & Preferences':
        $('#crumbGoals').removeClass('visited').addClass('visited');
        $('#crumbLifestyle').removeClass('current').addClass('visited');
        $('#crumbBasics').removeClass('current').addClass('visited');
        $('#crumbValues').addClass('current').removeClass('visited');
        $('#crumbResults').removeClass('current').removeClass('visited');
        break;
      case 'Results':
        $('#crumbGoals').removeClass('current').addClass('visited');
        $('#crumbLifestyle').removeClass('current').addClass('visited');
        $('#crumbBasics').removeClass('current').addClass('visited');
        $('#crumbValues').removeClass('current').addClass('visited');
        $('#crumbResults').addClass('current').removeClass('visited');
        break;
      default:
        //
    }
  }
  function updateProductScores(slide) {

    var thisQuestionType = slide.data('question-type');

    switch(thisQuestionType) {
      case "Dynamic Range":
        var selectedAnswer = $(slide).find('.range-dot-wrapper-active');

        var gastroBeanScore = selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans');
      
        slide.attr('data-answer-value',$(selectedAnswer).index() + 1);
        break;
      case "Yes/No":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var gastroBeanScore = selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans');
        slide.attr('data-answer-value',$(selectedAnswer).data('answer'));
        break;
      case "Multiple Choice":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var gastroBeanScore = selectedAnswer.data('score-gastro-beans') == undefined ? 0 : selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi') == undefined ? 0 : selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola') == undefined ? 0 : selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans') == undefined ? 0 : selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans') == undefined ? 0 : selectedAnswer.data('score-sleep-beans');
        slide.attr('data-answer-value',$(selectedAnswer).data('answer'));
        break;
      case "Multiple Select":
        var selectedAnswersArray = [];
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var gastroBeanScore = 0;
        var reishiScore = 0;
        var rhodiolaScore = 0;
        var skinBeansScore = 0;
        var sleepBeansScore = 0;

        selectedAnswer.each(function( index ) {
          selectedAnswersArray.push($(this).data('answer'));
          gastroBeanScore += $(this).data('score-gastro-beans') == undefined ? 0 : $(this).data('score-gastro-beans');
          reishiScore += $(this).data('score-reishi')  == undefined ? 0 : $(this).data('score-reishi');
          rhodiolaScore += $(this).data('score-rhodiola') == undefined ? 0 : $(this).data('score-rhodiola');
          skinBeansScore += $(this).data('score-skin-beans') == undefined ? 0 : $(this).data('score-skin-beans');
          sleepBeansScore += $(this).data('score-sleep-beans') == undefined ? 0 : $(this).data('score-sleep-beans');
        });
        
        var selectedAnswersString = selectedAnswersArray.toString();
        slide.attr('data-answer-value',selectedAnswersString);
        break;
      case "Health Topics Listing":
          var selectedAnswersArray = [];
          var selectedAnswer = $(slide).find('.btn--quiz-active');
          var gastroBeanScore = 0;
          var reishiScore = 0;
          var rhodiolaScore = 0;
          var skinBeansScore = 0;
          var sleepBeansScore = 0;

          selectedAnswer.each(function( index ) {
            selectedAnswersArray.push($(this).data('category'));
          });
          
          var selectedAnswersString = selectedAnswersArray.toString();
          slide.attr('data-answer-value',selectedAnswersString);
          break;
      default:
        var gastroBeanScore = 0;
        var reishiScore = 0;
        var rhodiolaScore = 0;
        var skinBeansScore = 0;
        var sleepBeansScore = 0;
    }

    var currentGastroTotalEl = $('span[data-total-score-gastro-beans]');
    var currentGastroTotal = Math.round(currentGastroTotalEl.data('total-score'));
    console.log(currentGastroTotal);
    console.log(gastroBeanScore);
    var newGastroTotal = currentGastroTotal + gastroBeanScore;
    var currentReishiTotalEl = $('span[data-total-score-reishi]');
    var currentReishiTotal = Math.round(currentReishiTotalEl.data('total-score'));
    var newReishiotal = currentReishiTotal + reishiScore;
    var currentRhodiolaTotalEl = $('span[data-total-score-rhodiola]');
    var currentRhodiolaTotal = Math.round(currentRhodiolaTotalEl.data('total-score'));
    var newRhodiolaTotal = currentRhodiolaTotal + rhodiolaScore;
    var currentSkinBeansTotalEl = $('span[data-total-score-skin-beans]');
    var currentSkinBeansTotal = Math.round(currentSkinBeansTotalEl.data('total-score'));
    var newSkinBeansTotal = currentSkinBeansTotal + skinBeansScore;
    var currentSleepBeanTotalEl = $('span[data-total-score-sleep-beans]');
    var currentSleepBeanTotal = Math.round(currentSleepBeanTotalEl.data('total-score'));
    var newSleepBeanTotal = currentSleepBeanTotal + sleepBeansScore;

    
    console.log(newGastroTotal, newReishiotal, newRhodiolaTotal, newSkinBeansTotal, newSleepBeanTotal);

    currentGastroTotalEl.data('total-score',newGastroTotal).html(newGastroTotal);
    currentReishiTotalEl.data('total-score',newReishiotal).html(newReishiotal);
    currentRhodiolaTotalEl.data('total-score',newRhodiolaTotal).html(newRhodiolaTotal);
    currentSkinBeansTotalEl.data('total-score',newSkinBeansTotal).html(newSkinBeansTotal);
    currentSleepBeanTotalEl.data('total-score',newSleepBeanTotal).html(newSleepBeanTotal);

  }
  function checkQuizContinue(min, answersWrapper, questionWrapper) {
    var countSelected = answersWrapper.find('.btn--quiz-active').length;
    var thisQuestionContinue = questionWrapper.find('.btn--quiz-continue');
    var nothingSelectedEl = questionWrapper.find('.nothing-selected');
    if (countSelected < min ) {
      thisQuestionContinue.addClass('btn--quiz-continue-inactive');
    } else {
      thisQuestionContinue.removeClass('btn--quiz-continue-inactive');
      nothingSelectedEl.slideUp();
    }
  }
  function checkQuizMax(max, parent) {
    var countSelected = parent.find('.btn--quiz-active').length;
    var allAnswers = parent.find('.btn--quiz');
    var allInactiveAnswers = parent.find('.btn--quiz-inactive');
    var inactiveAnswers = allAnswers.not(".btn--quiz-active")
    if (countSelected >= max ) {
      inactiveAnswers.addClass('btn--quiz-inactive');
    } else {
      allInactiveAnswers.removeClass('btn--quiz-inactive');
    }
  }
  function isNextSlideActive(index,swiper) {

  }
  function setActiveCategorySlides(slideWrapper) {
    var categoryButtons = slideWrapper.find('.btn--quiz-active');
    var categoriesSelected = [];
    if ( categoryButtons.length ) {
      categoryButtons.each(function(){
        var buttonCategory = $(this).data('category');
        categoriesSelected.push(buttonCategory);
        quiz.healthCategories = categoriesSelected;
        swiper.slides.each(function(e,i){
          if ( $(this).hasClass('swiper-slide-health-category') ) {
            var slideCategory = $(this).data('slide-category');
            if ( categoriesSelected.includes(slideCategory) ) {
              $(this).attr('data-show-slide',"true");
            } else {
              $(this).attr('data-show-slide',"false");
            }
          }
        });
      });
    } else {
      swiper.slides.each(function(e,i){
        $(this).attr('data-show-slide',"false");
      });
    }
  }
}); /* ready */
