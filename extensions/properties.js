const { Member, User } = require("eris");

module.exports.load = client => {
  if (!Member.prototype.publicFlags) {
    Object.defineProperty(Member.prototype, "publicFlags", {
      get() { return this.user.publicFlags },
    });
  }
  
  if (!User.prototype.embColor) {
    User.prototype.embColor = function () {
      return db.embColors.findOne({ where: { user: this.id } })
        .then(c => c ? c.isRandom ? Math.round(Math.random() * 16777216) : c.color : config.defaultColor);
    }
  }
}