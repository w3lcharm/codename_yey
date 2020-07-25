const { Message } = require("eris");

function getModlogChannel(guild) {
  return db.modlogs.findOrCreate({ where: { server: guild.id } })
    .then(c => c[0].channel);
}

async function onGuildMemberAdd(client, guild, member) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;

  const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));

  const embed = {
    author: {
      name: "Member joined",
      icon_url: member.avatarURL,
    },
    description: `${member.username}#${member.discriminator}`,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${member.id}` },
    fields: [
      {
        name: "Registered at:",
        value: `${new Date(member.createdAt).toLocaleString()} (${createdDaysAgo} days ago)`,
      },
    ],
  };
  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

async function onGuildMemberRemove(client, guild, member) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;
  
  let entry;
  if (guild.me.permission.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => (e.actionType === 20 || e.actionType === 22)))
      .then(entries => entries[0]);
  }

  const embed = {
    author: {
      name: "Member left",
      icon_url: member.user.avatarURL,
    },
    description: `${member.user.username}#${member.user.discriminator}`,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${member.id}` },
  };

  if (entry) {
    if (entry && entry.actionType === 20 && entry.targetID === member.id) {
      embed.author.name = "Member kicked";
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
    if (entry && entry.actionType === 22 && entry.targetID === member.id) {
      embed.author.name = "Member banned";
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

async function onGuildBanRemove(client, guild, user) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;
  
  let entry;
  if (guild.me.permission.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => e.actionType === 23)[0]);
  }

  const embed = {
    author: {
      name: "Member unbanned",
      icon_url: user.avatarURL,
    },
    description: `${user.username}#${user.discriminator}`,
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

async function onMessageDelete(client, msg) {
  if (!msg instanceof Message) return;
  if (!msg.channel.guild) return;
  const channel = await getModlogChannel(msg.channel.guild);
  if (!channel) return;

  if (!msg.author) return;

  if (msg.author.bot) return;

  let content = msg.cleanContent;
  if (msg.attachments.length) {
    content += "\n-----";
    for (const attachment of msg.attachments) {
      content += `\n${attachment.url}`;
    }
  }

  const embed = {
    title: "Message deleted",
    timestamp: new Date().toISOString(),
    footer: { text: `Message ID: ${msg.id}` },
    fields: [
      {
        name: "Content:",
        value: content,
      },
      {
        name: "Author:",
        value: `${msg.author.username}#${msg.author.discriminator}`,
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

async function onMessageUpdate(client, newMsg, oldMsg) {
  if (!oldMsg) return;
  if (!newMsg.channel.guild) return;
  if (!newMsg.author) return;
  if (newMsg.author.bot) return;
  
  let oldContent = oldMsg.content;
  let newContent = newMsg.content;
  if (oldContent === newContent) return;
  
  const channel = await getModlogChannel(newMsg.channel.guild);
  if (!channel) return;

  if (oldMsg.attachments.length) {
    oldContent += "\n-----";
    for (const attachment of oldMsg.attachments) {
      oldContent += `\n${attachment.url}`;
    }
  }
  if (newMsg.attachments.length) {
    newContent += "\n-----";
    for (const attachment of newMsg.attachments) {
      newContent += `\n${attachment.url}`;
    }
  };

  const embed = {
    title: "Message edited",
    timestamp: new Date().toISOString(),
    footer: { text: `Message ID: ${newMsg.id}` },
    fields: [
      {
        name: "Old message:",
        value: oldContent,
      },
      {
        name: "New message:",
        value: newContent,
      },
      {
        name: "Author:",
        value: `${newMsg.author.username}#${newMsg.author.discriminator}`,
        inline: true,
      },
      {
        name: "Channel",
        value: newMsg.channel.mention,
        inline: true,
      },
    ],
  };

  try {
    await client.createMessage(channel, { embed });
  } catch {}
}

module.exports = {
  onGuildMemberAdd,
  onGuildMemberRemove,
  onGuildBanRemove,
  onMessageDelete,
  onMessageUpdate,
};
