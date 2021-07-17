const { exec } = require("child_process");

module.exports = {
  name: "exec",
  group: "dev",
  usage: "execUsage",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix) {
    if (!args.raw.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const expr = args.raw.join(" ");

    exec(expr, (err, stdout, stderr) => {
      if (err) return msg.reply(`\`\`\`${err}\`\`\``);
      msg.reply(`\`\`\`${stdout}\`\`\``);
    });
  }
}