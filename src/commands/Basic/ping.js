module.exports = {
	name: "ping",
	group: "Basic",
	description: "Shows the bot latency.",
	async run(client, msg, args, prefix) {
		let shard;
		if (msg.guild) shard = client.shards.get(client.guildShardMap[msg.guild.id]);
		else shard = client.shards.get(0);

		const startTime = Date.now();
		const message = await msg.channel.createMessage("Measuring...");
		const embed = {
			title: `Bot latency is ${Date.now() - startTime} ms.`,
			description: `WebSocket latency is ${shard.latency} ms.`,
			color: Math.floor(Math.random() * 16777214) + 1,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
		}
		await message.edit({ content: "", embed });
	}
};
			
