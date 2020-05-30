var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: [{
    type: Schema.Types.ObjectId,
    ref: "company"
  }],
  password: {
    type: String,
    required: true
  }
});
schema.statics.userFind = function (email, password) {
  var userObj = null;
  return new Promise(function (resolve, reject) {
    Employee.findOne({
        email: email
      })
      .then(function (user) {
        if (!user) reject("Incorrect Credintials");
        userObj = user;
        return bcrypt.compare(password, user.password);
      })
      .then(function (isMatched) {
        if (!isMatched) reject("Incorrect credentials");
        resolve(userObj);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
schema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt
      .hash(user.password, 10)
      .then(function (hashedPassword) {
        user.password = hashedPassword;
        next();
      })
      .catch(function (err) {
        next(err);
      });
  }
});

var Employee = mongoose.model("employee", schema);
module.exports = Employee;