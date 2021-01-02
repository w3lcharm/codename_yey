module.exports = {
  name: "embed",
  group: "utilityGroup",
  description: "embedDescription",
  usage: "embedUsage",
  aliases: [ "emb" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const jsonData = args.raw.join(' ');
    
    let embed;
    try {
      const data = JSON.parse(jsonData);

      if (data.embeds && data.embeds instanceof Array) embed = data.embeds[0];
      else if (data.embed) embed = data.embed;
      else embed = data;
    } catch (err) {
      embed = {
        title: lang.embedParseError,
        description: `\`\`\`${err}\`\`\``,
        color: 15158332,
      };
    }
    
    if (embed instanceof Object) {
      await msg.channel.createMessage({ embed });
    } else {
      await msg.channel.createMessage(lang.embedInvalid);
    }
  }
};
