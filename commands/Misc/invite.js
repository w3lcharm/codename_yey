function parseInvite(invite) {
  if (isCorrectInvite(invite)) {
    return invite.split("/").pop();
  }
}

function isCorrectInvite(invite) {
  const inviteArray = invite.split("/");
  inviteArray.pop();

  const link = inviteArray.join("/")
    .replace("http://", "")
    .replace("https://", "");

  return inviteArray.length ?
    link === "discordapp.com/invite" ||
    link === "discord.gg" ||
    link === "discord.com/invite"
    : true;
}

function getGuildIconURL(guild) {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
}

module.exports = {
  name: "invite",
  group: "misc",
  description: "inviteDescription",
  usage: "inviteUsage",
  aliases: [ "inv" ],
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const invite = parseInvite(args[0]);
    if (!invite) {
      return msg.reply(msg.t("inviteInvalid")); 
    }

    let inviteInfo;
    try {
      inviteInfo = await client.getInvite(invite, true);
    } catch {
      return msg.reply(msg.t("inviteInvalid"));
    }

    if (!msg.member.permissions.has("manageMessages")) msg.delete().catch(() => {});

    const embed = {
      author: {
        name: inviteInfo.guild.name,
        icon_url: getGuildIconURL(inviteInfo.guild),
      },
      color: await msg.author.embColor(),
      fields: [
        {
          name: "ID:",
          value: inviteInfo.guild.id,
        },
        {
          name: msg.t("inviteVerificationLevel"),
          value: msg.t("verificationLevel")[inviteInfo.guild.verificationLevel],
        },
        {
          name: msg.t("inviteChannel"),
          value: `#${inviteInfo.channel.name}`,
        },
        {
          name: msg.t("inviteMemberCount"),
          value: msg.t("inviteMemberCountDesc", inviteInfo.memberCount, inviteInfo.presenceCount),
        },
      ],
    };

    if (inviteInfo.guild.description) {
      embed.description = inviteInfo.guild.description;
    }

    if (inviteInfo.inviter) {
      embed.fields.push({
        name: msg.t("inviteInviter"),
        value: inviteInfo.inviter.tag,
      });
    }

    await msg.reply({ embed });
  }
}
