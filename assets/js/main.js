/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: false, // Disable navigation to prevent going to next image
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

				// Image hover shuffle functionality
				var $workItems = $('.work-item');
				var imageSources = [];
				
				// Collect all image sources
				$workItems.each(function() {
					var $img = $(this).find('img');
					var thumbSrc = $img.attr('src');
					var fullSrc = $(this).find('a').attr('href');
					imageSources.push({
						thumb: thumbSrc,
						full: fullSrc
					});
				});

				// Add hover functionality to each work item
				$workItems.each(function(index) {
					var $this = $(this);
					var $img = $this.find('img');
					var $link = $this.find('a');
					var originalThumb = $img.attr('src');
					var originalFull = $link.attr('href');
					
					// Calculate next image index (wrap around)
					var nextIndex = (index + 1) % imageSources.length;
					var nextThumb = imageSources[nextIndex].thumb;
					var nextFull = imageSources[nextIndex].full;
					
					// Store original sources
					$this.data('originalThumb', originalThumb);
					$this.data('originalFull', originalFull);
					$this.data('nextThumb', nextThumb);
					$this.data('nextFull', nextFull);
					
					// Variables for touch handling
					var touchStartTime = 0;
					var touchTimeout = null;
					var isTouching = false;
					
					// Desktop: Hover in: show next image
					$this.on('mouseenter', function() {
						if (!isTouching) {
							$img.attr('src', nextThumb);
						}
					});
					
					// Desktop: Hover out: restore original image
					$this.on('mouseleave', function() {
						if (!isTouching) {
							$img.attr('src', originalThumb);
						}
					});
					
					// Mobile: Touch start - show next image
					$this.on('touchstart', function(e) {
						isTouching = true;
						touchStartTime = Date.now();
						$img.attr('src', nextThumb);
						
						// Clear any existing timeout
						if (touchTimeout) {
							clearTimeout(touchTimeout);
						}
					});
					
					// Mobile: Touch end - restore original image after delay
					$this.on('touchend', function(e) {
						var touchDuration = Date.now() - touchStartTime;
						
						// If it's a quick tap (less than 300ms), restore immediately for click
						// Otherwise, restore after a short delay
						if (touchDuration < 300) {
							$img.attr('src', originalThumb);
							isTouching = false;
						} else {
							// Longer touch - restore after delay
							touchTimeout = setTimeout(function() {
								$img.attr('src', originalThumb);
								isTouching = false;
							}, 300);
						}
					});
					
					// Mobile: Touch cancel - restore original image
					$this.on('touchcancel', function(e) {
						$img.attr('src', originalThumb);
						isTouching = false;
						if (touchTimeout) {
							clearTimeout(touchTimeout);
						}
					});
					
					// On click: ensure original image is used (restore if hovered/touched)
					$link.on('click', function(e) {
						$img.attr('src', originalThumb);
						$link.attr('href', originalFull);
						isTouching = false;
						if (touchTimeout) {
							clearTimeout(touchTimeout);
						}
					});
				});

			});

})(jQuery);