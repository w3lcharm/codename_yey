async function onCommandSuccess(cmd, msg) {
  if (!client.cmdLogsChannelID) return;

  const embed = {
    title: `Command \`${cmd.name}\` used.`,
    description: msg.cleanContent,
    fields: [
      {
        name: "User:",
        value: `${msg.author.tag} (${msg.author.id})`,
      },
      {
        name: "Channel:",
        value: `${msg.channel.name} (${msg.channel.id})`,
      },
      {
        name: "Server:",
        value: `${msg.guild.name} (${msg.guild.id})`,
      },
    ],
  };

  await client.createMessage(client.cmdLogsChannelID, { embed });
}

async function onGuildCreate(guild) {
  client.logger.info(`New server: ${guild.name} (${guild.id}) ${guild.members.size}`);

  if (!client.cmdLogsChannelID) return;

  const embed = {
    author: {
      name: `New server: ${guild.name} (${guild.id})`,
      icon_url: guild.iconURL,
    },
    footer: { text: `Total members: ${guild.members.size}` },
  };

  await client.createMessage(client.cmdLogsChannelID, { embed });
}

async function onGuildDelete(guild) {
  client.logger.info(`Left from server: ${guild.name} (${guild.id})`);

  if (!client.cmdLogsChannelID) return;

  const embed = {
    author: {
      name: `Left from server: ${guild.name} (${guild.id})`,
      icon_url: guild.iconURL,
    },
  };
  
  await client.createMessage(client.cmdLogsChannelID, { embed });
}

module.exports.load = client =>
  client.on("commandSuccess", onCommandSuccess)
    .on("guildCreate", onGuildCreate)
    .on("guildDelete", onGuildDelete);

module.exports.unload = client =>
  client.off("commandSuccess", onCommandSuccess)
    .off("guildCreate", onGuildCreate)
    .off("guildDelete", onGuildDelete);
