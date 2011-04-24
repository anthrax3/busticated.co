define(["jquery", "./utils","../libs/jquery.store"], function($, utils) {
  // module setup ///////////////////////////////////////////////////
  var $target    = {},
			text       = "",
			letters    = [],
			mode       = "full", //full or simple
			availChars = "abcdefhiklmnorstuvwxz1234567890.,!$&?",
      word       = [],
      cb         = function (){},
      currChar   = 0,
      inc        = 1,
      isRunning  = false,
      init       = function init(cfg){
        //configuration
        cfg = cfg || {};
        cfg.$target = cfg.$target || $("#title");
        $target = cfg.$target;
        cfg.mode = cfg.mode || mode;
        mode = cfg.mode || "full",
        mode = mode.toLowerCase();
        cfg.cb = cfg.cb || cb;
				cb = cfg.cb;
        text = $target.text();
        letters = text.split("");
          
        //setup
        if (mode === "full") {
          $target.text("");
          currChar = 0;
          inc = 1;
        } else {
          currChar = 9;
          inc = 0;
					word = letters;
        }

        //start animation
        start();
      },
      guess      = function guess(){
        var num = Math.floor(Math.random() * availChars.length),
            char = availChars.substring(num, (num + 1));
        
        return char;
      },
      start     = function start(){
        if (isRunning) {
          return false;
        } else {
          isRunning = true;
          utils.timers.add(run);
        }
      },
      stop      = function stop(){
        isRunning = false;
      },
      run       = function run(){
        var char = guess(),
            tmpl = "<span class=\"titleLetter\">" + char + "</span>",
            isLetterMatch = char === text.substring(currChar, (currChar + 1)) ? true : false,
            isLastChar = currChar === (text.length - 1) ? true : false;
            mode = mode;
          
        word[currChar] = tmpl;

        if (isLetterMatch) {
          word[currChar] = char;
          currChar = currChar + inc;
        }
        if (isLastChar && isLetterMatch) {
          isRunning = false;
          cb();
        }

        $target.html(word.join(""));
        return isRunning;
      };

	// event listeners ////////////////////////////////////////////////
  $(document).ready(function(){
  });
  // public api /////////////////////////////////////////////////////
  return {
		init: init,
		start: start,
		stop: stop
	}
});
