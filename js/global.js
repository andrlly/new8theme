var _functions = {}, bLazy;

jQuery(function($) {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, winScr, footerH, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
		_isresponsive = $('#header-toggle').is(':visible');
		footerH = $('footer').outerHeight();
		$('.page-height').css({'height':winH - $('header+*').offset().top});

		if($('.content-sidebar-wrapper').length) {
			var h1 = winH - $('.content-sidebar-wrapper').offset().top - footerH,
				h2 = $('.content-sidebar-wrapper > .container').height();
			if(h2>h1) h1 = winH - $('.content-sidebar-wrapper').offset().top;
			$('.content-sidebar-wrapper').css({'min-height':h1});
		}

		if($('.page-min-height-wrapper').length) {
			var h1 = winH - $('.page-min-height-wrapper').offset().top - footerH,
				h2 = $('.page-min-height-wrapper > .container').height();
			if(h2>h1) h1 = winH - $('.page-min-height-wrapper').offset().top;
			$('.page-min-height-wrapper').css({'height':h1});
		}
	};

	_functions.initSelect = function(){
		if(!$('.SlectBox').length) return false;
		$('.SlectBox').SumoSelect({ csvDispCount: 3, search: false, searchText:'Search', noMatch:'No matches for "{0}"', floatWidth: 0, okCancelInMulti: true, placeholder: 'This is a placeholder' });
	};

	/*==============================*/
	/* 06 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
		if(winScr > 100) $('header').addClass('scrolled');
		else $('header').removeClass('scrolled');
		if($('.img-animate-14 img').length && winScr+winH>=$('.img-animate-14').offset().top){
			$('.img-animate-14 img').css({'transform':'translateY('+(winScr+winH-$('.img-animate-14').offset().top)/-3+'px)'});
		}
	};

	_functions.scrollCall();

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/
	if(_ismobile) $('html, body').addClass('mobile');
	_functions.pageCalculations();
	_functions.initSelect();
	_functions.scrollCall();

	/*============================*/
	/* 04 - function on page load */
	/*============================*/
	$(window).load(function(){
		_functions.initSwiper();
		$('html').addClass('loaded');
		$('#loader-wrapper').fadeOut();

		//lazy
		bLazy = new Blazy({ 
	        success: function(ele){
	            $(ele).prev().removeClass('loading');
	        }, error: function(ele, msg){
	            if(msg === 'missing'){
	                // Data-src is missing
	            }
	            else if(msg === 'invalid'){
	                // Data-src is invalid
	            }  
	        }
	    });

		$('.slide').each(function(index, element){
	        var watcher = scrollMonitor.create( element, -$(window).height()*0.3 );
	        watcher.enterViewport(function() {
	        	$(element).addClass('active').find('[class*="se-"]').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
	        	    $(this).addClass('done');
	        	});
	            watcher.destroy();
	        });
	    });

	});

	/*==============================*/
	/* 05 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*=====================*/
	/* 07 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	function setParams(swiper, dataValue, returnValue){
		return (swiper.is('[data-'+dataValue+']'))?((typeof swiper.data(dataValue)!="string")?parseInt(swiper.data(dataValue), 10):swiper.data(dataValue)):returnValue;
	}
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);	

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.parent().find('.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('.swiper-button-next').addClass('swiper-button-next-'+index);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: setParams($t,'slides-per-view',1),
		        slidesPerGroup: ($t.data('center')!='1')?setParams($t,'slides-per-view',1):1,
		        autoHeight: setParams($t,'autoheight',0),
		        loop: setParams($t,'loop',0),
		        loopedSlides: 3,
		        //loopAdditionalSlides: 3,
				autoplay: setParams($t,'autoplay',0),
				centeredSlides: setParams($t,'center',0),
		        breakpoints: ($t.is('[data-breakpoints]'))? { 
		        	767: { slidesPerView: ($t.attr('data-xs-slides')!='auto')?parseInt($t.attr('data-xs-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-xs-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-xs-slides'), 10):1 }, 
		        	991: { slidesPerView: ($t.attr('data-sm-slides')!='auto')?parseInt($t.attr('data-sm-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-sm-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-sm-slides'), 10):1 }, 
		        	1199: { slidesPerView: ($t.attr('data-md-slides')!='auto')?parseInt($t.attr('data-md-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-md-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-md-slides'), 10):1 }, 
		        	1370: { slidesPerView: ($t.attr('data-lt-slides')!='auto')?parseInt($t.attr('data-lt-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-lt-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-lt-slides'), 10):1 } } : {},
		        initialSlide: setParams($t,'initialslide',0),
		        speed: setParams($t,'speed',500),
		        parallax: setParams($t,'parallax',0),
		        slideToClickedSlide: setParams($t,'clickedslide',0),
		        mousewheelControl: setParams($t,'mousewheel',0),
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
		        spaceBetween: setParams($t,'space',0),
		        watchSlidesProgress: true,
		        keyboardControl: true,
		        mousewheelReleaseOnEdges: true,
		        preloadImages: false,
		        lazyLoading: true,
		        lazyLoadingInPrevNext: true,
		        lazyLoadingInPrevNextAmount: 1,
		        lazyLoadingOnTransitionStart: true,
		        roundLengths: true

			});
			swipers['swiper-'+index].update();
			initIterator++;
		});
		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')];
		});
	};

	/*==============================*/
	/* 08 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	_functions.openPopup = function(foo, href){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper').addClass('active');
		foo.addClass('active');
		$('html').addClass('overflow-hidden');
	};

	_functions.closePopup = function(){
		$('.popup-wrapper, .popup-content').removeClass('active');
		$('html').removeClass('overflow-hidden');
		$('#video-popup iframe').remove();
	};

	_functions.textPopup = function(title, message){
		$('#text-popup .text-popup-title').html(title);
		$('#text-popup .text-popup-message').html(message);
		_functions.openPopup($('#text-popup'));
	};

	_functions.videoPopup = function(src){
		$('#video-popup .embed-responsive').html('<iframe src="'+src+'"></iframe>');
		_functions.openPopup($('#video-popup'));
	};

	_functions.subPopup = function(){
		_functions.openPopup($('#subscription-popup'));
	};

	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		_functions.openPopup($('.popup-content[data-rel="'+$(this).data('rel')+'"]'));
	});

	$(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(e){
		e.preventDefault();
		_functions.closePopup();
	});

	$('.video').on('click', function(e){
		e.preventDefault();
		_functions.videoPopup($(this).data('src'));
	});

	$('.open-new-popup, .new-popup .toggle-new-popup').on('click', function(){
		$('.new-popup').toggleClass('active');
	});

	//tour popups
	$('.goto-step').on('click', function(){
		var step = $(this).data('rel');
		if(step=="close"){
			$('.tour-popup').removeClass('active');
			$('.step-tooltip').removeClass('div-active-step');
			$('.div-active-step').removeClass('div-active-step');
		}else{
			$('.tour-popup .step').removeClass('active');
			$('.tour-popup .step[data-rel="'+step+'"]').addClass('active');
			$('.div-active-step').removeClass('div-active-step');
			$('[data-step="'+step+'"]').addClass('div-active-step');
			if($('[data-step="'+step+'"]').length) $('body, html').stop().animate({'scrollTop': $('[data-step="'+step+'"]').offset().top - winH/2 + $('[data-step="'+step+'"]').height()/2});
		}
	});

	//close tour popup after clicking on background
	$('.div-active-step, .tour-popup').on('click',function(e){
		e.preventDefault();
		if (e.target !== this)
    		return;

    	$('.tour-popup').removeClass('active');
		$('.step-tooltip').removeClass('div-active-step');
		$('.div-active-step').removeClass('div-active-step');
	});

	
	//header responsive
	$('#header-toggle').on('click', function(){
		$(this).toggleClass('active');
		$('header').toggleClass('active');
	});

	//fixed button 
	var button = $('.fixed-button-container');
	var buttonFixed = $('.fixed-button-container .open-new-popup');
	var buttonOffset = button.offset();
	function fixedButton () {
		if (button.length) {
			buttonFixed.css('width', button.parent().width());
			if ($(window).width() > 992 && $(window).scrollTop() > buttonOffset.top / 2 ) {
				button.addClass('fixed-button').css({
					top:(buttonOffset.top / 2) - 60,
				});
			}else {
				button.removeClass('fixed-button');
				buttonFixed.css('width', 'auto');
			}
		}
	}
	$(window).on('resize scroll',function(){
		fixedButton();
	});

	//create account checkbox
	$('.create-account-field .input-checkbox').change(function(event) {
		if ($('.create-account-field .input-checkbox').is(':checked')) {
			$('.create-account').slideDown('fast');
		}else {
			$('.create-account').slideUp('fast');
		}
	});

	//price table
	$('.price-table .select-price').change(function(event) {
		var selectThis = $(this);
		if (selectThis.hasClass('standart')) {
			var priceObject = {
				one : [9,85],
				six : [7,24],
				twelve : [6,51],
				twentyFour: [4,95]
			};

			var minPrice = parseFloat(priceObject.one[0]+"."+priceObject.one[1]).toFixed(2);
			var saveNum,savePrice,priceNum;

			switch(selectThis.val()) {
				case "1" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.one[0]+"<sup>,"+priceObject.one[1]+"</sup></b>");
					selectThis.parent().parent().find('.save-price').html('');
					break;

				// case "3" :
				// 	selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.three[0]+"<sup>,"+priceObject.three[1]+"</sup></b>");
				// 	break;

				case "6" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.six[0]+"<sup>,"+priceObject.six[1]+"</sup></b>");
					
					priceNum = parseFloat(priceObject.six[0]+"."+priceObject.six[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					break;

				case "12" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.twelve[0]+"<sup>,"+priceObject.twelve[1]+"</sup></b>");
					
					priceNum = parseFloat(priceObject.twelve[0]+"."+priceObject.twelve[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					
					break;

				case "24" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.twentyFour[0]+"<sup>,"+priceObject.twentyFour[1]+"</sup></b>");
					
					priceNum = parseFloat(priceObject.twentyFour[0]+"."+priceObject.twentyFour[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					break;
			}
		}

		if (selectThis.hasClass('plus')) {
			var priceObject = {
				one : [15,95],
				six : [12,10],
				twelve : [10,89],
				twentyFour: [8,85]
			};

			var minPrice = parseFloat(priceObject.one[0]+"."+priceObject.one[1]).toFixed(2);
			var saveNum,savePrice,priceNum;

			switch(selectThis.val()) {
				case "1" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.one[0]+"<sup>,"+priceObject.one[1]+"</sup></b>");
					selectThis.parent().parent().find('.save-price').html("");
					break;

				// case "3" :
				// 	selectThis.parent().parent().find('.price-heading').html("<b>$13<sup>,45</sup></b>");
				// 	break;

				case "6" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.six[0]+"<sup>,"+priceObject.six[1]+"</sup></b>");
						
					priceNum = parseFloat(priceObject.six[0]+"."+priceObject.six[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').show().html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					break;

				case "12" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.twelve[0]+"<sup>,"+priceObject.twelve[1]+"</sup></b>");
					
					priceNum = parseFloat(priceObject.twelve[0]+"."+priceObject.twelve[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').show().html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					
					break;

				case "24" :
					selectThis.parent().parent().find('.price-heading').html("<b>$"+priceObject.twentyFour[0]+"<sup>,"+priceObject.twentyFour[1]+"</sup></b>");
					
					priceNum = parseFloat(priceObject.twentyFour[0]+"."+priceObject.twentyFour[1]).toFixed(2);	
					saveNum = Number((selectThis.val() * minPrice) - (selectThis.val() * priceNum)).toFixed(2);
					savePrice = saveNum.split("."); 

					selectThis.parent().parent().find('.save-price').show().html("Save <b class=\"color\">$"+savePrice[0]+","+savePrice[1]+"</b>");
					break;
			}
		}
	
	});

	//product toggle more
	$('.toggle-more').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('active').parent().parent().find('.toggle-more-desc').slideToggle('fast');

		if ($(this).hasClass('active')) {
			$(this).html('less <i class="fa fa-angle-up" aria-hidden="true"></i>');
		}else {
			$(this).html('more <i class="fa fa-angle-down" aria-hidden="true"></i>');
		}
	});

	//private content toggle
	$('.input-wrapper.toggle .icon-wrapper').on('click',function(e){
		e.preventDefault();
		$(this).parent().toggleClass('active').find('.private-content-toggle').slideToggle('fast');
	});


	jQuery(document).ready(function(){
		
		//join link
		$('.join-link').on('click',function(e){
			if ($('#price-row').length) {
				e.preventDefault();
				$('html,body').animate({scrollTop: $('#price-row').offset().top}, 'slow');
			}
		});

		// if (location.hash === "#price-row") {
		// 	setTimeout(function() {
		// 		window.scrollTo(0, 0);
		// 	}, 1);

		// 	setTimeout(function(){
		// 		$('html,body').animate({scrollTop: $(window.location.hash).offset().top},1000);
		// 	},1000);
		// }
	});


	$('nav>ul>li>.fa').on('click', function(){
		if(_isresponsive) $(this).toggleClass('active').next().slideToggle();
	});

	//circle button popup
	$('.button-circle.style-1, .circle-popup-close').on('click', function(e){
		if($(e.target).hasClass('circle-popup')){
			console.log('match');
			return;
		}
		$(this).find('.circle-popup').toggleClass('active');
	});


	//footer responsive
	$('.footer-title.toggle').on('click', function(){
		$(this).toggleClass('active').next().slideToggle();
	});

	//toggle link
	$('.toggle-link').on('click', function(){
		$(this).toggleClass('active').parent().find('.toggle-wrapper').slideToggle();
	});

	//file remove button in input file block
    $('.input-file-wrapper .file-remove').on('click', function(){
    	var filewrapper = $(this).closest('.input-file-wrapper'),
    		textwrapper = filewrapper.find('.si');
		filewrapper.removeClass('active');
		textwrapper.text(textwrapper.data('placeholder'));
		filewrapper.find('input').val('');
	});

	$('.input-file-wrapper input[type="file"]').on('change', function(){
		$(this).closest('.input-file-wrapper').addClass('active').find('.si').text($(this).val().split( '\\' ).pop()); 
		if($(this).val()==='') $(this).next().click();
	});

	//support-item dropdown
	$('.support-item-btn').on('click', function(e){
		$(this).toggleClass('active');
		$(this).closest('.support-item').find('.support-item-toggle').slideToggle();
		e.preventDefault();
	});

	//accordeon
	$('.accordeon-title').on('click', function(){
		if($(this).closest('.accordeon').length){
			$(this).closest('.accordeon').find('.accordeon-title').not(this).removeClass('active').next().slideUp();
			$(this).addClass('active').next().slideDown();
		}
		else $(this).toggleClass('active').next().slideToggle();
	});	
	
	/*support rating*/
	$('.rating .entry').on('click', function(){
		$(this).removeClass('disabled').addClass('active').siblings().removeClass('active').addClass('disabled');
	});

	/*popup for support rating*/
 	$('.rating .entry').on('click',function(){
 		if($(this).index() === 2 || $(this).index() === 3) {
 			$('.info-popup').addClass('active');
 		}
 	});

 	$('.info-popup-inner').on('click',function(e){
 		$(this).parent().removeClass('active');
 	});

	/*checkout cupon*/
	$('.checkout-cupon').on('click', function(event) {
		$(this).toggleClass('active').next().slideToggle();
	});
	

	/*custom numbers*/
	$('.c-number-up').on('click', function(){
		var number = parseInt($(this).closest('.c-number').find('input').val(),10),
			tmp = parseInt($(this).closest('.c-number').find('input').attr('max'),10);
		if ((parseInt(number)+1) <= tmp){
			$(this).closest('.c-number').find('input').val(number+1);
		}
		return false;

	});
	$('.c-number-down').on('click', function() {
		var number = parseInt($(this).closest('.c-number').find('input').val(),10),
			tmp = number - 1;
			if(tmp<0) tmp = 0;
		$(this).closest('.c-number').find('input').val(tmp);
		return false;
	});

	/*submit form*/
 	$('form').on('submit', function(){
 		_functions.textPopup('Success','Your email has been sent.');
 		return false;
 	});

 	//search
	$('.forum-search').focus(function(){
		$('.search-bg').addClass('active');
		$(this).parent().addClass('active');
	}).focusout(function(){
		$('.search-bg').removeClass('active');
		$(this).parent().removeClass('active');
	});

 
 	$('.sub-popup').on('click',function(){
 		_functions.subPopup();
 	});

 	/*illustrations morph*/
 	$('.custom-pagination li').on('click', function(){
 		var index = $('.custom-pagination li').index(this);
 		$('.shapes-wrapper').attr('class', 'shapes-wrapper shape-'+(index+1));
 		$('.shapes-wrapper [class*="image"]').removeClass('active');
 		$('.shapes-wrapper .image-'+(index+1)).addClass('active');
 		$(this).addClass('active').siblings().removeClass('active');
 	});

 	//contact us select
 	$('.select-contact').change(function() {
 		if ( $(this).val() == 'Jobs' ) {
	 		$('.contact-us-file').slideDown('fast');
	 	}else {
	 		$('.contact-us-file').slideUp('fast');
	 	}
 	});

 	/*popup drag*/
 	var doc = $(document), element = $('.new-popup-drag');
 	element.on('mousedown touchstart', function(e){ 
 		e.preventDefault();
		e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;		

		var $t = $(this).parent().find('.mce-tinymce iframe');	

		var defPos = e.pageY, defHeight = $t.height();

        doc.on('mousemove.rem',function(e){         
        	e.preventDefault();
            e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e; 
            var curPos = e.pageY;
            $t.css({'height':defHeight+(defPos-curPos)});
        });

        doc.on('touchmove.rem',function(e){ 
            e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;
            var curPos = e.pageY;
            $t.css({'height':defHeight+(defPos-curPos)});
        });

		doc.on('mouseup.rem  touchend.rem',function(e){											
            element.off('.rem');
            doc.off('.rem');
        });
    });

});

