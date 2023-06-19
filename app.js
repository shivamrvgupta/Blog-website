//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const _ = require("lodash");
const mongoose  = require("mongoose");
const Blog = require("./models/blog.js");

app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
  console.log("Connected to MongoDB");
});


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var posts = [];




app.get("/", function(req, res){
  Blog.find()
      .then((blogs) => {
        res.render("index", {
          blogs: blogs,
          startContent: homeStartingContent,
          title: "Home"
        });
      })
      .catch((err) => {
        console.log('Error in retrieving fruit list: ' + err);
      });
});

app.get("/about", function(req, res){
  res.render("about", {startContent: aboutContent, title: "About"});
});

app.get("/contact", function(req, res){
  res.render("contact", {startContent: contactContent, title: "Contact"});
});

app.get("/blogs/:blogId", async function(req, res){
  const requestedPostId = req.params.blogId;

  try {
    const blog = await Blog.findOne({_id: requestedPostId}).exec();
    res.render("post", {
      title: blog.title,
      content: blog.content
    });
  } catch (err) {
    // Handle any errors that occurred during the operation
    // For example, you can send an error response
    res.status(500).send("Error retrieving the blog post.");
  }
});

app.get("/compose", function(req, res){
  res.render("compose", {title: "Compose"});
});

app.post("/compose", function(req, res){ 
  const blogs = new Blog();
  blogs.title = req.body.postTitle; // Update to req.body.name
  blogs.content = req.body.postBody; // Update to req.body.rating
  blogs
    .save()
    .then(() => {
      res.redirect("/");
      console.log("Successfully added blogs");
    })
    .catch((err) => {
      console.log('Error in adding blogs: ' + err);
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
