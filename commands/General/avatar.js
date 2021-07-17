const { Member } = require("eris");

Member.prototype.dynamicAvatarURL = function dynamicAvatarURL(format, size) {
  return this.user.dynamicAvatarURL(format, size);
}

module.exports = {
  name: "avatar",
  group: "general",
  description: "avatarDescription",
  usage: [ "avatarUsage", "avatarUsageServer", "avatarUsageBanner", "avatarUsageSplash" ],
  guildOnly: true,
  aliases: [ "av", "pfp" ],
  async run(client, msg, args, prefix) {
    let userID = args.join(" ");
    let user;

    const guild = client.owners.includes(msg.author.id) ?
      client.guilds.get(args[1]) || msg.guild : msg.guild;

    let embed = {
      color: await msg.author.embColor(),
    };

    switch (args[0]) {
      case "server": {
        if (!guild.iconURL) {
          return msg.reply(msg.t("avatarNoIcon"));
        }
      
        embed.author = {
          name: msg.t("serverIcon"),
        };
        embed.image = { url: guild.iconURL };

        break;
      }
      case "banner": {
        if (!guild.bannerURL) {
          return msg.reply(msg.t("avatarNoBanner"));
        }

        embed.author = {
          name: msg.t("serverBanner"),
        };
        embed.image = { url: guild.bannerURL };

        break;
      }
      case "splash": {
        if (!guild.splashURL) {
          return msg.reply(msg.t("avatarNoSplash"));
        }

        embed.author = {
          name: msg.t("serverSplash"),
        };
        embed.image = { url: guild.splashURL };

        break;
      }
      default: {
        if (!userID) user = msg.author;
        else user = msg.mentions[0] ||
          msg.guild.members.find(m => 
            m.tag.toLowerCase().startsWith(userID.toLowerCase()) ||
            (m.nick && m.nick.toLowerCase().startsWith(userID.toLowerCase()))
          ) || client.users.find(u => u.tag == userID) || await client.fetchUser(userID);

        if (!user) {
          return msg.reply(msg.t("cantFindUser"));
        }

        const guildAvatarHash = await client.requestHandler.request("GET", `/guilds/${msg.guild.id}/members/${user.id}`, true)
          .then(r => r.avatar)
          .catch(() => {});

        const format = user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";
        const url = guildAvatarHash ?
          `https://cdn.discordapp.com/guilds/${msg.guild.id}/users/${user.id}/avatars/${guildAvatarHash}.${guildAvatarHash.startsWith("a_") ? "gif" : "png"}?size=2048` :
          user.dynamicAvatarURL(format, 2048);

        embed.author = {
          name: msg.t("avatarUser", user),
        };
        embed.image = { url };

        break;
      }
    }
  
    await msg.reply({ embed, components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: msg.t("avatarURL"),
            style: 5,
            url: embed.image.url,
          },
        ],
      },
    ]});
  }
};
