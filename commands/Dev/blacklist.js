module.exports = {
  name: "blacklist",
  group: "devGroup",
  description: "blacklistDescription",
  usage: "blacklistUsage",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    let userID = args[0];
    let removeFlag = false;

    if (userID == "remove") {
      userID = args[1];
      removeFlag = true;
    }

    const user = msg.mentions.length ?
      msg.mentions[0] :
      client.users.find(u => u.tag == userID || u.id == userID);

    if (!user) {
      return msg.reply(lang.userNotFound);
    }

    const blacklistItem = await db.blacklist.findOrCreate({ where: { user: user.id } })
      .then(i => i[0]);

    if (removeFlag && !blacklistItem.blacklisted) {
      return msg.reply(lang.userNotBlacklisted);
    }

    if (!removeFlag && blacklistItem.blacklisted) {
      return msg.reply(lang.userAlreadyBlacklisted);
    }

    await blacklistItem.update({ blacklisted: !removeFlag });
    await msg.addReaction("✅");
  }
}
