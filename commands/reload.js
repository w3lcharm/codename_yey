const Discord = require("discord.js");

module.exports = {
	name: "reload",
	description: "Reloads the specified command.\nThis command can only be used by the bot owner.",
	usage: "<command>",
	ownerOnly: true,
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);
		
		const command = args[0];
		const pathToCommand = require.resolve(`../commands/${command}`);
		if (!client.commands.has(command))
			return msg.channel.send("> :x: This command doesn't exist.");
		
		delete require.cache[pathToCommand];
		client.commands.delete(command);
		const cmdObject = require(`../commands/${command}`);
		client.commands.set(cmdObject.name, cmdObject);

		const embed = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: Reloaded the \`${command}\` command.`)
			.setColor("GREEN")
			.setTimestamp()
		
		await msg.channel.send(embed);
	}
};