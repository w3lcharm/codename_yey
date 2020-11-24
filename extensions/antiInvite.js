const regexp = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;

async function onMessage(msg) {
  if (!msg.guild) return;
  if (
    msg.member && (msg.member.permission.has("manageMessages") ||
    msg.guild.me.highestRole.position <= msg.member.highestRole.position)
  ) return;
  if (!msg.channel.memberHasPermission(msg.guild.me, "readMessageHistory")) return;
  if (msg.author.bot) return;

  if (regexp.test(msg.content)) {
    const dbItem = await db.antiInvite.findOne({ where: { server: msg.guild.id } });
    if (!dbItem || !dbItem.action) return;

    const userLang = await db.languages.findOrCreate({ where: { user: msg.member.id } })
      .then(l => msg._client.languages.get(l[0].lang));

    if (msg.channel.memberHasPermission(msg.guild.me, "manageMessages")) {
      switch (dbItem.action) {
        case "delete": {
          await msg.delete();
          break;
        }
        case "warn": {
          await msg.delete();

          const warnObj = await db.warns.create({
            server: msg.guild.id,
            user: msg.member.id,
            warnedBy: msg._client.user.id,
            reason: userLang.antiInviteReason,
          });

          const embed = {
            author: {
              name: userLang.warnSuccess(msg.member),
              icon_url: msg.member.avatarURL,
            },
            description: userLang.reason(userLang.antiInviteReason),
            color: 3066993,
            timestamp: new Date().toISOString(),
            footer: { text: userLang.warnID(warnObj.id) },
          };
          await msg.channel.createMessage({ embed });

          break;
        }
        case "kick": {
          await msg.delete();
          await msg.member.kick(userLang.antiInviteReason);

          const embed = {
            author: {
              name: userLang.kickSuccess(msg.member),
              icon_url: msg.member.avatarURL,
            },
            description: userLang.reason(userLang.antiInviteReason),
            color: 3066993,
            timestamp: new Date().toISOString(),
          };

          await msg.channel.createMessage({ embed });

          break;
        }
        case "ban": {
          await msg.delete();
          await msg.member.ban(0, userLang.antiInviteReason);

          const embed = {
            author: {
              name: userLang.banSuccess(msg.member),
              icon_url: msg.member.avatarURL,
            },
            description: userLang.reason(userLang.antiInviteReason),
            color: 3066993,
            timestamp: new Date().toISOString(),
          };

          await msg.channel.createMessage({ embed });

          break;
        }
      }
    }
  }
}

module.exports.load = client => client.on("messageCreate", onMessage);
module.exports.unload = client => client.off("messageCreate", onMessage);
