module.exports = {
  name: "reload",
  group: "devGroup",
  description: "reloadDescription",
  usage: "reloadUsage",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const cmd = args[0];

    switch (cmd) {
      case "langs":
        client.reloadLanguages();
        await msg.addReaction("✅");
        break;
      case "all":
        for (const cmd of Array.from(client.commands.values())) {
          client.reloadCommand(cmd.name);
        }

        await msg.addReaction("✅");
        break;
      default:
        if (!client.commands.has(cmd)) {
          return msg.channel.createMessage(lang.reloadCmdDoesntExist(cmd));
        }

        client.reloadCommand(cmd);
        await msg.addReaction("✅");
        break;
    }
  }
};
