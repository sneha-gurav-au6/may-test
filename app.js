var express = require("express");
require("dotenv").config()
var hbs = require("hbs");
var mongoose = require("mongoose");
var User = require("./model/employee");
const Company = require("./model/company")
var userRoutes = require("./Router/userroutes");
var blogRoutes = require("./Router/blogroutes");
var methodOverride = require("method-override");
require("./utils/hbs");

var session = require("express-session");
require("./db");

var app = express();
app.set("view options", {
  layout: "layout"
});
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: false
}));
app.use(methodOverride("crud"));
app.use(
  session({
    secret: "userBlogSecrete",
    resave: false,
    name: "todoSession",
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    }
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.get("/", function (req, res) {
  var data = Company.find().then(function (data) {
    
    res.render("index", {
      title: data
    });
  }).catch(function (err) {
    console.log(err.message)
  })


});
app.use(userRoutes);

app.use(blogRoutes);
module.exports = app
