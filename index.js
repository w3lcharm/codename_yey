#!/usr/bin/env node
const Discord = require("discord.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const config = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.musicQueue = new Map();

global.sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./bot.db",
	logging: false,
});

global.warns = (require("./dbModels/warns"))(sequelize, Sequelize.DataTypes);
global.settings = (require("./dbModels/settings"))(sequelize, Sequelize.DataTypes);

const autorole = require("./modules/autorole");

function parseArgs(str) {
	let args = [];

	while (str.length) {
		let arg;
		if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
			arg = str.slice(1, str.indexOf('"', 1));
			str = str.slice(str.indexOf('"', 1) + 1);
		} else {
			arg = str.split(/\s+/g)[0].trim();
			str = str.slice(arg.length);
		}
		args.push(arg.trim())
		str = str.trim()
	}

	return args;
}

function sleep(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
}

console.log("Loading the commands...")
fs.readdirSync("./commands").filter(file => file.endsWith(".js")).forEach(file => {
	try {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
		console.log(`${file} has been successfully loaded.`);
	} catch (err) {
		throw err
	}
});

function onReady() {
	console.log(`${client.user.username} online!`);
	client.user.setActivity(`${config.prefix}help`, { type: "WATCHING" });

	sequelize.sync();
}

async function onMessage(msg) {
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

	const args = parseArgs(msg.content.slice(config.prefix.length));
	const commandName = args.shift();

	if (!client.commands.has(commandName)) return;
	
	const command = client.commands.get(commandName);
	
	if (command.guildOnly && !msg.guild)
		return msg.channel.send("> :x: This command can only be used in the server.");

	if (command.ownerOnly && config.owners.indexOf(msg.author.id) == -1)
		return;

	try {
		await command.run(client, msg, args, config.prefix);
		console.log(`${msg.author.tag} used the ${commandName} command in ${msg.guild ? msg.guild.name : "bot DM"}`);
	} catch (err) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`:x: Error in command ${commandName}:`)
			.setDescription("```\n" + err + "\n```")
			.setColor("RED");
		console.log(`Error in command ${commandName}:\n${err.stack}`);
		await msg.channel.send(embed);
	}
}

client
	.on("ready", onReady)
	.on("message", onMessage)
	.on("guildMemberAdd", member => autorole(client, member));

client.login(config.token);
