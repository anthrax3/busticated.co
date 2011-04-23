define(["jquery", "./utils","../libs/jquery.store"], function($, utils) {
  // module setup ///////////////////////////////////////////////////
  var $target = {},
		  title = "",
		  titleLetters = [],
      word = [],
		  availLetters = "abcdefhiklmnorstuvwxz1234567890.,!$&?",
		  hasViewed = (function(){
			  return $.fn.store("get", "viewedAni");
		  }()),
      charNum = hasViewed ? 9 : 0,
      inc = hasViewed ? 0 : 1,
      doGuess = function doGuess(){
        //start via "utils.timers.add(animations.doGuess());"
        var num = Math.floor(Math.random() * availLetters.length),
            char = availLetters.substring(num, (num + 1));
            tmpl =  "<span class=\"titleLetter\">" + char + "</span>",
            isLetterMatch = char === title.substring(charNum, (charNum + 1)) ?
              true : false,
            isLastLetter = charNum === (title.length - 1) ? true : false,
            isActive = true;

        word[charNum] = tmpl;

        if (isLetterMatch) {
          console.log("match!");
          word[charNum] = char;
          console.log(">>> " + charNum + " " + char);
          charNum = charNum + inc;
        }
        if (isLastLetter && isLetterMatch) {
          console.log("last letter!");
          isActive = false;
        }

        $target.html(word.join(""));
        return isActive;
      },
      titleAni = function titleAni(){
        $target.text("");
        utils.timers.add(doGuess);
      };

  // event listeners ////////////////////////////////////////////////
  $(document).ready(function(){
    $target = $("#title");
    title = $target.text();
    titleLetters = title.split("");
    titleAni();
  });
  // public api /////////////////////////////////////////////////////
  return {
    titleAni : titleAni,
    doGuess  : doGuess
  }
});
