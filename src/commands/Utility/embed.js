module.exports = {
  name: "embed",
  group: "utilityGroup",
  description: "embedDescription",
  usage: "embedUsage",
  aliases: [ "emb" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const jsonData = args.raw.join(' ');
    
    let embed;
    try {
      embed = JSON.parse(jsonData);
    } catch (err) {
      embed = {
        title: lang.embedParseError,
        description: `\`\`\`${err}\`\`\``,
        color: 15158332,
      };
    }

    await msg.channel.createMessage({ embed });
  }
};
