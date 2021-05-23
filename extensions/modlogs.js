const { Message } = require("eris");

const red = 0xed4245;
const gold = 0xfee75c;
const green = 0x57f287;

function getModlogChannel(guild) {
  return db.modlogs.findOrCreate({ where: { server: guild.id } })
    .then(c => c[0].channel);
}

async function onGuildMemberAdd(guild, member) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;

  const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));

  const embed = {
    author: {
      name: `${member.tag} joined the server`,
      icon_url: member.avatarURL,
    },
    color: green,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${member.id}` },
    fields: [
      {
        name: "Registered at:",
        value: `${new Date(member.createdAt).toLocaleString()} (${createdDaysAgo} days ago)`,
      },
    ],
  };

  if (member.bot) {
    embed.author.name = `${member.tag} has been added to this server`;

    if (guild.me.permissions.has("viewAuditLogs")) {
      const entry = await guild.getAuditLogs()
        .then(audit => audit.entries.filter(e => e.targetID === member.id))
        .then(entries => entries[0]);

      embed.fields.push({
        name: "Added by:",
        value: `${entry.user.tag} (${entry.user.mention})`,
      });
    }
  }
  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onGuildMemberRemove(guild, member) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;
  
  let entry;
  if (guild.me.permissions.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => e.targetID === member.id))
      .then(entries => entries[0]);
  }

  const tag = `${member.user.username}#${member.user.discriminator}`;

  const embed = {
    author: {
      name: `${tag} left the server`,
      icon_url: member.user.avatarURL,
    },
    color: red,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${member.id}` },
  };

  if (entry) {
    if (entry && entry.actionType === 20) {
      embed.author.name = `${tag} was kicked`;
      embed.fields = [
        {
          name: "Reason:",
          value: entry.reason || "None",
          inline: true,
        },
        {
          name: "Kicked by:",
          value: entry.user.tag,
          inline: true,
        },
      ];
    }
    if (entry && entry.actionType === 22) {
      embed.author.name = `${tag} was banned`;
      embed.fields = [
        {
          name: "Reason:",
          value: entry.reason || "None",
          inline: true,
        },
        {
          name: "Banned by:",
          value: entry.user.tag,
          inline: true,
        },
      ];
    }
  }

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onGuildBanRemove(guild, user) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;
  
  let entry;
  if (guild.me.permissions.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => e.actionType === 23)[0]);
  }

  const embed = {
    author: {
      name: `${user.tag} was unbanned`,
      icon_url: user.avatarURL,
    },
    color: green,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${user.id}` },
  };

  if (entry) {
    embed.fields = [
      {
        name: "Unbanned by:",
        value: `${entry.user.username}#${entry.user.discriminator}`,
      },
    ];
  }

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onMessageDelete(msg) {
  if (!msg instanceof Message) return;
  if (!msg.channel.guild) return;
  const channel = await getModlogChannel(msg.channel.guild);
  if (!channel) return;

  if (!msg.author) return;
  if (msg.author.bot) return;

  if (!msg.content) return;

  const embed = {
    title: "Message deleted",
    description: msg.cleanContent.replace(/\(/g, "\\("),
    color: red,
    timestamp: new Date().toISOString(),
    footer: { text: `Message ID: ${msg.id}` },
    fields: [
      {
        name: "Author:",
        value: `${msg.author.tag} (${msg.author.mention})`,
        inline: true,
      },
      {
        name: "Channel:",
        value: msg.channel.mention,
        inline: true,
      },
    ],
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onMessageUpdate(newMsg, oldMsg) {
  if (!oldMsg) return;
  if (!newMsg.channel.guild) return;
  if (!newMsg.author) return;
  if (newMsg.author.bot) return;
  
  if (oldMsg.content === newMsg.content) return;
  
  const channel = await getModlogChannel(newMsg.channel.guild);
  if (!channel) return;

  const embed = {
    title: "Message edited",
    description: `[(link)](${newMsg.jumpLink})`,
    color: gold,
    timestamp: new Date().toISOString(),
    footer: { text: `Message ID: ${newMsg.id}` },
    fields: [
      {
        name: "Old message:",
        value: oldMsg.content,
      },
      {
        name: "New message:",
        value: newMsg.content,
      },
      {
        name: "Author:",
        value: `${newMsg.author.tag} (${newMsg.author.mention})`,
        inline: true,
      },
      {
        name: "Channel:",
        value: newMsg.channel.mention,
        inline: true,
      },
    ],
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onGuildMemberUpdate(guild, member, oldMember) {
  if (!oldMember || !member) return;

  const channel = await getModlogChannel(guild);
  if (!channel) return;

  let embed;

  if (oldMember.nick != member.nick) {
    embed = {
      author: {
        name: `${member.tag}'s nickname was changed`,
        icon_url: member.avatarURL,
      },
      color: gold,
      fields: [
        {
          name: "Old nickname:",
          value: oldMember.nick || member.username,
          inline: true,
        },
        {
          name: "New nickname:",
          value: member.nick || member.username,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: `ID: ${member.id}` },
    };

    if (guild.me.permissions.has("viewAuditLogs")) {
      const auditEntry = await guild.getAuditLogs()
        .then(audit => audit.entries.filter(e => e.actionType == 24)[0]);

      if (auditEntry.targetID == member.id) {
        embed.fields.push({
          name: "Changed by:",
          value: auditEntry.user.tag,
        });
      }
    }
  } else {
    const addedRoles = member.roles.filter(r => !oldMember.roles.includes(r));
    const removedRoles = oldMember.roles.filter(r => !member.roles.includes(r));

    const role = guild.roles.get(addedRoles[0] || removedRoles[0]);
    if (!role) return;

    embed = {
      author: {
        name: `${member.tag}'s roles were changed`,
        icon_url: member.avatarURL,
      },
      color: gold,
      fields: [
        {
          name: addedRoles.length ? "Role added:": "Role removed:",
          value: role.mention,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: `ID: ${member.id}` },
    };
  }
  
  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onVoiceChannelJoin(member, voiceChannel) {
  const channel = await getModlogChannel(member.guild);
  if (!channel) return;

  const embed = {
    author: {
      name: `${member.tag} joined the voice channel ${voiceChannel.name}`,
      icon_url: member.avatarURL,
    },
    color: green,
    timestamp: new Date().toISOString(),
    footer: { text: `Channel ID: ${voiceChannel.id}` },
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onVoiceChannelLeave(member, voiceChannel) {
  const channel = await getModlogChannel(member.guild);
  if (!channel) return;

  const embed = {
    author: {
      name: `${member.tag} left the voice channel ${voiceChannel.name}`,
      icon_url: member.avatarURL,
    },
    color: red,
    timestamp: new Date().toISOString(),
    footer: { text: `Channel ID: ${voiceChannel.id}` },
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onInviteCreate(guild, invite) {
  const channel = await getModlogChannel(guild);
  if (!channel) return;

  const embed = {
    author: {
      name: `${invite.inviter.tag} created an invite ${invite.code}`,
      icon_url: invite.inviter.avatarURL,
    },
    timestamp: new Date().toISOString(),
    color: green,
    footer: { text: `Channel: #${invite.channel.name}` },
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onInviteDelete(guild, invite) {
  const channel = await getModlogChannel(guild);
  if (!channel) return;

  if (!guild.me.permissions.has("viewAuditLogs")) return;

  const auditEntry = await guild.getAuditLogs()
    .then(audit => audit.entries.filter(e => e.actionType == 42)[0]);
  
  const embed = {
    author: {
      name: `${auditEntry.user.tag} removed an invite ${invite.code}`,
      icon_url: auditEntry.user.avatarURL,
    },
    timestamp: new Date().toISOString(),
    color: red,
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

module.exports.load = client => {
  client.on("guildMemberAdd", onGuildMemberAdd)
    .on("guildMemberRemove", onGuildMemberRemove)
    .on("guildBanRemove", onGuildBanRemove)
    .on("messageDelete", onMessageDelete)
    .on("messageUpdate", onMessageUpdate)
    .on("guildMemberUpdate", onGuildMemberUpdate)
    .on("voiceChannelJoin", onVoiceChannelJoin)
    .on("voiceChannelLeave", onVoiceChannelLeave)
    .on("inviteCreate", onInviteCreate)
    .on("inviteDelete", onInviteDelete);
}

module.exports.unload = client => {
  client.off("guildMemberAdd", onGuildMemberAdd)
    .off("guildMemberRemove", onGuildMemberRemove)
    .off("guildBanRemove", onGuildBanRemove)
    .off("messageDelete", onMessageDelete)
    .off("messageUpdate", onMessageUpdate)
    .off("guildMemberUpdate", onGuildMemberUpdate)
    .off("voiceChannelJoin", onVoiceChannelJoin)
    .off("voiceChannelLeave", onVoiceChannelLeave)
    .off("inviteCreate", onInviteCreate)
    .off("inviteDelete", onInviteDelete);
}
