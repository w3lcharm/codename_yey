const { exec } = require("child_process");

module.exports = {
	name: "update",
	group: "Dev",
	description: "Just git pull.",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix) {
		exec("git pull", (err, stdout, stderr) => {
			if (err) throw err;
			const embed = {
				title: ":white_check_mark: Successfully updated.",
				description: "```\n" + stdout + "\n```",
				color: 3066993,
			};

			msg.channel.createMessage({ embed: embed });
		});
	}
};
