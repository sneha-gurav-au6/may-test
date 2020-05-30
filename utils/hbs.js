var hbs = require("hbs");

hbs.registerHelper("blogupdate", function() {
  return `/blog/delete/${this.id}?crud=DELETE`;
});
