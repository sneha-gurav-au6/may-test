var express = require("express");
var router = express.Router();
var User = require("../model/employee");
var bcrypt = require("bcryptjs");
var authenticate = require("../middleware/anthnticate");
var app = express();
app.use(express.urlencoded({ extended: false }));
router.get("/user/register", function(req, res) {
  res.render("register");
});
router.post("/user/register", function(req, res) {
  var user = new User({ ...req.body });
  user
    .save()
    .then(function(user) {
      req.session.userId = user._id;
      res.redirect("/user/login");
    })
    .catch(function(err) {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(400).send(`Validation Error: ${err.message}`);
    });
}),
  router.get("/user/login", function(req, res) {
    res.render("login");
  });
router.post("/user/login", function(req, res) {
  var body = req.body;
  var email = body.email;
  var password = body.password;
  if (!email || !password) return res.send("Invalid Creadiantials");
  User.userFind(email, password)
    .then(function(user) {
      req.session.userId = user._id;
      res.redirect("/user/dashboard");
    })
    .catch(function(err) {
      console.log(err);
      res.send("invalid Credintials");
    });
});

// logOutUser: function(req, res) {
//   req.session.destroy();
//   return res.redirect("/");
// }

module.exports = router;
