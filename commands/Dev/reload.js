module.exports = {
  name: "reload",
  group: "devGroup",
  description: "reloadDescription",
  usage: "reloadUsage",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    switch (args[0]) {
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
        for (const cmd of args) {
          if (!client.commands.has(cmd)) {
            return msg.reply(msg.t("reloadCmdDoesntExist", cmd));
          }

          client.reloadCommand(cmd);
        }
        await msg.addReaction("✅");
        break;
    }
  }
};
