var User = require("../model/employee");

module.exports = function(req, res, next) {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(function(user) {
        req.user = user;
        next();
      })
      .catch(function(err) {
        console.log(err);
        res.redirect("/user/login");
      });
  } else res.redirect("/user/login");
};
