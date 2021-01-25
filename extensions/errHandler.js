const { PermissionError } = require("../core/CmdClient");

async function onCommandError(cmd, msg, err, showErr = false, lang) {
  if (!lang) lang = client.languages.get("en");

  if (err instanceof PermissionError) {
    const embed = {
      title: lang.dontHavePerms,
      description: lang.missingPermission(lang.permissions[err.missingPermission]),
      color: 15158332,
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    };

    return msg.reply({ embed });
  }
  
  client.logger.error(`Error in command ${cmd.name}:\n${err.stack}`);

  const embed = {
    title: lang.errorInCommand,
    description: lang.errorDesc,
    color: 15158332,
    footer: {
      text: "codename_yey",
      icon_url: client.user.avatarURL,
    },
  };

  const logsEmbed = {
    title: `:x: An error occurred while executing command ${cmd.name}.`,
    description: msg.cleanContent,
    color: 15158332,
    fields: [
      {
        name: "Error:",
        value: `\`\`\`${err}\`\`\``,
      },
      {
        name: "User:",
        value: `${msg.author.tag} (${msg.author.id})`,
      },
      {
        name: "Channel:",
        value: `${msg.channel.name} (${msg.channel.id})`,
      },
      {
        name: "Server",
        value: `${msg.guild.name} (${msg.guild.id})`,
      },
    ],
  }

  if (showErr) {
    await msg.reply({ embed });
  }
  
  await client.createMessage(client.cmdLogsChannelID, { embed: logsEmbed });
}

module.exports.load = client => client.on("commandError", onCommandError);
module.exports.unload = client => client.off("commandError", onCommandError);
