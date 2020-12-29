const { Member } = require("eris");

module.exports.load = client => {
  Object.defineProperty(Member.prototype, "publicFlags", {
    get() { return this.user.publicFlags },
  });  
}