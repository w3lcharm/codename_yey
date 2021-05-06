async function onMessageReactionAdd(msg, emoji, user) {
  const dbItem = await db.reactionRoles.findOne({
    where: {
      channel: msg.channel.id,
      message: msg.id,
      emojiName: emoji.name,
      emojiID: emoji.id,
    },
  });

  if (!dbItem) return;

  if (!client.guilds.get(msg.guildID).roles.has(dbItem.role)) return;

  await user.addRole(dbItem.role);
}

async function onMessageReactionRemove(msg, emoji, user) {
  const dbItem = await db.reactionRoles.findOne({
    where: {
      channel: msg.channel.id,
      message: msg.id,
      emojiName: emoji.name,
      emojiID: emoji.id,
    },
  });

  if (!dbItem) return;

  if (!client.guilds.get(msg.guildID).roles.has(dbItem.role)) return;

  await client.removeGuildMemberRole(msg.guildID, user, dbItem.role);
}

module.exports.load = async client => {
  client.on("messageReactionAdd", onMessageReactionAdd);
  client.on("messageReactionRemove", onMessageReactionRemove);
}

module.exports.unload = async client => {
  client.off("messageReactionAdd", onMessageReactionAdd);
  client.off("messageReactionRemove", onMessageReactionRemove);
}