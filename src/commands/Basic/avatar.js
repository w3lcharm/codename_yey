module.exports = {
  name: "avatar",
  group: "basicGroup",
  description: "avatarDescription",
  usage: [ "avatarUsage", "avatarUsageServer" ],
  guildOnly: true,
  aliases: [ "av", "pfp" ],
  async run(client, msg, args, prefix, lang) {
    let userID = args.join(" ");
    let user;

    let embed = {
      color: Math.round(Math.random() * 16777216) + 1,
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
        msg.guild.members.find(m => m.username.toLowerCase() === userID.toLowerCase()) ||
        client.users.find(u => u.tag === userID || u.id === userID);

      // if (user instanceof Member) user = user.user;

      if (!user) {
        return msg.channel.createMessage(lang.cantFindUser);
      }

      embed.author = {
        name: lang.avatarUser(user),
        url: user.avatarURL,
      };
      embed.image = { url: user.avatarURL };
    }
  
    await msg.channel.createMessage({ embed });
  }
};
