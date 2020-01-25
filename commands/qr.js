const Discord = require("discord.js");
const QRCode = require("qrcode");

module.exports = {
	name: "qr",
	description: "Generates a QR code that contains your text.",
	usage: "<text>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const text = msg.content.slice(prefix.length + this.name.length + 1);
		
		const startTime = Date.now();
		let qr = await QRCode.toDataURL(text);
		qr = qr.replace("data:image/png;base64,", "");
		const finishTime = Date.now() - startTime;

		const embed = new Discord.MessageEmbed()
			.setTitle(":white_check_mark: Generated!")
			.setColor("GREEN")
			.attachFile(new Discord.MessageAttachment(Buffer.from(qr, "base64"), "file.png"))
			.setImage("attachment://file.png")
			.setFooter(`Took ${finishTime} ms.`);
		await msg.channel.send(embed);
	}
}
