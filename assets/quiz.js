

$(document).ready(function(){
  var people_number = $("#people_number").text();
  $("#MainContent .container").children().each(function() {
    $(this).html($(this).html().replace(/@name/g,"<span class='dynamic-name'></span>"));
    $(this).html($(this).html().replace(/@Name/g,"<span class='dynamic-name'></span>"));
    $(this).html($(this).html().replace(/@people_number/g, people_number));
  });
  var total_goals = 0;
  var total_lifestyle = 0;
  var total_basics = 0;
  var total_values = 0;
  var current_goals = 0;
  var current_lifestyle = 0;
  var current_basics = 0;
  var current_values = 0;
  var timestamp = new Date().getTime();
  var quiz = {};
  var questionsArray = [];
  var answerObject = {};
  var backButtonStatus = 0;
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
  var internalCounter = 0;
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
  
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function(e) {
      var queryString = window.location.search;
      var section_id = queryString.replace("?question=", "");
      var section = $("#"+section_id.trim());
      section.find(".btn--quiz-back").trigger("click");
    });
  }
  function checkForAutomaticTransition(swiper) {
    // temp start
    // var indexBeforeLast = slideLen - 1;
    // var currentSlide = $(swiper.slides[indexBeforeLast]);
    // swiper.slideNext();
    // temp end
    if (swiper.realIndex == 0) {
      $backButton.addClass("hide");
    } else {
      $backButton.removeClass("hide");
    }
    
    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var whyWeAsk = currentSlide.data('why-we-ask');
    var wowSlide = currentSlide.data('question-type');
    
    var queryString = window.location.search;
    var section_id = queryString.replace("?question=", "");
    
    internalCounter++;

    if (section_id.trim() == "") {
      window.history.pushState(null, null, "?question="+currentSlide.attr("id"));  
    } else {
      var section = $("#"+section_id.trim());
      window.history.pushState(null, null, "?question="+currentSlide.attr("id"));
      if (internalCounter <= 1) {
        swiper.slideTo(section.index(),10);  
      }
    }
    
    if (backButtonStatus == 1 && wowSlide == "Yes/No") {
      var prevSkipValue = currentSlide.find('.btn--quiz-active').data('skip-question');
      if (prevSkipValue != '') {
        enableSlide(prevSkipValue);
      }
    }

    if (wowSlide == "Information Page" && quiz.healthCategories.length == 1) {
        var wowText = currentSlide.find(".question-heading").text();
        var singleResult = wowText.replace("those are some great goals", "That's a great goal");
        singleResult = singleResult.replace(/goals/g, "goal");
        currentSlide.find(".question-heading").text(singleResult);
    }
    if (whyWeAsk == '' || whyWeAsk == undefined) {
      $(".why-we-ask").addClass("hide");
    } else {
      $(".why-we-ask").removeClass("hide");
    }
    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var currentSection = currentSlide.data('slide-section');
    $(".why-we-ask .why-we-ask-content p.text").text(whyWeAsk);
    
    var nextSlideIndex = swiper.realIndex + 1;
    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var nextSlide = $(swiper.slides[nextSlideIndex]);

    setBreadCrumbsProgress(currentSection, currentSlide.data("slide-category"), nextSlide.data("slide-category"));
    
    if ( currentSlide.data('transition-time') ) {
      $('.breadcrumbs-progress-wrapper').addClass("hide");
      $('#MainContent .container').addClass("section-cover");
      $('body').addClass("header-transparent");
      
      $(".why-we-ask").addClass("hide");
      // var transitionTime = currentSlide.data('transition-time') * 1000;
      // setTimeout(
      //   function() 
      //   {
      //     swiper.slideNext(300);
      //   }, transitionTime);
    } else {
      if (!currentSlide.find('.slide-inner').hasClass('full-screen') || currentSlide.attr("id") == "calculating_slide") {
        $('#MainContent .container').removeClass("section-cover");
        $('body').removeClass("header-transparent");
        $('.breadcrumbs-progress-wrapper').removeClass("hide");  
      } else {
        $('#MainContent .container').addClass("section-cover");
        $('body').addClass("header-transparent");
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
    $('body').removeClass("header-transparent");
    $('.breadcrumbs-progress-wrapper').addClass("hide");
    $(".calculating-announcement-bar").removeClass('hide');
    $(".calculating-announcement-bar span").text(slideLen + "/" + slideLen + " Questions Completed");
    $(".why-we-ask").addClass("hide");
    submitToKlaviyo(quiz);
    setTimeout(
      function() 
      {
        // $(".pre-product-recommendation").removeClass("hide");        
        // $(".page.page-default").addClass("hide");
        // $(".calculating-announcement-bar").removeClass('show');
        quizResultFunc();
        location.href = "https://reprisehealth.com/pages/recommendations";
      }, 5000
    );
  }
  // country list vertical slider - start
  var initial_slick_var = 0;
  $('.vertical-slide-item-wrapper .inner-wrapper').on('wheel', (function(e) {
    e.preventDefault();

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
  // country list vertical slider - end

  $(".why-we-ask-button").on("click", function(e) {
    $(this).closest(".why-we-ask").find(".why-we-ask-content").removeClass("hide");
  })
  $(".why-we-ask").on("click", ".why-we-ask-content", function() {
    $(this).addClass("hide");
  })
  
  // $("#checkout_our_recommendations").on("click", function() {
  //   quizResultFunc();
  // })
  
  $backButton.on('click', function() {
    backButtonStatus = 1;
    var preSlideIndex = swiper.realIndex - 1;
    var prevSlide = $(swiper.slides[preSlideIndex]);

    for (var i = preSlideIndex; i >= 0; i--) { 
      var targetSlide = $(swiper.slides[i]);
      var targetSlideState = targetSlide.data('show-slide');
      if ( targetSlideState ) {
        quiz.questions.pop();
        delete quiz.answers['{{ answer from slide '+prevSlide.data('unique-slide-id')+' }}'];
        swiper.slideTo(i,10);
        break;
      }
    }
    if (prevSlide.data('scoreable-slide')) {
      updateProductScores(prevSlide, "minus");  
    }
  })
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
    $(this).closest(".number-range").find(".range-slider-bar").val(parseInt($(this).data("index")));
    
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
      if (answerValue != "Other") {
        $(thisQuestionAnswers).removeClass('btn--quiz-active');  
      }
    } else {
      //
    }

    $button.toggleClass('btn--quiz-active');

    if (thisQuestionType == "Yes/No") {
      disableSlide(skipValue);
    }
    
    // yes/no questions should automatically continue
    if ( thisQuestionType == "Yes/No" || thisQuestionType == "Multiple Choice" ) {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax(3, thisQuestionAnswersWrapper);
      var thisSlide = $button.closest('.swiper-slide');
      
      if (answerValue == "Other") {
        $button.closest(".slide-inner").find(".other-answer-wrapper").toggleClass("show");
        return false;
      }

      setTimeout(
        function() 
        {
          slideContinueFromThisSlide(thisSlide);    
        }, 100);
    } else {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax($(this).closest(".slide-answer-wrapper").data("max-choices-allowed"), thisQuestionAnswersWrapper);

      if (answerValue == "Other") {
        $button.closest(".slide-inner").find(".other-answer-wrapper").toggleClass("show");
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
      if (singleInputEl.attr("name") == "userText") {
        if (!/^[A-Za-z\s]+$/.test(singleInput)) {
          $(nothingSlected).slideDown();
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userZip") {
        if (!/^\d{5}(-\d{4})?$/.test(singleInput)) {
          $(nothingSlected).slideDown(); 
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userNumber") {
        var min = singleInputEl.data("min") != "" ? singleInputEl.data("min") : 1;
        var max = singleInputEl.data("max") != "" ? singleInputEl.data("max") : 1000;
        if ( !( singleInput >= min && singleInput <= max ) ){
          $(nothingSlected).slideDown();
          return false;
        }
      }
      if (singleInputEl.attr("name") == "userEmail") {
        if (!singleInput.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          $(nothingSlected).slideDown();
          return false;
        }
        quiz.email = singleInput;
      }
      if (quiz.name == undefined) {
        $('.dynamic-name').html(singleInput);
        var uniqueSessionEmail = singleInput + "_" + timestamp + "@klevahealthquiz.com";
        quiz.email = uniqueSessionEmail;
        quiz.name = singleInput;
        // $(nameFields).html(singleInput);
      }
      // swiper.slideNext();
      inlineContinueSkipFunc();
    }
  });
  function inlineContinueSkipFunc() {
    var numberOfSlides = swiper.slides.length;
    var nextSlideIndex = swiper.realIndex + 1;
    for (var i = nextSlideIndex; i < numberOfSlides; i++) {
      var targetSlide = $(swiper.slides[i]);
      var targetSlideState = targetSlide.attr('data-show-slide');
      if ( targetSlideState == "true" ) {
        swiper.slideTo(i,10);
        break;
      }
    }
  }
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
  // Select top 3 products from quiz result - start.
  function quizResultFunc() {
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
    localStorage.setItem('recommend_product_handles', topHandleArr);
    localStorage.setItem('user_name',  quiz.name);

    var cat_arr = quiz.healthCategories;
    var cat_names = AdjustString(cat_arr);
    localStorage.setItem('categories',  cat_names);
  }
  // Select top 3 products from quiz result - end.
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
  function slideContinueFromThisSlide(thisSlide) {
    var isScoreableSlide = thisSlide.data('scoreable-slide');
    var selectedAnswersSelector = $(thisSlide).find('.btn--quiz-active');
    var skipQuestionOfSelectedAnswer = $(selectedAnswersSelector).data('skip-question');
    
    if ( !skipQuestionOfSelectedAnswer || skipQuestionOfSelectedAnswer.length === 0 ) {

    } else {
      disableSlide(skipQuestionOfSelectedAnswer);
    }
    if ( isScoreableSlide ) {
      updateProductScores(thisSlide, "plus");
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
        var targetSlideState = targetSlide.attr('data-show-slide');
        if ( targetSlideState == "true" ) {
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
  function enableSlide(id) {
    swiper.slides.each(function(e,i){
      var slideId = $(this).data('unique-slide-id');
      if ( slideId == id ) {
        $(this).attr('data-show-slide',"true");
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
        [questionText] : questionAnswer
      }]);
    })
  }
  function createDataObject(slide) {
    var thisSlideText = slide.data('question-text');
    var thisSlideId = slide.data('unique-slide-id');
    var thisSlideType = slide.data('question-type');
    var thisSlideAnswer = slide.data('answer-value');
    var thisQuestionObject = {};
    thisQuestionObject.ID = thisSlideId;
    thisQuestionObject.type = thisSlideType;
    thisQuestionObject.text = thisSlideText.replace( /(<([^>]+)>)/ig, '');
    thisQuestionObject.answer = thisSlideAnswer;
    return thisQuestionObject;
  }
  function setBreadCrumbsProgress(sectionLabel, currentSlideCategory, nextSlideCategory) {
    

    switch(sectionLabel) {
      case 'Goals':
        $('.crumbGoals').addClass('current').removeClass('visited');
        $('.crumbLifestyle').removeClass('current').removeClass('visited');
        $('.crumbBasics').removeClass('current').removeClass('visited');
        $('.crumbValues').removeClass('current').removeClass('visited');
        $('.crumbResults').removeClass('current').removeClass('visited');
        if (backButtonStatus) {
          if (currentSlideCategory == nextSlideCategory) {
            current_goals--;
          }
        } else {
          current_goals++;
        }
        backButtonStatus = 0;
        total_goals = total_goals == 0 ? $("#questionSectionNumbers").attr("data-goals-number") : total_goals;
        $(".quizProgressBar .crumbGoals .subProgressBar").css("background", "#000");
        $(".quizProgressBar .crumbGoals .subProgressBar").css("width", "calc((100% + 50px) * "+ current_goals +" / "+ total_goals +")");
        break;
      case 'Lifestyle':
        $('.crumbGoals').removeClass('current').addClass('visited');
        $('.crumbLifestyle').addClass('current').removeClass('visited');
        $('.crumbBasics').removeClass('current').removeClass('visited');
        $('.crumbValues').removeClass('current').removeClass('visited');
        $('.crumbResults').removeClass('current').removeClass('visited');
        
        if (backButtonStatus) {
          if (currentSlideCategory == nextSlideCategory) {
            current_lifestyle--;
          }
          current_lifestyle = current_lifestyle == 1 ? 0 : current_lifestyle;
        } else {
          current_lifestyle++;
        }
        backButtonStatus = 0;
        total_lifestyle = total_lifestyle == 0 ? $("#questionSectionNumbers").attr("data-lifestyle-number") : total_lifestyle;
        $(".quizProgressBar .crumbLifestyle .subProgressBar").css("background", "#000");
        $(".quizProgressBar .crumbLifestyle .subProgressBar").css("width", "calc((100% + 50px) * "+ current_lifestyle +" / "+ total_lifestyle +")");
        break;
      case 'Basic':
        $('.crumbGoals').removeClass('current').addClass('visited');
        $('.crumbLifestyle').removeClass('current').addClass('visited');
        $('.crumbBasics').addClass('current').removeClass('visited');
        $('.crumbValues').removeClass('current').removeClass('visited');
        $('.crumbResults').removeClass('current').removeClass('visited');
        
        if (backButtonStatus) {
          if (currentSlideCategory == nextSlideCategory) {
            current_basics--;
          }
          current_basics = current_basics == 1 ? 0 : current_basics;
        } else {
          current_basics++;
        }
        backButtonStatus = 0;
        total_basics = total_basics == 0 ? $("#questionSectionNumbers").attr("data-basics-number") : total_basics;
        $(".quizProgressBar .crumbBasics .subProgressBar").css("background", "#000");
        $(".quizProgressBar .crumbBasics .subProgressBar").css("width", "calc((100% + 50px) * "+ current_basics +" / "+ total_basics +")");
        break;
      case 'Values & Preferences':
        $('.crumbGoals').removeClass('visited').addClass('visited');
        $('.crumbLifestyle').removeClass('current').addClass('visited');
        $('.crumbBasics').removeClass('current').addClass('visited');
        $('.crumbValues').addClass('current').removeClass('visited');
        $('.crumbResults').removeClass('current').removeClass('visited');
        
        if (backButtonStatus) {
          if (currentSlideCategory == nextSlideCategory) {
            current_values--;
          }
          current_values = current_values == 1 ? 0 : current_values;
        } else {
          current_values++;
        }
        backButtonStatus = 0;
        total_values = total_values == 0 ? $("#questionSectionNumbers").attr("data-values-number") : total_values;
        $(".quizProgressBar .crumbValues .subProgressBar").css("background", "#000");
        $(".quizProgressBar .crumbValues .subProgressBar").css("width", "calc((100% + 50px) * "+ current_values +" / "+ total_values +")");
        break;
      case 'Results':
        $('.crumbGoals').removeClass('current').addClass('visited');
        $('.crumbLifestyle').removeClass('current').addClass('visited');
        $('.crumbBasics').removeClass('current').addClass('visited');
        $('.crumbValues').removeClass('current').addClass('visited');
        $('.crumbResults').addClass('current').removeClass('visited');
        break;
      default:
        $(".quizProgressBar .crumbGoals .subProgressBar").css("width", "0px");
        backButtonStatus = 0;
        current_goals = 0;
    }
  }
  function getProductScores(answer) {
    var scores = [];
    $("#devScoreWrapper .product-score-wrapper").each(function() {
      var handle = $(this).find("span[data-product-handle]").text();
      var subArr = [];
      var score = 0;

      answer.each(function() {
        var scoreFilter = $(this).data('score-'+handle) == undefined ? 0 : $(this).data('score-'+handle);
        score += scoreFilter;
      })

      subArr.push(score);
      subArr.push(handle);

      scores.push(subArr);
    })
    return scores;
  }
  function calcTotalScores(arr, flag) {
    if (arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var currentTotalEl = $('span[data-total-score-'+item[1]+']');
        var currentTotal = Math.round(currentTotalEl.attr('data-total-score'));
        var newTotal = flag == "plus" ? (currentTotal + item[0]) : (currentTotal - item[0]);
        currentTotalEl.attr('data-total-score',newTotal).html(newTotal);
      }
    }
  }
  function updateProductScores(slide, flag="plus") {
    var thisQuestionType = slide.data('question-type');

    switch(thisQuestionType) {
      case "Dynamic Range":
        var selectedAnswer = $(slide).find('.range-dot-wrapper-active');
        var scoresArr = getProductScores(selectedAnswer);
        slide.attr('data-answer-value',$(selectedAnswer).index() + 1);
        break;
      case "Yes/No":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var scoresArr = getProductScores(selectedAnswer);
        slide.attr('data-answer-value',$(selectedAnswer).data('answer'));
        break;
      case "Multiple Choice":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var scoresArr = getProductScores(selectedAnswer);
        slide.attr('data-answer-value',$(selectedAnswer).data('answer'));
        break;
      case "Multiple Select":
        var selectedAnswersArray = [];
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var scoresArr = getProductScores(selectedAnswer);

        selectedAnswer.each(function( index ) {
          selectedAnswersArray.push($(this).data('answer'));
        });
        
        slide.attr('data-answer-value',selectedAnswersArray.toString());
        break;
      case "Health Topics Listing":
          var selectedAnswersArray = [];
          var selectedAnswer = $(slide).find('.btn--quiz-active');
          var scoresArr = [];

          selectedAnswer.each(function( index ) {
            selectedAnswersArray.push($(this).data('category'));
          });
          
          slide.attr('data-answer-value',selectedAnswersArray.toString());
          break;
      default:
        var scoresArr = [];
    }
    
    calcTotalScores(scoresArr, flag);
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
    max = max == '' ? 1 : max;
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
    total_goals = 0;
    total_lifestyle = 0;
    total_basics = 0;
    total_values = 0;
    var categoriesSelected = [];

    var categoryButtons = slideWrapper.find('.btn--quiz-active');

    if ( categoryButtons.length ) {
      categoryButtons.each(function(){
        var buttonCategory = $(this).data('category');
        categoriesSelected.push(buttonCategory);
        quiz.healthCategories = categoriesSelected;
      });
      swiper.slides.each(function(e,i){
        if ( $(this).hasClass('swiper-slide-health-category') ) {
          var slideCategory = $(this).data('slide-category');
          if ( categoriesSelected.includes(slideCategory) ) {
            $(this).attr('data-show-slide',"true");
            adjustQuestionNumber($(this), true);
          } else {
            $(this).attr('data-show-slide',"false");
          }
        }
      });
    } else {
      swiper.slides.each(function(e,i){
        $(this).attr('data-show-slide',"false");
      });
    }
  }
  function adjustQuestionNumber(currentSection, flag) {
    var section_type = currentSection.data("slide-section");
    switch(section_type) {
      case 'Goals':
        if (flag) {
            total_goals = total_goals + 1;
            $("#questionSectionNumbers").attr("data-goals-number", total_goals);
        }
        break;
      case 'Lifestyle':
        if (flag) {
          total_lifestyle = total_lifestyle + 1;
          $("#questionSectionNumbers").attr("data-lifestyle-number", total_lifestyle);
        }
        break;
      case 'Basic':
        if (flag) {
          total_basics = total_basics + 1;
          $("#questionSectionNumbers").attr("data-basics-number", total_basics);
        }
        break;
      case 'Values & Preferences':
        if (flag) {
          total_values = total_values + 1;
          $("#questionSectionNumbers").attr("data-values-number", total_values);
        }
        break;
      case 'Results':
        
        break;
      default:
        //
    }
  }
});