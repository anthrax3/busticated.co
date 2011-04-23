require( {
    paths: {
      modules: "/js/modules",
      libs: "/js/libs"
    }
  },[
    "jquery",
		"modules/utils",
    "modules/animations",
    "libs/jquery.store"
	], function($, utils, ani) {

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
  });
});
