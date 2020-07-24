module.exports = {
  name: "help",
  group: "basicGroup",
  description: "helpDescription",
  usage: "helpUsage",
  async run(client, msg, args, prefix, lang) {
    const cmdName = args[0];
    let embed;
    
    if (cmdName) {
      const command = client.commands.find(cmd => cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName)));
      if (!command || command.hidden) {
        embed = {
          title: lang.helpCommandDoesntExist(cmdName),
          description: lang.helpCommandDoesntExistDesc(prefix),
          color: 15158332,
          footer: {
            text: "codename_yey",
            icon_url: client.user.avatarURL,
          },
        };
        return msg.channel.createMessage({ embed: embed });
      }

      let usage = `${prefix}${command.name}`;
      if (command.usage) {
        if (command.usage instanceof Array) {
          usage = command.usage.map(u => `${prefix}${command.name} ${lang[u]}`).join("\n");
        } else {
          usage += ` ${lang[command.usage]}`;
        }
      }

      embed = {
        title: lang.helpCommandEmbedTitle(command.name),
        description: lang[command.description],
        color: Math.round(Math.random() * 16777216) + 1,
        fields: [
          {
            name: lang.helpCommandUsage,
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
          name: lang.helpAliases,
          value: command.aliases.map(a => `\`${a}\``).join(", "),
        });
      }

      await msg.channel.createMessage({ embed: embed });
    } else {
      let fields = [];
      for (let group of Array.from(client.groups.values())) {
        const cmdNames = group.commands.filter(c => !c.hidden).map(cmd => `\`${cmd.name}\``);
        if (!cmdNames.length) continue;

        fields.push({
          name: lang[group.name],
          value: cmdNames.join(", "),
        });
      }
      
      embed = {
        title: lang.helpTitle,
        color: Math.round(Math.random() * 16777216) + 1,
        fields,
        footer: {
          text: lang.helpTip(prefix),
          icon_url: client.user.avatarURL,
        },
      };

      await msg.channel.createMessage({ embed: embed });
    }
  }
};
