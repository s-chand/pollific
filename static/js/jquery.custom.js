// Google Map Start
var map;
function initialize() {
	var mapOptions = {
		zoom: 15,
		scrollwheel: false,
		center: new google.maps.LatLng(27.691519600000000000,85.342048600000000000), //Place your google map longitude and latitude here
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('gmap'),
		mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
// Google Map End
$(window).load(function() {
	$(".loader").fadeOut("slow");
})
/* Text Slider Begin*/
//Home Slider

// settings
function textslider(selector, speed, interval) {

var $slider = selector; // class or id of carousel slider
var $slide = 'li'; // could also use 'img' if you're not using a ul
var $transition_time = speed; 
var $time_between_slides = interval; 

var $slides = $slider.find($slide);
$slides.hide();

// set active classes
$slides.first().addClass('active');
$slides.first().fadeIn($transition_time);

// auto scroll 
$interval = setInterval(
    function(){
      var $i = $slider.find($slide + '.active').index();
    
      $slides.eq($i).removeClass('active');
      $slides.eq($i).fadeOut(0);
    
      if ($slides.length == $i + 1) $i = -1; // loop to start
    
      $slides.eq($i + 1).fadeIn($transition_time);
      $slides.eq($i + 1).addClass('active');
    }
    , $transition_time +  $time_between_slides 
);
}
/* Text Slider End */




//Header 
$(document).ready(function(){

	$('#home').css({'width':$('body').innerWidth(),'height':$(window).height()});  

});
$(window).resize(function() {
	$('#home').css({'width':$('body').innerWidth(),'height':$(window).height()});
});


$(document).ready(function(){

//Scroll Start

var deck = new $.scrolldeck({
	buttons: '.nav-item',
	easing: 'easeInOutExpo',
	slides: '.scroll-section',
	duration: 600,
	offset: -59
});

//Scroll End

$('a#learn-more').click(function(e) {
	e.preventDefault();
	$('html, body').animate({scrollTop:$('#about').position().top-60}, 'slow');
});


//Portfolio Filter Start

function show(filterVal){
if(filterVal == 'all') {
	$('ul#portfolio-items li').fadeIn('slow');
} else {
	$('ul#portfolio-items li').each(function() {
		if($(this).hasClass(filterVal)) {
			$(this).fadeIn('slow');
			}
		})
}
}

$('ul#filter a').click(function() {
	$(this).css('outline','none');
	var filterVal = $(this).text().toLowerCase().replace(' ','-');
	var itemsLength = $('ul#portfolio-items  li:visible').length;
	$('ul#filter .active').removeClass('active');
	$(this).parent().addClass('active');
	$('ul#portfolio-items  li:visible').each(function(i) {
		$(this).fadeOut('slow', function(){
			if(itemsLength == ++i){show(filterVal);		
			}
		});
	});
	return false;
});


// Accordin Animation
$('.my-accrodin .accrodin-title a').click(function() {
	$(this).parent().parent().parent().children(".my-accrodin").children(".content").fadeOut(0);
	$(this).parent().parent().children(".content").slideDown(700);

});


//Contact Form Start
$("#ContactForm").submit(function(){
	$("#submitf").value='Please wait...';

	$.post("contact.php?send=comments", $("#ContactForm").serialize(),
		function(data){
			if(data.frm_check == 'error'){

				$("#message_post").html("<div class='alert-box alert'>ERROR: " + data.msg + "!</div>");
				document.ContactForm.submitf.value='Resend >>';
				document.ContactForm.submitf.disabled=false;
			} 
			else {	 		 
				$("#message_post").html("<div class='alert-box success'>Your message has been sent successfully!</div>").delay(3000).fadeOut();;
				$("#submitf").value='Send >>';
			}
		}, "json");

	return false;

});

//Contact Form End




// Scroll to top
$(window).scroll(function(){
				if ($(this).scrollTop() > 100) {
					$('#go-to-top').css('opacity', '1').fadeIn();
				} else {
					$('#go-to-top').fadeOut();
				}
			}); 
			
			$('#go-to-top').click(function(){
				$("html, body").animate({ scrollTop: 0 }, 600);
				return false;
			});


$(".team-item .img").click(function(){
		var more_desc = $(this).parent().children(".description").children(".more_desc");
		more_desc.toggle(1000);			
	});

$("#chooser-button").click(function(){
		$("#chooser-container").toggle(1000);		

	});
// Color Chooser

$("#chooser-container li").click(function(){
		var style_location = $(this).attr("data-style");
		$.get(style_location, function(css)
{
   $('<style type="text/css"></style>')
      .html(css)
      .appendTo("head");
});

	});



});
$(document).delegate('#portfolio-items li .link-to','click',function(){

	$('#portfolio-container > .row').fadeOut('slow');
	$('#project-ajax').show();
	//$("#project-info").fadeIn('slow').css('display','inline-block');
	var pos = $('#portfolio').position();
	var loadUrl = $(this).attr('data-portfolio');	
	$("#project-ajax").html('<div id="loader"><img src="img/loading.gif"/></div>').fadeIn('slow');
	$("#project-ajax").load(loadUrl,function(responseText){
		$("#project-ajax").fadeIn('slow');
	});
	$('html, body').animate({scrollTop:pos.top+150}, 'slow');
});

$(document).delegate('#project-info #close','click',function(){
	$("#project-info").fadeOut('slow');
	$('#project-ajax').hide();
	$('#portfolio-container > .row').fadeIn('slow').css('opacity','1');
});