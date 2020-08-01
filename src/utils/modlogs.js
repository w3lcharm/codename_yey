const { Message } = require("eris");

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

async function onGuildMemberRemove(guild, member) {
  if (!guild) return;
  const channel = await getModlogChannel(guild);
  if (!channel) return;
  
  let entry;
  if (guild.me.permission.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => e.targetID === member.id))
      .then(entries => entries[0]);
  }

  const tag = `${member.username}#${member.discriminator}`;

  const embed = {
    author: {
      name: `${tag} left the server`,
      icon_url: member.user.avatarURL,
    },
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
  if (guild.me.permission.has("viewAuditLogs")) {
    entry = await guild.getAuditLogs()
      .then(audit => audit.entries.filter(e => e.actionType === 23)[0]);
  }

  const embed = {
    author: {
      name: `${user.tag} was unbanned`,
      icon_url: user.avatarURL,
    },
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

async function onMessageUpdate(newMsg, oldMsg) {
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

module.exports.load = function load() {
  client.on("guildMemberAdd", onGuildMemberAdd)
    .on("guildMemberRemove", onGuildMemberRemove)
    .on("guildBanRemove", onGuildBanRemove)
    .on("messageDelete", onMessageDelete)
    .on("messageUpdate", onMessageUpdate);
}

module.exports.unload = function unload() {
  client.off("guildMemberAdd", onGuildMemberAdd)
    .off("guildMemberRemove", onGuildMemberRemove)
    .off("guildBanRemove", onGuildBanRemove)
    .off("messageUpdate", onMessageUpdate)
    .off("messageUpdate", onMessageUpdate);
}
