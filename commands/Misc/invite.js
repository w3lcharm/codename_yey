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
  group: "miscGroup",
  description: "inviteDescription",
  usage: "inviteUsage",
  aliases: [ "inv" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const invite = parseInvite(args[0]);
    if (!invite) {
      return msg.channel.createMessage(lang.inviteInvalid); 
    }

    let inviteInfo;
    try {
      inviteInfo = await client.getInvite(invite, true);
    } catch {
      return msg.channel.createMessage(lang.inviteInvalid);
    }

    if (!msg.member.permissions.has("manageMessages")) msg.delete().catch(() => {});

    const embed = {
      author: {
        name: inviteInfo.guild.name,
        icon_url: getGuildIconURL(inviteInfo.guild),
      },
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: "ID:",
          value: inviteInfo.guild.id,
        },
        {
          name: lang.inviteVerificationLevel,
          value: lang.verificationLevel[inviteInfo.guild.verificationLevel],
        },
        {
          name: lang.inviteChannel,
          value: `#${inviteInfo.channel.name}`,
        },
        {
          name: lang.inviteMemberCount,
          value: lang.inviteMemberCountDesc(inviteInfo.memberCount, inviteInfo.presenceCount),
        },
      ],
    };

    if (inviteInfo.guild.description) {
      embed.description = inviteInfo.guild.description;
    }

    if (inviteInfo.inviter) {
      embed.fields.push({
        name: lang.inviteInviter,
        value: inviteInfo.inviter.tag,
      });
    }

    await msg.channel.createMessage({ embed });
  }
}
