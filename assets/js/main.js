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

				// Image hover shuffle functionality
				var $workItems = $('.work-item');
				
				// Set up carousel for Pathfinder project BEFORE poptrox initialization
				var $carouselModal = $('#image-carousel-modal');
				var $carouselSlides = $carouselModal.find('.carousel-slide');
				var $carouselIndicators = $carouselModal.find('.carousel-indicator');
				var currentSlide = 0;
				var totalSlides = $carouselSlides.length;

				// Function to show slide
				function showSlide(index) {
					$carouselSlides.removeClass('active');
					$carouselIndicators.removeClass('active');
					$carouselSlides.eq(index).addClass('active');
					$carouselIndicators.eq(index).addClass('active');
					currentSlide = index;
				}

				// Function to next slide
				function nextSlide() {
					var next = (currentSlide + 1) % totalSlides;
					showSlide(next);
				}

				// Function to previous slide
				function prevSlide() {
					var prev = (currentSlide - 1 + totalSlides) % totalSlides;
					showSlide(prev);
				}

				// Open carousel for Pathfinder project - set up BEFORE poptrox
				$workItems.each(function() {
					var $this = $(this);
					var $link = $this.find('a.image');
					var imgSrc = $this.find('img').attr('src');
					
					// Check if this is the Pathfinder project
					if (imgSrc && imgSrc.indexOf('Pathfinder-Senior-design-poster') !== -1) {
						// Add data attribute to exclude from poptrox
						$link.attr('data-carousel', 'true');
						$link.on('click.carousel', function(e) {
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
							$carouselModal.addClass('active');
							$body.css('overflow', 'hidden');
							showSlide(0);
							return false;
						});
					}
				});

				// Initialize poptrox (will skip items with data-carousel attribute via selector)
				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image:not([data-carousel="true"])',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: false, // Disable navigation to prevent going to next image
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});
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
					
					// Skip shuffle for Student Success Center images
					var skipShuffle = originalThumb.indexOf('Student Success Center') !== -1 || 
									  originalThumb.indexOf('01.jpg') !== -1;
					
					if (skipShuffle) {
						// Don't add hover/touch functionality for these images
						return;
					}
					
					// Calculate next image index (wrap around)
					var nextIndex = (index + 1) % imageSources.length;
					var nextThumb = imageSources[nextIndex].thumb;
					var nextFull = imageSources[nextIndex].full;
					
					// Skip if next image is also a Student Success Center or 01.jpg
					if (nextThumb.indexOf('Student Success Center') !== -1 || 
						nextThumb.indexOf('01.jpg') !== -1) {
						// Find the next valid image
						var foundNext = false;
						for (var i = 1; i < imageSources.length; i++) {
							var checkIndex = (index + i) % imageSources.length;
							var checkThumb = imageSources[checkIndex].thumb;
							if (checkThumb.indexOf('Student Success Center') === -1 && 
								checkThumb.indexOf('01.jpg') === -1) {
								nextThumb = checkThumb;
								nextFull = imageSources[checkIndex].full;
								foundNext = true;
								break;
							}
						}
						// If no valid next image found, don't add shuffle
						if (!foundNext) {
							return;
						}
					}
					
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

				// Carousel navigation (set up after carousel modal is created)
				$carouselModal.find('.carousel-next').on('click', function(e) {
					e.stopPropagation();
					nextSlide();
				});

				$carouselModal.find('.carousel-prev').on('click', function(e) {
					e.stopPropagation();
					prevSlide();
				});

				// Indicator clicks
				$carouselIndicators.on('click', function() {
					var slideIndex = $(this).data('slide');
					showSlide(slideIndex);
				});

				// Close carousel
				$carouselModal.find('.carousel-close').on('click', function(e) {
					e.stopPropagation();
					$carouselModal.removeClass('active');
					$body.css('overflow', ''); // Restore body scroll
				});

				// Close on overlay click
				$carouselModal.find('.carousel-overlay').on('click', function(e) {
					if (e.target === this) {
						$carouselModal.removeClass('active');
						$body.css('overflow', ''); // Restore body scroll
					}
				});

				// Keyboard navigation
				$(document).on('keydown', function(e) {
					if ($carouselModal.hasClass('active')) {
						if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
							e.preventDefault();
							nextSlide();
						} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
							e.preventDefault();
							prevSlide();
						} else if (e.key === 'Escape') {
							e.preventDefault();
							$carouselModal.removeClass('active');
							$body.css('overflow', ''); // Restore body scroll
						}
					}
				});

			});

})(jQuery);