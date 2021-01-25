module.exports = {
  name: "ping",
  group: "generalGroup",
  description: "pingDescription",
  async run(client, msg, args, prefix, lang) {
    let shard;
    if (msg.guild) shard = client.shards.get(client.guildShardMap[msg.guild.id]);
    else shard = client.shards.get(0);

    const startTime = Date.now();
    const message = await msg.reply(lang.pingMeasuring);
    const embed = {
      title: lang.pingBotLatency(Date.now() - startTime),
      description: lang.pingWebSocketLatency(shard.latency),
      color: await msg.author.embColor(),
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    }
    await message.edit({ content: "", embed });
  }
};
      
