

$(document).ready(function(){
  $("#MainContent .container").children().each(function() {
    $(this).html($(this).html().replace(/@name/g,'<span class="dynamic-name"></span>'));
  });

  var timestamp = new Date().getTime();
  var quiz = {};
  var questionsArray = [];
  quiz.questions = questionsArray;
  var $sectionCoverButton = $('.btn-section-cover');
  var $continueButton = $('.btn--quiz-continue');
  var $backButton = $('.btn--quiz-back');
  var $answerSelector = $('.btn--answer');
  var $categorySelector = $('.btn--category');
  var $rangeAnswer = $('.range-dot-wrapper');
  var $inlineContinues = $('form .inline-continue');
  console.log({ timestamp });
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
    if (swiper.realIndex == 0) {
      $backButton.addClass("hide");
    } else {
      $backButton.removeClass("hide");
    }

    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var whyWeAsk = currentSlide.data('why-we-ask');
    var offset = currentSlide.find(".slide-bottom").offset();

    if (whyWeAsk == '' || whyWeAsk == undefined) {
      $(".sidebar-button-slide").addClass("hide");
    } else {
      $(".sidebar-button-slide").removeClass("hide");
      $(".sidebar-button-slide .inner p").text(whyWeAsk);
      if (offset != undefined) {
        $(".sidebar-button-slide").css('top', offset.top);
      }
    }
    // temp start
    // var indexBeforeLast = slideLen - 1;
    // var currentSlide = $(swiper.slides[indexBeforeLast]);
    // swiper.slideNext();
    // temp end
    var currentSlide = $(swiper.slides[swiper.realIndex]);
    var currentSection = currentSlide.data('slide-section');
    var whyWeAsk = currentSlide.data('why-we-ask');
    $(".sidebar-button-slide .inner p").text(whyWeAsk);

    setBreadCrumbsProgress(currentSection);
    
    if ( currentSlide.data('transition-time') ) {
      $('.breadcrumbs-progress-wrapper').addClass("hide");
      $('#MainContent .container').addClass("section-cover");
      $(".sidebar-button-slide").addClass("hide");
      // var transitionTime = currentSlide.data('transition-time') * 1000;
      // setTimeout(
      //   function() 
      //   {
      //     swiper.slideNext(300);
      //   }, transitionTime);
    } else {
      if (!currentSlide.hasClass('calculating-slide')) {
        $('.breadcrumbs-progress-wrapper').removeClass("hide");  
      }
      $('#MainContent .container').removeClass("section-cover");
    }
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
        var cat_names = '';
        var cat_arr = quiz.healthCategories;

        for (var i = 0; i < cat_arr.length; i++) {
          cat_names += cat_arr[i];
          if (cat_arr.length > 1) {
            if (i < cat_arr.length - 1) {
              if (cat_arr.length >= 2 && i == cat_arr.length - 2) {
                cat_names += " and ";
              } else {
                cat_names += ", ";
              }
            }
          }
        }

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
  $(".btn-right-arrow-wrapper").closest(".bottom").on("click", function() {
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
      console.log(response);
      if (response.status == 200) {
        location.href='/cart';  
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  })
  $backButton.on('click', 'span', function() {
    swiper.slidePrev();
  })
  $backButton.on('click', 'img', function() {
    swiper.slidePrev();
  })
  $rangeAnswer.on('click',function(e){
    console.log($(this));
    var thisSlide = $(this).closest('.swiper-slide');
    var thisQuestion = this.closest('.number-range');
    var thisRangeBar = $(thisQuestion).find('.range-bar-inner');
    var thisRangeBarItems = thisRangeBar.find('.range-bar-item');
    var thisEmoticonWrapper = $(thisQuestion).find('.range-emoticon');
    var thisMessageWrapper = $(thisQuestion).find('.range-message');
    var emoticonImages = $(thisEmoticonWrapper).find('img');
    var emoticonMessages = $(thisMessageWrapper).find('p');
    var index = $(this).index();
    //console.log(thisSlide);
    //$(thisSlide).data('answer-value',index);

    
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

  $answerSelector.on('click',function(e){
    var answerValue= $(this).data('answer');
    var skipValue= $(this).data('skip-question');
    console.log({answerValue}, {skipValue}, skipValue.length);

    var $button = $(this);
    var thisQuestionAnswersWrapper = $button.closest('.slide-answer-wrapper');
    var thisQuestionWrapper = $button.closest('.slide-inner');
    var thisSlideWrapper = $button.closest('.swiper-slide');
    var thisQuestionType = $(thisSlideWrapper).data('question-type');
    console.log({thisQuestionType});

    // convert this logic to just check if this is a single or multiple answer question
    if ( thisQuestionType == "Yes/No" || thisQuestionType == "Multiple Choice" ) {
      var thisQuestionAnswers = thisQuestionWrapper.find('.btn--quiz');
      $(thisQuestionAnswers).removeClass('btn--quiz-active');
    } else {
      //
    }
    $button.toggleClass('btn--quiz-active');

    // yes/no questions should automatically continue
    if ( thisQuestionType == "Yes/No" || thisQuestionType == "Multiple Choice" ) {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax(3, thisQuestionAnswersWrapper);
      var thisSlide = $(this).closest('.swiper-slide');
      slideContinueFromThisSlide(thisSlide);
    } else {
      checkQuizContinue(1, thisQuestionAnswersWrapper, thisQuestionWrapper);
      checkQuizMax(3, thisQuestionAnswersWrapper);
    }

  });

  $inlineContinues.on('click',function(){
    var thisQuestionWrapper = $(this).closest('.slide-inner');
    var singleInputEl = $(this).parent().find('input');
    var singleInput = singleInputEl.val();
    var nothingSlected = $(thisQuestionWrapper).find('.nothing-selected');
    var nameFields = $("span[data-user-name]");

    if ( singleInput.length === 0 ) {
      $(nothingSlected).slideDown();
    } else {
      if (quiz.name == undefined) {
        $('.dynamic-name').html(singleInput);
        var uniqueSessionEmail = singleInput + "_" + timestamp + "@klevahealthquiz.com";
        quiz.email = uniqueSessionEmail;
        quiz.name = singleInput;
        // $(nameFields).html(singleInput);
      }
      swiper.slideNext();
      console.log(quiz);
    }
  });
  $sectionCoverButton.on('click',function(){
    swiper.slideNext();
  });
  $continueButton.on('click',function(){
    var thisSlide = $(this).closest('.swiper-slide');
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
      console.log('we better skip a question ******************************************');
      disableSlide(skipQuestionOfSelectedAnswer);
    }
    if ( isScoreableSlide ) {
      updateProductScores(thisSlide);
    }

    var thisQuestionDataObject = createDataObject(thisSlide);

    var thisContinueWrapper = $(this).closest('.slide-continue-wrapper');
    var nothingSelectedEl = thisContinueWrapper.find('.nothing-selected');
    if ( $(this).hasClass('btn--quiz-continue-inactive') ) {
      console.log(nothingSelectedEl);
      nothingSelectedEl.slideDown();

    } else {
      var numberOfSlides = swiper.slides.length;
      var nextSlideIndex = swiper.realIndex + 1;
      var nextSlide = $(swiper.slides[nextSlideIndex]);
      
      for (var i = nextSlideIndex; i < numberOfSlides; i++) { 
        var targetSlide = $(swiper.slides[i]);
        var targetSlideState = targetSlide.data('show-slide');
        //console.log('looping through slides', i, {targetSlideState}, {nextSlideIndex}, {numberOfSlides});
        if ( targetSlideState ) {
          quiz.questions.push(thisQuestionDataObject);
          //submitToKlaviyo(quiz);
          //console.log(quiz);
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
    console.log(email, name, healthTopics, _learnq);

    _learnq.push(['identify', {
      '$email' : email,
      '$first_name' : name,
      '$last_name' : 'KlevaUser',
      'Health Interests' : healthTopics
    }]);

    questionsArr.forEach((item, index)=>{
      console.log(index, item)
      var questionID = item.ID;
      var questionText = item.text;
      var questionAnswer = item.answer;
      var qA = questionText + "--" + questionAnswer;

      _learnq.push(['identify', {
        '$email' : email,
        [questionID] : qA
      }]);
    })


/*
    _learnq.push(['identify', {
      '$email' : 'george.washington@example.com',
      '$first_name' : 'George',
      '$last_name' : 'Washington',
      'Birth Year' : 1732
    }]);
*/
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
      case 'Values':
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
    // console.log('update product scores', {thisQuestionType});

    switch(thisQuestionType) {
      case "Dynamic Range":
        var selectedAnswer = $(slide).find('.range-dot-wrapper-active');

        var gastroBeanScore = selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans');
        var alertMessage = "Gastro Bean Adjustment: " + gastroBeanScore;
        alertMessage += " -- Reishi Adjustment: " + reishiScore;
        alertMessage += " -- Rhodiola Adjustment: " + rhodiolaScore;
        alertMessage += " -- Skin Bean Adjustment: " + skinBeansScore;
        alertMessage += " -- Sleep Bean Adjustment: " + sleepBeansScore;
      
        slide.attr('data-answer-value',$(selectedAnswer).index() + 1);
        break;
      case "Yes/No":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var gastroBeanScore = selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans');
        var alertMessage = "Gastro Bean Adjustment: " + gastroBeanScore;
        alertMessage += " -- Reishi Adjustment: " + reishiScore;
        alertMessage += " -- Rhodiola Adjustment: " + rhodiolaScore;
        alertMessage += " -- Skin Bean Adjustment: " + skinBeansScore;
        alertMessage += " -- Sleep Bean Adjustment: " + sleepBeansScore;
        console.log(alertMessage);
        slide.attr('data-answer-value',$(selectedAnswer).data('answer'));
        break;
      case "Multiple Choice":
        var selectedAnswer = $(slide).find('.btn--quiz-active');
        var gastroBeanScore = selectedAnswer.data('score-gastro-beans') == undefined ? 0 : selectedAnswer.data('score-gastro-beans');
        var reishiScore = selectedAnswer.data('score-reishi') == undefined ? 0 : selectedAnswer.data('score-reishi');
        var rhodiolaScore = selectedAnswer.data('score-rhodiola') == undefined ? 0 : selectedAnswer.data('score-rhodiola');
        var skinBeansScore = selectedAnswer.data('score-skin-beans') == undefined ? 0 : selectedAnswer.data('score-skin-beans');
        var sleepBeansScore = selectedAnswer.data('score-sleep-beans') == undefined ? 0 : selectedAnswer.data('score-sleep-beans');
        var alertMessage = "Gastro Bean Adjustment: " + gastroBeanScore;
        alertMessage += " -- Reishi Adjustment: " + reishiScore;
        alertMessage += " -- Rhodiola Adjustment: " + rhodiolaScore;
        alertMessage += " -- Skin Bean Adjustment: " + skinBeansScore;
        alertMessage += " -- Sleep Bean Adjustment: " + sleepBeansScore;
        console.log(alertMessage);
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
          gastroBeanScore += $(this).data('score-gastro-beans');
          reishiScore += $(this).data('score-reishi');
          rhodiolaScore += $(this).data('score-rhodiola');
          skinBeansScore += $(this).data('score-skin-beans');
          sleepBeansScore += $(this).data('score-sleep-beans');
        });

        var alertMessage = "Gastro Bean Adjustment: " + gastroBeanScore;
        alertMessage += " -- Reishi Adjustment: " + reishiScore;
        alertMessage += " -- Rhodiola Adjustment: " + rhodiolaScore;
        alertMessage += " -- Skin Bean Adjustment: " + skinBeansScore;
        alertMessage += " -- Sleep Bean Adjustment: " + sleepBeansScore;
        console.log(alertMessage);
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
    console.log(quiz);
  }


}); /* ready */
