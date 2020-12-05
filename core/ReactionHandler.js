const EventEmitter = require("events");

class ReactionHandler extends EventEmitter {
  constructor(msg, filter, timeout) {
    super();
    this.client = msg.guild ? msg.guild.shard.client : msg.channel.client;

    if (!(filter instanceof Function)) {
      throw new TypeError(`filter should be a function, not ${typeof filter}`);
    }
    this.filterFunc = filter;
    this.listener = (msg, emoji, userID) => this.check(msg, emoji, userID);
    if (timeout) {
      const self = this;
      setTimeout(() => self.stop(), timeout);
    }
    this.client.on("messageReactionAdd", this.listener)
      .on("messageReactionRemove", this.listener);
  }

  async check(msg, emoji, member) {
    if (this.filterFunc(member.id)) {
      this.emit("reaction", msg, emoji);
    }
  }

  stop() {
    this.client.off("messageReactionAdd", this.listener)
      .off("messageReactionRemove", this.listener);
  }
}

module.exports = ReactionHandler;
