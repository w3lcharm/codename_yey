const { Member } = require("eris");

Member.prototype.dynamicAvatarURL = function dynamicAvatarURL(format, size) {
  return this.user.dynamicAvatarURL(format, size);
}

module.exports = {
  name: "avatar",
  group: "generalGroup",
  description: "avatarDescription",
  usage: [ "avatarUsage", "avatarUsageServer" ],
  guildOnly: true,
  aliases: [ "av", "pfp" ],
  async run(client, msg, args, prefix, lang) {
    let userID = args.join(" ");
    let user;

    let embed = {
      color: await msg.author.embColor(),
    };

    if (userID === "server") {
      embed.author = {
        name: lang.serverIcon,
        url: msg.guild.iconURL,
      };
      embed.image = { url: msg.guild.iconURL };
    } else {
      if (!userID) user = msg.author;
      else user = msg.mentions[0] ||
        msg.guild.members.find(m => 
          m.tag.toLowerCase().startsWith(userID.toLowerCase()) ||
          (m.nick && m.nick.toLowerCase().startsWith(userID.toLowerCase()))
        ) || client.users.find(u => u.tag == userID) || await client.fetchUser(userID);

      if (!user) {
        return msg.channel.createMessage(lang.cantFindUser);
      }

      const format = user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";
      const url = user.dynamicAvatarURL(format, 2048);

      embed.author = {
        name: lang.avatarUser(user),
        url,
      };
      embed.image = { url };
    }
  
    await msg.channel.createMessage({ embed });
  }
};
