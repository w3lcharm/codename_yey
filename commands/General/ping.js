module.exports = {
  name: "ping",
  group: "generalGroup",
  description: "pingDescription",
  async run(client, msg, args, prefix) {
    const startTime = Date.now();
    const message = await msg.reply(msg.t("pingMeasuring"));
    
    const embed = {
      title: msg.t("pingBotLatency", Date.now() - startTime),
      description: msg.t("pingWebSocketLatency", msg.guild.shard.latency),
      color: await msg.author.embColor(),
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    }
    
    await message.edit({ content: "", embed });
  }
};
      
