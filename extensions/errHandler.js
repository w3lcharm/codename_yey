const { PermissionError } = require("../core/client");

async function onCommandError(cmd, msg, err, showErr = false, lang) {
  if (!lang) lang = client.languages.get("en");

  if (err instanceof PermissionError) {
    let embed = {
      title: lang.dontHavePerms,
      description: lang.missingPermission(lang.permissions[err.missingPermission]),
      color: 15158332,
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    };

    return msg.channel.createMessage({ embed });
  }
  
  client.logger.error(`Error in command ${cmdName}:\n${err.stack}`);

  let embed = {
    title: lang.errorInCommand(cmdName),
    description: `\`\`\`${err}\`\`\``,
    color: 15158332,
  };

  if (showErr) {
    await msg.channel.createMessage({ embed });
  }
}

module.exports.load = client => client.on("commandError", onCommandError);
module.exports.unload = client => client.off("commandError", onCommandError);
