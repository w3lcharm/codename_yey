module.exports = {
  name: "help",
  group: "generalGroup",
  description: "helpDescription",
  usage: "helpUsage",
  aliases: [ "h" ],
  async run(client, msg, args, prefix) {
    const cmdName = args[0];
    let embed;
    
    if (cmdName) {
      const command = client.commands.find(cmd => cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName)));
      if (!command || command.hidden) {
        embed = {
          title: msg.t("helpCommandDoesntExist", cmdName),
          description: msg.t("helpCommandDoesntExistDesc", prefix),
          color: 15158332,
          footer: {
            text: "codename_yey",
            icon_url: client.user.avatarURL,
          },
        };
        return msg.reply({ embed });
      }

      let usage = `${prefix}${command.name}`;
      if (command.usage) {
        if (command.usage instanceof Array) {
          usage = command.usage.map(u => `${prefix}${command.name} ${msg.t(u)}`).join("\n");
        } else {
          usage += ` ${msg.t(command.usage)}`;
        }
      }

      embed = {
        title: msg.t("helpCommandEmbedTitle", command.name),
        description: msg.t(command.description),
        color: await msg.author.embColor(),
        fields: [
          {
            name: msg.t("helpCommandUsage"),
            value: `\`\`\`\n${usage}\n\`\`\``,
          },
        ],
        footer: {
          text: "codename_yey",
          icon_url: client.user.avatarURL,
        },
      };

      if (command.aliases) {
        embed.fields.push({
          name: msg.t("helpAliases"),
          value: command.aliases.map(a => `\`${a}\``).join(", "),
        });
      }

      await msg.reply({ embed });
    } else {
      let fields = [];
      for (let group of Array.from(client.groups.values())) {
        const cmdNames = group.commands.filter(c => !c.hidden).map(cmd => `\`${cmd.name}\``);
        if (!cmdNames.length) continue;

        fields.push({
          name: msg.t(group.name),
          value: cmdNames.join(", "),
        });
      }
      
      embed = {
        title: msg.t("helpTitle"),
        color: await msg.author.embColor(),
        fields,
        footer: {
          text: msg.t("helpTip", prefix),
          icon_url: client.user.avatarURL,
        },
      };

      await msg.reply({ embed });
    }
  }
};
