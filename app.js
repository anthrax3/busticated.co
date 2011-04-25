// Module dependencies
var cfg = require("./cfg.js"),
    fs = require("fs"),
    express = require("express"),
    db = require("mongoose"),
    auth = require("mongoose-auth"),
    stylus = require("stylus"),
    Schema = db.Schema,
    ObjectId = Schema.ObjectId;

var app = module.exports = express.createServer();

// Helpers //////////////////////////////////////////////////////////
function NotFound(path){
  this.name = "NotFound";
  if (path) {
    Error.call(this, "Cannot find " + path);
    this.path = path;
  } else {
    Error.call(this, "Not Found");
  }
  Error.captureStackTrace(this, arguments.callee);
};
NotFound.prototype.__proto__ = Error.prototype;

// Configuration ////////////////////////////////////////////////////
app.configure(function(){
  app.set("views", cfg.paths.views);
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: cfg.secret }));
  app.use(stylus.middleware({
    src: cfg.stylus.src,
    dest: cfg.stylus.dest
  }));
  //app.use(express.logger(cfg.log));
  app.use(app.router);
  app.use(express.static(cfg.paths.static));
});

app.configure("development", function(){
  console.log("I'm in DEV mode");
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  cfg.hostname = "localhost:3000";
});

app.configure("production", function(){
  console.log("I'm in PROD mode");
  //catch-all middleware
  app.use(function(req, res, next){
    next(new NotFound(req.url));
  });

  // Error Handling ///////////////////////////////////////////////////
  app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
      console.log("catching 404");
      console.log(err);
      res.render("404", { title: "error!", status: 404, error: err });
    } else {
      next(err);
    }
  });

  app.error(function(err, req, res){
    res.render("500", { title: "error!", status: 500, error: err });
  });

});


// Db ///////////////////////////////////////////////////////////////
db.connect("mongodb://localhost:27017/bsted");

db.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

var BlogPost = new Schema({
  author      : { type:String, default:"Matthew Mirande" },
  title       : { type:String, default:"My new post" },
  body        : { type:String, default:null },
  pic         : { type:String, default:"placeholder-pic.gif" },
  thumbPic    : { type:String, default:"placeholder-thumb.gif" },
  tags        : [String],
  isPublished : { type:Boolean, default:false },
  createdOn   : { type:Date, default:Date.now },
  editedOn    : { type:Date, default:Date.now }
});

db.model("BlogPost", BlogPost);


// Route Middleware /////////////////////////////////////////////////
function loadPost(req, res, next){
  var postModel = db.model("BlogPost");

  postModel.findById(req.params.id, function(err, post){
    if (err || !post) {
      return next(new Error("Could not find post"));
    } else {
      req.post = post.doc;
      next();
    }
  });
}


// Routes ///////////////////////////////////////////////////////////
app.get("/", function(req, res, next){
  var postModel = db.model("BlogPost");

  postModel.find({isPublished: true}).sort("createdOn", 1).run(function(err, posts) {
    if (err) {
      console.log(err);
      return next(new Error("Query returned 0 posts"));
    } else {
      res.render("index", {
        title: "busticated",
        posts: posts
      });
    }
  });
});

app.get("/feed.rss", function(req, res, next){
  var postModel = db.model("BlogPost");

  postModel.find( { "isPublished" : true }, function(err, posts){
    if (err) {
      console.log(err);
      return next(new Error("Query returned 0 posts"));
    } else {
      res.render("feed", {
        layout: false,
        posts: posts,
        baseURL: cfg.url()
      });
    }
  });
});


app.get("/post/:id", loadPost, function(req, res, next){
  res.render("post", req.post);
});

app.get("/admin", function(req, res){
  res.render("admin", {
    title: "busticated admin"
  });
});

app.get("/admin/createPost", function(req, res, next) {
  var PostModel = db.model("BlogPost"),
      post = new PostModel({});
  
  post.save(function(err) {
    if (err) {
      return next(new Error("Could not create new post"));
    } else {
      res.redirect("/admin/editPost/" + post.id);
    }
  });
});

app.get("/admin/editPost/:id", loadPost, function(req, res, next){
  var list = fs.readdir("./public/img/", function(err, files) {
    if (err) {
      return next(new Error("couldn't read dir"));
    } else {
      req.post.images = files;
      res.render("admin/editPost", req.post);
    }
  });
});

app.post("/admin/editPost/:id", function(req, res) {
  var post = db.model("BlogPost");

  post.findById(req.params.id, function(err, myPost){
    if (err) {
      return next(new Error("Could not find post"));
    } else {
      //console.log(req.body);
      myPost.pic = req.body.pic;
      myPost.thumbPic = req.body.thumbPic;
      myPost.title = req.body.title;
      myPost.body = req.body.body;
      myPost.author = req.body.author;
      myPost.isPublished = req.body.isPublished;
      myPost.editedOn = Date.now();

      myPost.save(function(err) {
        if (err) { return next(new Error("Could not save post")); }
        else { res.redirect("back"); }
      });
    }
  });
});


// Main listener ////////////////////////////////////////////////////
// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Bustication server listening on port %d", app.address().port);
}
