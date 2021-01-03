module.exports = {
  name: "say",
  group: "funGroup",
  description: "sayDescription",
  usage: "sayUsage",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    const text = msg.content.slice(prefix.length + this.name.length + 1);

    const embed = {
      description: text,
      color: await msg.author.embColor(),
      footer: {
        text: `${msg.author.username}#${msg.author.discriminator}`,
        icon_url: msg.author.avatarURL,
      },
    };

    await msg.channel.createMessage({ embed: embed });

    if (msg.channel.guild.members.get(client.user.id).permission.has("manageMessages"))
      await msg.delete();
  }
};