/*!
  hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
  (function(q,m){"function"===typeof define&&define.amd?define(m):"object"===typeof exports?module.exports=m():q.Blazy=m()})(this,function(){function q(b){var c=b._util;c.elements=E(b.options);c.count=c.elements.length;c.destroyed&&(c.destroyed=!1,b.options.container&&l(b.options.container,function(a){n(a,"scroll",c.validateT)}),n(window,"resize",c.saveViewportOffsetT),n(window,"resize",c.validateT),n(window,"scroll",c.validateT));m(b)}function m(b){for(var c=b._util,a=0;a<c.count;a++){var d=c.elements[a],e;a:{var g=d;e=b.options;var p=g.getBoundingClientRect();if(e.container&&y&&(g=g.closest(e.containerClass))){g=g.getBoundingClientRect();e=r(g,f)?r(p,{top:g.top-e.offset,right:g.right+e.offset,bottom:g.bottom+e.offset,left:g.left-e.offset}):!1;break a}e=r(p,f)}if(e||t(d,b.options.successClass))b.load(d),c.elements.splice(a,1),c.count--,a--}0===c.count&&b.destroy()}function r(b,c){return b.right>=c.left&&b.bottom>=c.top&&b.left<=c.right&&b.top<=c.bottom}function z(b,c,a){if(!t(b,a.successClass)&&(c||a.loadInvisible||0<b.offsetWidth&&0<b.offsetHeight))if(c=b.getAttribute(u)||b.getAttribute(a.src)){c=c.split(a.separator);var d=c[A&&1<c.length?1:0],e=b.getAttribute(a.srcset),g="img"===b.nodeName.toLowerCase(),p=(c=b.parentNode)&&"picture"===c.nodeName.toLowerCase();if(g||void 0===b.src){var h=new Image,w=function(){a.error&&a.error(b,"invalid");v(b,a.errorClass);k(h,"error",w);k(h,"load",f)},f=function(){g?p||B(b,d,e):b.style.backgroundImage='url("'+d+'")';x(b,a);k(h,"load",f);k(h,"error",w)};p&&(h=b,l(c.getElementsByTagName("source"),function(b){var c=a.srcset,e=b.getAttribute(c);e&&(b.setAttribute("srcset",e),b.removeAttribute(c))}));n(h,"error",w);n(h,"load",f);B(h,d,e)}else b.src=d,x(b,a)}else"video"===b.nodeName.toLowerCase()?(l(b.getElementsByTagName("source"),function(b){var c=a.src,e=b.getAttribute(c);e&&(b.setAttribute("src",e),b.removeAttribute(c))}),b.load(),x(b,a)):(a.error&&a.error(b,"missing"),v(b,a.errorClass))}function x(b,c){v(b,c.successClass);c.success&&c.success(b);b.removeAttribute(c.src);b.removeAttribute(c.srcset);l(c.breakpoints,function(a){b.removeAttribute(a.src)})}function B(b,c,a){a&&b.setAttribute("srcset",a);b.src=c}function t(b,c){return-1!==(" "+b.className+" ").indexOf(" "+c+" ")}function v(b,c){t(b,c)||(b.className+=" "+c)}function E(b){var c=[];b=b.root.querySelectorAll(b.selector);for(var a=b.length;a--;c.unshift(b[a]));return c}function C(b){f.bottom=(window.innerHeight||document.documentElement.clientHeight)+b;f.right=(window.innerWidth||document.documentElement.clientWidth)+b}function n(b,c,a){b.attachEvent?b.attachEvent&&b.attachEvent("on"+c,a):b.addEventListener(c,a,{capture:!1,passive:!0})}function k(b,c,a){b.detachEvent?b.detachEvent&&b.detachEvent("on"+c,a):b.removeEventListener(c,a,{capture:!1,passive:!0})}function l(b,c){if(b&&c)for(var a=b.length,d=0;d<a&&!1!==c(b[d],d);d++);}function D(b,c,a){var d=0;return function(){var e=+new Date;e-d<c||(d=e,b.apply(a,arguments))}}var u,f,A,y;return function(b){if(!document.querySelectorAll){var c=document.createStyleSheet();document.querySelectorAll=function(a,b,d,h,f){f=document.all;b=[];a=a.replace(/\[for\b/gi,"[htmlFor").split(",");for(d=a.length;d--;){c.addRule(a[d],"k:v");for(h=f.length;h--;)f[h].currentStyle.k&&b.push(f[h]);c.removeRule(0)}return b}}var a=this,d=a._util={};d.elements=[];d.destroyed=!0;a.options=b||{};a.options.error=a.options.error||!1;a.options.offset=a.options.offset||100;a.options.root=a.options.root||document;a.options.success=a.options.success||!1;a.options.selector=a.options.selector||".b-lazy";a.options.separator=a.options.separator||"|";a.options.containerClass=a.options.container;a.options.container=a.options.containerClass?document.querySelectorAll(a.options.containerClass):!1;a.options.errorClass=a.options.errorClass||"b-error";a.options.breakpoints=a.options.breakpoints||!1;a.options.loadInvisible=a.options.loadInvisible||!1;a.options.successClass=a.options.successClass||"b-loaded";a.options.validateDelay=a.options.validateDelay||25;a.options.saveViewportOffsetDelay=a.options.saveViewportOffsetDelay||50;a.options.srcset=a.options.srcset||"data-srcset";a.options.src=u=a.options.src||"data-src";y=Element.prototype.closest;A=1<window.devicePixelRatio;f={};f.top=0-a.options.offset;f.left=0-a.options.offset;a.revalidate=function(){q(a)};a.load=function(a,b){var c=this.options;void 0===a.length?z(a,b,c):l(a,function(a){z(a,b,c)})};a.destroy=function(){var a=this._util;this.options.container&&l(this.options.container,function(b){k(b,"scroll",a.validateT)});k(window,"scroll",a.validateT);k(window,"resize",a.validateT);k(window,"resize",a.saveViewportOffsetT);a.count=0;a.elements.length=0;a.destroyed=!0};d.validateT=D(function(){m(a)},a.options.validateDelay,a);d.saveViewportOffsetT=D(function(){C(a.options.offset)},a.options.saveViewportOffsetDelay,a);C(a.options.offset);l(a.options.breakpoints,function(a){if(a.width>=window.screen.width)return u=a.src,!1});setTimeout(function(){q(a)})}});