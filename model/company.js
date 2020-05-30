var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var companyschema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  employee: [{
    type: Schema.Types.ObjectId,
    ref: "employee"
  }]
}, {
  timestamps: true
});

var Company = mongoose.model("company", companyschema);

module.exports = Company;