const Discord = require("discord.js");
const QRCode = require("qrcode");

module.exports = {
	name: "qr",
	description: "Generates a QR code that contains your text.",
	usage: "<text>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Usage: \`${prefix}${this.name} ${this.usage}\``);

		args = msg.content.slice(prefix.length).split(/ +/);
		args.shift();
		const text = args.join(" ");

		let qr = await QRCode.toDataURL(text);
		qr = qr.replace("data:image/png;base64,", "");

		const embed = new Discord.RichEmbed()
			.setTitle(":white_check_mark: Generated!")
			.setColor("GREEN")
			.attachFile(new Discord.Attachment(Buffer.from(qr, "base64"), "file.png"))
			.setImage("attachment://file.png");
		await msg.channel.send(embed);
	}
}
