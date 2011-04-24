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
  $(".tabTitle").live("click", function() {
    var state = $(this).data("tabState") || -1;
    if (state < 0) {
      utils.tabDrawer(this, 1);
    } else {
      utils.tabDrawer(this);
    }
  });

  // doc ready //////////////////////////////////////////////////////
  $(document).ready(function() {
		var lastVisit = $.fn.store("get", "lastVisit");

		//handle new vs returning visitors
		if (lastVisit) {
			guessWord.init({
				$target : $("#title"),
				mode : "simple",
				cb : function(){
					setTimeout(guessWord.start, 1000);
				}
			});
		} else {
			guessWord.init({
				$target : $("#title"),
				mode : "full",
				cb : function(){
					setTimeout(function(){
						guessWord.init({ mode:"simple" });
					}, 1000);
				}
			});
		}
		
		//set visit timestamp
		$.fn.store("set", {"lastVisit": Date.now() });
  });
});
