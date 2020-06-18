module.exports = {
  name: "avatar",
  group: "basicGroup",
  description: "avatarDescription",
  usage: [ "avatarUsage", "avatarUsageServer" ],
  guildOnly: true,
  async run(client, msg, args, prefix, lang) {
    let userID = args[0];
    let user;

    let embed = {
      color: Math.round(Math.random() * 16777216) + 1,
    };

    if (userID === "server") {
      let iconURL = msg.guild.iconURL.replace("size=128", "size=512");
      embed.author = {
        name: lang.serverIcon,
        url: iconURL,
      };
      embed.image = { url: iconURL };
    } else {
      if (!userID) user = msg.author;
      else user = msg.mentions[0] || client.users.find(u => u.tag === userID || u.id === userID);

      if (!user) return;
    
      let format, size = 2048;
      if (user.avatar) format = user.avatar.startsWith("a_") ? "gif" : "png";
      if (format === "gif") size = 256;

      embed.author = {
        name: lang.avatarUser(user),
        url: user.dynamicAvatarURL(format, 2048),
      };
      embed.image = { url: user.dynamicAvatarURL(format, size) };
    }
  
    await msg.channel.createMessage({ embed });
  }
};
