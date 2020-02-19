const Discord = require("discord.js");
const child_process = require("child_process");

module.exports = {
    name: "update",
    description: "Just git pull.",
    ownerOnly: true,
    hidden: true,
    async run(client, msg, args, prefix) {
        child_process.exec("git pull", (err, stdout, stderr) => {
            if (err) throw err;
            const embed = new Discord.MessageEmbed()
                .setTitle(":white_check_mark: Successfully updated.")
                .setDescription(`\`\`\`\n${stdout}\n\`\`\``)
                .setColor("GREEN")
                .setTimestamp();
            msg.channel.send(embed);
        });
    }
}