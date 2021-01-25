const { exec } = require("child_process");

module.exports = {
  name: "update",
  group: "devGroup,",
  description: "updateDescription",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    exec("git pull", (err, stdout, stderr) => {
      if (err) throw err;
      const embed = {
        title: lang.updateSuccess,
        description: "```\n" + stdout + "\n```",
        color: 3066993,
      };

      msg.reply({ embed: embed });
    });
  }
};
