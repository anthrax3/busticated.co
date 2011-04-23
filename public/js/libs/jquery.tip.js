//#region - JQUERY TIP ////////////////////////////////////////////////////////
/*
* jQuery tip Plugin
* Copyright 2011, Matthew Mirande
* Dual licensed under the MIT or GPL Version 2 licenses.
* Usage: Provides screen edge-aware tooltips via css class assignment
*/

(function ($) {
	$.fn.tip = function (cfg) {
		//default settings - TODO whatup w/ id & class indicators (# .)? should they be added by the script?
		var settings = {
				"container": "#tmpl-ToolTip",
				"content": ".tipContent",
				"rightStyle": "tipR",
				"leftStyle": "tipL",
				"delay": 200
			},				
			$target = {},
			$win = $(window);

		//update settings w/ any configs set by user
		if (cfg) {
			$.extend(settings, cfg);
		}

		$target = $(settings.container);

		return this.each(function () {

			var $this = $(this),
				styles = "",
				tipCopy = $this.data("tip"),
				timeoutID = null,
				cssClass = "";

			//setup event listeners (only if there's tooltip content to display)
			if (tipCopy) {
				//TODO - figure out how to use delegate instead
				$this.bind("mouseover mouseout", function (e) {
					if (e.type === "mouseover") {
						showTip();
					} else {
						hideTip();
					}
				});
			}

			function showTip() {
				var winWidth = $win.width(), 
					elemPos = $this.offset(),
					scrollPos = $win.scrollTop(),
					elemW = $this.outerWidth(),
					elemH = $this.outerHeight(),
					isOffscreen = winWidth < (elemPos.left + elemW + 100) ? true : false, //TODO what if tip length is less than 100px?
					cssTopVal = ((elemPos.top - scrollPos) + ((elemH / 2) - 10)) + "px",
					cssLeftVal = (elemPos.left + elemW + 15) + "px",
					cssRightVal = (winWidth - elemPos.left + 15) + "px",
					cssObj = {};

				if (isOffscreen) {
					cssObj = {
						"top": cssTopVal,
						"right": cssRightVal
					};
					cssClass = settings.leftStyle;
				} else {
					cssObj = {
						"top": cssTopVal,
						"left": cssLeftVal
					};
					cssClass = settings.rightStyle;
				}

				if (timeoutID) {
					clearTimeout(timeoutID);
				}
				timeoutID = setTimeout(function () {
					$target
						.css(cssObj)
						.addClass(cssClass)
						.find(settings.content)
						.text(tipCopy);
				}, settings.delay);
			};

			function hideTip() {
				clearTimeout(timeoutID);
				$target
					.css({"right":"","left":""})
					.removeClass(cssClass);
			};
		});
	};
})(jQuery);
//#endregion