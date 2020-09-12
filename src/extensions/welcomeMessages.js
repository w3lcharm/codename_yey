const { Member } = require("eris");

async function onGuildMemberAdd(guild, member) {
  const dbItem = await db.welcomeMessages.findOne({ where: { server: guild.id } });
  if (!dbItem) return;

  const channel = guild.channels.get(dbItem.channel);
  if (!channel) return;

  const messageText = dbItem.message.replace(/{mention}/g, member.mention)
    .replace(/{tag}/g, member.tag)
    .replace(/{server}/g, guild.name)
    .replace(/{memberCount}/g, guild.memberCount);

  await channel.createMessage(messageText);
}

async function onGuildMemberRemove(guild, member) {
  if (!member instanceof Member) {
    member = member.user;
  }

  const dbItem = await db.leaveMessages.findOne({ where: { server: guild.id } });
  if (!dbItem) return;

  const channel = guild.channels.get(dbItem.channel);
  if (!channel) return;

  const messageText = dbItem.message.replace(/{mention}/g, member.mention)
    .replace(/{tag}/g, member.tag)
    .replace(/{server}/g, guild.name)
    .replace(/{memberCount}/g, guild.memberCount);

  await channel.createMessage(messageText);
}

module.exports.load = client => {
  client.on("guildMemberAdd", onGuildMemberAdd)
    .on("guildMemberRemove", onGuildMemberRemove);
}

module.exports.unload = client => {
  client.off("guildMemberAdd", onGuildMemberAdd)
    .off("guildMemberRemove", onGuildMemberRemove);
}
