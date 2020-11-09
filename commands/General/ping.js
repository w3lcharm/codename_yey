module.exports = {
  name: "ping",
  group: "generalGroup",
  description: "pingDescription",
  async run(client, msg, args, prefix, lang) {
    let shard;
    if (msg.guild) shard = client.shards.get(client.guildShardMap[msg.guild.id]);
    else shard = client.shards.get(0);

    const startTime = Date.now();
    const message = await msg.channel.createMessage(lang.pingMeasuring);
    const embed = {
      title: lang.pingBotLatency(Date.now() - startTime),
      description: lang.pingWebSocketLatency(shard.latency),
      color: Math.floor(Math.random() * 16777214) + 1,
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    }
    await message.edit({ content: "", embed });
  }
};
      
