var db = require("mongoose"),
    Schema = db.Schema,
    ObjectId = Schema.ObjectId;

db.connect("mongodb://localhost:27017/bsted");
//db.connect("localhost", "bsted", 27017);

var post = new Schema({
  author    : { type:String, default:"Matthew Mirande" },
  title     : String,
  body      : String,
  pic       : String,
  thumbPic  : String,
  tags      : [String],
  createdOn : { type:Date, default:Date.now },
  editedOn  : { type:Date, default:Date.now }
});

db.model("post", post);

var BlogPost = db.model("post"),
    myPost = new BlogPost({
      author : "Matt",
      title  : "Testing testing",
      body   : "Check one, two, three, to the four..."
    });

myPost.save(function (err) {
  console.log(err);
});

BlogPost.find({author: "Matt"}, function (err, docs) {
  console.log(err);
  console.log(docs);
});

db.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

