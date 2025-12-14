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
				
				// Carousel data for each project
				var carouselData = {
					'student-success-center': [
						{ type: 'image', src: 'images/thumbs/Student Success Center/Pathfinder-Senior-design-poster.png', alt: 'Pathfinder Poster' },
						{ type: 'image', src: 'images/thumbs/Student Success Center/landing.png', alt: 'Landing Page' },
						{ type: 'image', src: 'images/thumbs/Student Success Center/team group picture.jpg', alt: 'Team Group Picture' },
						{ type: 'video', src: 'images/thumbs/Student Success Center/Final Demo.mp4', alt: 'Final Demo' }
					],
					'diversifynance': [
						{ type: 'image', src: 'images/thumbs/Diversifynance/Diversifynance_landing_page.png', alt: 'Landing Page' },
						{ type: 'video', src: 'images/thumbs/Diversifynance/Diversifynance_demo.mp4', alt: 'Demo Video' }
					]
				};

				// Set up carousel modal BEFORE poptrox initialization
				var $carouselModal = $('#image-carousel-modal');
				var $carouselSlidesContainer = $carouselModal.find('.carousel-slides');
				var $carouselIndicatorsContainer = $carouselModal.find('.carousel-indicators');
				var currentSlide = 0;
				var totalSlides = 0;
				var $carouselSlides = null;
				var $carouselIndicators = null;

				// Function to populate carousel with project data
				function populateCarousel(projectKey) {
					var slides = carouselData[projectKey];
					if (!slides || slides.length === 0) return false;

					// Clear existing slides and indicators
					$carouselSlidesContainer.empty();
					$carouselIndicatorsContainer.empty();

					// Create slides
					slides.forEach(function(slide, index) {
						var $slide = $('<div class="carousel-slide' + (index === 0 ? ' active' : '') + '"></div>');
						
						if (slide.type === 'video') {
							$slide.html('<video controls style="width: 100%; height: auto; max-height: 80vh; object-fit: contain;"><source src="' + slide.src + '" type="video/mp4">Your browser does not support the video tag.</video>');
						} else {
							$slide.html('<img src="' + slide.src + '" alt="' + (slide.alt || '') + '" />');
						}
						
						$carouselSlidesContainer.append($slide);
						
						// Create indicator
						var $indicator = $('<span class="carousel-indicator' + (index === 0 ? ' active' : '') + '" data-slide="' + index + '"></span>');
						$carouselIndicatorsContainer.append($indicator);
					});

					// Update references
					$carouselSlides = $carouselSlidesContainer.find('.carousel-slide');
					$carouselIndicators = $carouselIndicatorsContainer.find('.carousel-indicator');
					totalSlides = slides.length;
					currentSlide = 0;

					return true;
				}

				// Function to show slide
				function showSlide(index) {
					if (!$carouselSlides || totalSlides === 0) return;
					
					// Pause all videos in carousel
					$carouselSlides.find('video').each(function() {
						this.pause();
					});
					
					$carouselSlides.removeClass('active');
					$carouselIndicators.removeClass('active');
					$carouselSlides.eq(index).addClass('active');
					$carouselIndicators.eq(index).addClass('active');
					currentSlide = index;
					
					// Play video if the active slide contains one
					var $activeSlide = $carouselSlides.eq(index);
					var $video = $activeSlide.find('video');
					if ($video.length > 0) {
						$video[0].play().catch(function(error) {
							console.log('Video autoplay prevented:', error);
						});
					}
				}

				// Function to next slide
				function nextSlide() {
					if (totalSlides === 0) return;
					var next = (currentSlide + 1) % totalSlides;
					showSlide(next);
				}

				// Function to previous slide
				function prevSlide() {
					if (totalSlides === 0) return;
					var prev = (currentSlide - 1 + totalSlides) % totalSlides;
					showSlide(prev);
				}

				// Open carousel for projects with carousel data - set up BEFORE poptrox
				$workItems.each(function() {
					var $this = $(this);
					var $imageContainer = $this.find('.image.thumb');
					var $link = $imageContainer.find('a').first();
					var linkHref = $link.attr('href');
					var projectKey = null;
					
					// Determine project key based on link href or project title
					if (linkHref) {
						if (linkHref.indexOf('Student Success Center') !== -1 || linkHref.indexOf('Pathfinder') !== -1) {
							projectKey = 'student-success-center';
						} else if (linkHref.indexOf('Diversifynance') !== -1) {
							projectKey = 'diversifynance';
						}
					}
					
					// If no match from href, try project title
					if (!projectKey) {
						var $title = $this.find('.project-title-in-icons');
						if ($title.length > 0) {
							var titleText = $title.text().toLowerCase().trim();
							if (titleText.indexOf('student success') !== -1) {
								projectKey = 'student-success-center';
							} else if (titleText.indexOf('diversifynance') !== -1) {
								projectKey = 'diversifynance';
							}
						}
					}
					
					// If project has carousel data, set up carousel click handler
					if (projectKey && carouselData[projectKey]) {
						// Add data attribute to exclude from poptrox
						$link.attr('data-carousel', 'true');
						$link.on('click.carousel', function(e) {
							// Don't open carousel if clicking on project icons
							if ($(e.target).closest('.project-icons').length > 0) {
								return;
							}
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
							
							// Populate carousel with project data
							if (populateCarousel(projectKey)) {
								$carouselModal.addClass('active');
								$body.css('overflow', 'hidden');
								showSlide(0);
							}
							return false;
						});
					}
					
					// Prevent project icon clicks from triggering parent link
					$this.find('.project-icon-link').on('click', function(e) {
						e.stopPropagation();
						e.stopImmediatePropagation();
					});
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

				// Add automatic random shuffle for Pathfinder project (Magna sed)
				$workItems.each(function(index) {
					var $this = $(this);
					var $img = $this.find('img');
					var $link = $this.find('a');
					var imgSrc = $img.attr('src');
					var linkHref = $link.attr('href');
					var originalThumb = imgSrc;
					
					// Check if this is the Pathfinder project (by checking the link href)
					if (linkHref && linkHref.indexOf('Pathfinder-Senior-design-poster') !== -1) {
						// Manually list all Student Success Center images
						// Note: Login.png is used as the thumbnail for Final Demo video
						var studentSuccessImages = [
							{ thumb: 'images/thumbs/Student Success Center/landing.png', full: 'images/thumbs/Student Success Center/landing.png' },
							{ thumb: 'images/thumbs/Student Success Center/team group picture.jpg', full: 'images/thumbs/Student Success Center/team group picture.jpg' },
							{ thumb: 'images/thumbs/Student Success Center/Pathfinder-Senior-design-poster.png', full: 'images/thumbs/Student Success Center/Pathfinder-Senior-design-poster.png' },
							{ thumb: 'images/thumbs/Student Success Center/Login.png', full: 'images/thumbs/Student Success Center/Final Demo.mp4', isVideo: true }
						];
						
						// Store the previous image to avoid showing the same one twice
						var previousImage = null;
						
						// Function to shuffle to a random image with blur transition
						function shuffleToRandom() {
							if (studentSuccessImages.length > 0) {
								var currentSrc = $img.attr('src');
								
								// Filter out current image and previous image
								var availableImages = studentSuccessImages.filter(function(img) {
									return img.thumb !== currentSrc && img.thumb !== previousImage;
								});
								
								// If no other images available (only happens if there are only 2 images and we just switched)
								// then allow the previous image but not the current one
								if (availableImages.length === 0) {
									availableImages = studentSuccessImages.filter(function(img) {
										return img.thumb !== currentSrc;
									});
								}
								
								// If still no images (shouldn't happen with 3+ images), use all
								if (availableImages.length === 0) {
									availableImages = studentSuccessImages;
								}
								
								var randomIndex = Math.floor(Math.random() * availableImages.length);
								var randomImage = availableImages[randomIndex];
								
								// Store current image as previous for next shuffle
								previousImage = currentSrc;
								
								// Blur the current image
								$img.css({
									'filter': 'blur(5px)',
									'-webkit-filter': 'blur(5px)'
								});
								
								// Change image source while blurred
								setTimeout(function() {
									$img.attr('src', randomImage.thumb);
									
									// Remove blur to reveal new image
									setTimeout(function() {
										$img.css({
											'filter': 'blur(0px)',
											'-webkit-filter': 'blur(0px)'
										});
									}, 50);
								}, 500); // Half of transition time
							}
						}
						
						// Store original for reference
						$this.data('originalThumb', originalThumb);
						
						// Don't shuffle immediately - landing.png is already showing
						// Start shuffling after the first interval
						
						// Shuffle every 8 seconds (longer interval)
						setInterval(shuffleToRandom, 8000);
						
						// Don't add hover functionality for this one
						return;
					}
				});
				
				// Add hover functionality to each work item
				$workItems.each(function(index) {
					var $this = $(this);
					var $img = $this.find('img');
					var $link = $this.find('a');
					var originalThumb = $img.attr('src');
					var originalFull = $link.attr('href');
					
					// Skip shuffle for Student Success Center images (including Pathfinder)
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

				// Indicator clicks (use event delegation for dynamically created indicators)
				$carouselModal.on('click', '.carousel-indicator', function() {
					var slideIndex = $(this).data('slide');
					showSlide(slideIndex);
				});

				// Close carousel
				$carouselModal.find('.carousel-close').on('click', function(e) {
					e.stopPropagation();
					// Pause all videos before closing
					$carouselModal.find('video').each(function() {
						this.pause();
					});
					$carouselModal.removeClass('active');
					$body.css('overflow', ''); // Restore body scroll
				});

				// Close on overlay click
				$carouselModal.find('.carousel-overlay').on('click', function(e) {
					if (e.target === this) {
						// Pause all videos before closing
						$carouselModal.find('video').each(function() {
							this.pause();
						});
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

				// Touch handlers for View button on mobile
				if ($body.hasClass('is-touch')) {
					$('.work-item .image.thumb').on('touchstart', function(e) {
						$(this).addClass('touching');
					}).on('touchend touchcancel', function(e) {
						var $this = $(this);
						// Keep the class briefly to show the button, then remove it
						setTimeout(function() {
							$this.removeClass('touching');
						}, 300);
					});
				}

				// Prevent image hover effects when hovering over project icons
				$('.work-item .project-icon-link').on('mouseenter', function(e) {
					$(this).closest('.image').addClass('project-icons-hover');
				}).on('mouseleave', function(e) {
					$(this).closest('.image').removeClass('project-icons-hover');
				});

				// Tech stack expand toggle functionality
				$('.tech-stack-expand-toggle').on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					var $techStack = $(this).closest('.tech-stack');
					var $categories = $(this).closest('.tech-stack-categories');
					$categories.toggleClass('expanded');
					$techStack.toggleClass('expanded');
				});


			});

	})(jQuery);