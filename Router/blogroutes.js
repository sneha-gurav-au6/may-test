var express = require("express");
var routes = express.Router();
var authenticate = require("../middleware/anthnticate");
var Blog = require("../model/company");
var User = require("../model/employee");

routes.get("/user/dashboard", authenticate, function (req, res) {
  var user = req.user;

  // console.log(user._id);

  // User.find({user:})s
  Blog.find({
      employee: user._id
    })
    .then(function (data) {
      return res.render("dashboard", {
        userId: user.id,
        name: user.name,
        blog: data,
        date: user.date,
        length: data.length
      });
    })
    .catch(function (err) {
      console.log(err.message);
    });
});

routes.get("/create/blog", function (req, res) {
  res.render("blog");
});
routes.post("/create/blog", authenticate, function (req, res) {
  var user = req.user;
  // console.log(user);

  var blog = new Blog({
    ...req.body
  });

  // Wire the currently logged in user to the new blog.
  blog.employee = user._id;
  user.company.push(blog._id);
  // Saving the new todo into the user's todo array
  user
    .save()
    .then(function (usersd) {
      console.log("User has successfully added the new Todo");
    })
    .catch(function (err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
      return res.status(500).send("Server Error");
    });

  // Saving the new todo inside Todo table.
  blog
    .save()
    .then(function (blogObj) {
      return res.redirect("/user/dashboard");
    })
    .catch(function (err) {
      console.log(err.messsage);
      return res.status(500).send("Server Error");
    });
});
routes.get("/blog/update/:blogid", function (req, res) {
  var blogid = req.params.blogid;
  Blog.findById(blogid)
    .then(function (blogData) {
      res.render("blogupdate", {
        title: blogData.title,
        body: blogData.body,
        id: blogData._id
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});
routes.post("/blog/update/:id", authenticate, function (req, res) {
  var user = req.user.id;
  var userid = req.params.id;
  Blog.updateOne({
      _id: userid
    }, {
      ...req.body
    }, {
      new: true
    })
    .then(function (blodData) {
      res.redirect("/user/dashboard");
    })
    .catch(function (err) {
      console.log(err.message);
    });
});

routes.delete("/blog/delete/:id", function (req, res) {
  var blogid = req.params.id;
  Blog.deleteOne({
      _id: blogid
    })
    .then(function (blog) {
      if (!blog) return res.status(404).send("blog not found");
      res.redirect("/user/dashboard");
    })
    .catch(function (err) {
      if (err.name === "CastError")
        return res.status(400).send("Invalid Todo ID");
      console.log(err);
      return res.status(500).send("Server Error");
    });
});
routes.delete("/user/logout", authenticate, function (req, res) {
  req.session.destroy();
  return res.redirect("/");
});

routes.get("/company/details/:id", async (req, res) => {
  var id = req.params.id
  // var eIIId = []
  // console.log(id)
  var data = await Blog.findById(id)
  // var eid = data.employee
  // console.log(eid)
  var eid = data.employee[0]
  var isd = await User.findById(
    eid
  )
  console.log(isd)
  // eIIId.push(eid)
  // console.log(eid)

  res.render("company", {
    data1: data.title,
    name: isd.name,
    email: isd.email

  })
  // console.log(data)
  // User.find(id)

  // res.send("hello")


  // console.log(eIIId)

})
module.exports = routes;