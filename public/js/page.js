$(document).ready(function(){

	$('.g-landing').sectionScroll({
		titles: false
	});

	$('a[href^="#"].scroller').on('click', function(event) {
		var id_str = $(this).attr('href');
        var target = $(id_str);
        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });

// Template
	$('#section-template').waypoint(function() {
      	$('#section-template h1').addClass('bounceIn animated');
      	$('#section-template h3').addClass('lightSpeedIn animated');
  	}, { offset: '80%'});

	$('#section-template').waypoint(function() {
      	$('#section-template .card-3').addClass('fadeInRight');
  	}, { offset: '40%' });

	$('#section-template').waypoint(function() {
      	$('#section-template .card-2').addClass('fadeIn');
  	}, { offset: '30%' });

  	$('#section-template').waypoint(function() {
      	$('#section-template .card-1').addClass('fadeInLeft');
  	}, { offset: '20%' });

// Customize
  $('#section-customize').waypoint(function() {
        $('#section-customize h1').addClass('bounceIn animated');
        $('#section-customize h3').addClass('lightSpeedIn animated');
    }, { offset: '80%'});

  $('#section-customize').waypoint(function() {
        $('#section-customize .card-1').addClass('fadeInUp');
    }, { offset: '30%' });

// Sections
  $('#section-sections').waypoint(function() {
        $('#section-sections h1').addClass('bounceIn animated');
        $('#section-sections h3').addClass('lightSpeedIn animated');
    }, { offset: '80%'});

  $('#section-sections').waypoint(function() {
        $('#section-sections .sections-card-group').addClass('fadeInUp');
    }, { offset: '30%' });

// Collaborate
  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate h1').addClass('bounceIn animated');
        $('#section-collaborate h3').addClass('lightSpeedIn animated');
    }, { offset: '80%'});

  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate .card-1').addClass('bounceInLeft show');
    }, { offset: '60%' });

  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate .card-4').addClass('bounceInRight show');
    }, { offset: '50%' });

  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate .card-5').addClass('bounceInRight show');
    }, { offset: '40%' });

  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate .card-2').addClass('bounceInLeft show');
    }, { offset: '30%' });

  $('#section-collaborate').waypoint(function() {
        $('#section-collaborate .card-3').addClass('bounceInRight show');
    }, { offset: '20%' });

// Generate
  $('#section-generate').waypoint(function() {
        $('#section-generate h1').addClass('bounceIn animated');
        $('#section-generate h3').addClass('lightSpeedIn animated');
    }, { offset: '80%'});

  $('#section-generate').waypoint(function() {
        $('#section-generate .card-1').addClass('tilt');
        $('#section-generate .card-2').addClass('shadow');
        $('#section-generate .card-3').addClass('tilt');
        $('#section-generate .card-4').addClass('tilt');

        $('#section-generate .marker-1').addClass('show');
        $('#section-generate .marker-2').addClass('show');
    }, { offset: '30%' });

  $('#section-generate').waypoint(function() {
        $('#section-generate .marker-1').addClass('pulse');
        $('#section-generate .marker-2').addClass('pulse');
    }, { offset: '10%' });

// Link
  $('#section-link').waypoint(function() {
        $('#section-link h1').addClass('bounceIn animated');
        $('#section-link h3').addClass('lightSpeedIn animated');
  }, { offset: '80%'});

  $('#section-link').waypoint(function() {
        $('#section-link .card-1').addClass('fadeInUp');
  }, { offset: '60%'});

  $('#section-link').waypoint(function() {
        $('#section-link .card-2').addClass('fadeInLeft');
        $('#section-link .marker-1').addClass('rotateIn');
  }, { offset: '10%'});  
});