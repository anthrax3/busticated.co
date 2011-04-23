define([], function() {
  // module setup ///////////////////////////////////////////////////
  var tabDrawer = function tabDrawer(element, state) {
      var $tabID = $(element),
          parentID = $tabID.parent(),
          containerHeight = parentID.outerHeight(),
          contentID = $tabID.next(),
          titleHeight = $tabID.outerHeight(),
          containerHeight = parentID.outerHeight(),
          contentHeight = contentID.outerHeight(true),
          titleBorder = parseInt($tabID.css("border-bottom-width"), 10),
          height = (titleHeight - titleBorder) - containerHeight;
      
      state = state || height;
      parentID.animate( { "bottom" : state }, (-height / 0.75), function() {
        $tabID.data("tabState" , state);
      });
    },
    timers = { //main timers object
      id: 0,
			speed: 25,
			active: [], //array of funcs called by timer
			start: function start() {
				//bail if there's already a timer running
				if (timers.id) {
					return;
				}
				//setup timers
				(function setUp() {
					var i = 0,
						activeCount = timers.active.length;
					for (i = 0; i < activeCount; i = i + 1) {
						//execute any active functions, remove any returning false
						if (timers.active[i]() === false) {
							timers.active.splice(i, 1);
							i = i - 1;
							activeCount = activeCount - 1;
						}
						//stop timer if active array is empty
						if (!activeCount) {
							timers.stop();
							return false;
						}
					}
					//console.log(timers.active);
					timers.id = setTimeout(setUp, timers.speed);
				})();
			},
			stop: function stop() {
				clearTimeout(timers.id);
				timers.id = 0;
			},
			add: function add(fn) {
				timers.active.push(fn);
				timers.start();
			}
		};
  // event listeners ////////////////////////////////////////////////
  
  // public api /////////////////////////////////////////////////////
  return {
    tabDrawer : tabDrawer,
    timers    : timers
  }
});
