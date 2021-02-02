const { Member, User, Message } = require("eris");

module.exports.load = client => {
  if (!Object.getOwnPropertyDescriptor(Member.prototype, "publicFlags")) {
    Object.defineProperty(Member.prototype, "publicFlags", {
      get() { return this.user.publicFlags },
    });
  }
  
  if (!User.prototype.embColor) {
    User.prototype.embColor = function () {
      return db.embColors.findOne({ where: { user: this.id } })
        .then(c => c ? c.isRandom ? Math.round(Math.random() * 16777216) : c.color || config.defaultColor : config.defaultColor);
    }
  }

  if (!Message.prototype.reply) {
    Message.prototype.reply = async function (content, file) {
      const obj = {
        message_reference: {
          message_id: this.id,
          channel_id: this.channel.id,
          guild_id: this.guildID,
        },
      };

      if (typeof content == "string") {
        obj.content = content;
      } else {
        Object.assign(obj, content);
      }

      return this.channel.createMessage(obj, file);
    }
  }
}