const { Member, User, Message } = require("eris");

module.exports.load = client => {
  if (!Object.getOwnPropertyDescriptor(Member.prototype, "publicFlags")) {
    Object.defineProperty(Member.prototype, "publicFlags", {
      get() { return this.user.publicFlags },
    });
  }
  
  User.prototype.embColor = async function () {
    const color = await db.embColors.findOne({ where: { user: this.id } });

    return color ? color.isRandom ? Math.round(Math.random() * 16777216) : color.color || config.defaultColor : config.defaultColor;
  }

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

  Message.prototype.t = function (str, ...args) {
    const lang = client.languages.get(this.author.lang);

    return lang[str] ? lang[str] instanceof Function ? lang[str](...args) : lang[str] : str;
  }
}