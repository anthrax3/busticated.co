//#region - JQUERY STICKIT ////////////////////////////////////////////////////
/*
* jQuery StickIt Plugin
* Copyright 2011, Matthew Mirande
* Dual licensed under the MIT or GPL Version 2 licenses.
* Usage: Adds / Removes a css class to target element when it is scrolled off screen (allows fixing an element to viewport)
*/

(function ($) {
	$.fn.stickIt = function (cfg) {
		//default settings
		var settings = {
				"enableClass": "fixed",
				"resetEvent": "reset.stickIt"
			},
			$window = $(window);

		//update settings w/ any configs set by user
		if (cfg) {
			$.extend(settings, cfg);
		}

		//helper func to handle position detection and assign classes
		function doIt($target, elPos, elHeight) {
			var position = $window.scrollTop();

			if (position > elPos.top) {
				$target.addClass(settings.enableClass).parent(".stickItContainer").height(elHeight);
			} else {
				$target.removeClass(settings.enableClass).parent(".stickItContainer").css("height", "auto");
			}
		};

		//loop through jQuery collection (selected elements) and apply
		return this.each(function () {
			var $this = $(this),
				elemPosition = $this.offset(),
				elemHeight = $this.outerHeight(true),
				timer = 0;

			//wrap target element (place-holder element to keep page from bouncing around)
			$this.wrap('<div class="stickItContainer"></div>');

			//detect scrolling, and throttle calls to helper func.
			$window.bind("scroll", function () {
				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(function () {
					doIt($this, elemPosition, elemHeight);
				}, 20);
			});

			//enable reset event
			$this.bind(settings.resetEvent, function () {
				$this.removeClass(settings.enableClass).parent(".stickItContainer").css("height", "auto");
				return false;
			});

		});
	};
})(jQuery);
//#endregion