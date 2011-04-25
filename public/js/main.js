require( {
    paths: {
      modules: "/js/modules",
      libs: "/js/libs"
    }
  },[
    "jquery",
    "modules/utils",
    "modules/guessWord",
    "libs/jquery.store"
  ], function($, utils, guessWord) {

  // setup //////////////////////////////////////////////////////////
  $("h2.tabTitle").live("click", function() {
    utils.tabDrawer(this);
  });

  // doc ready //////////////////////////////////////////////////////
  $(document).ready(function() {
    var lastVisit = $.fn.store("get", "lastVisit");

    //open "about" tab
    utils.tabDrawer("#info .tabTitle")

    //handle new vs returning visitors
    if (lastVisit) {
      guessWord.init({
        $target : $("#title"),
        mode : "simple",
        cb : function(){
          setTimeout(guessWord.start, 2000);
        }
      });
    } else {
      guessWord.init({
        $target : $("#title"),
        mode : "full",
        cb : function(){
          setTimeout(function(){
            guessWord.init({ mode:"simple" });
          }, 2000);
        }
      });
    }
    
    //set visit timestamp
    $.fn.store("set", {"lastVisit": Date.now() });
  });
});
