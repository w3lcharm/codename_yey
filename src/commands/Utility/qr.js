const QRCode = require("qrcode");

module.exports = {
	name: "qr",
	group: "Utility",
	description: "Generates a QR code from provided text.",
	usage: "<text>",
	async run(client, msg, args, prefix) {
		const text = msg.content.slice(prefix.length + this.name.length + 1);

		if (!text.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const startTime = Date.now();
		let qr = await QRCode.toDataURL(text);
		qr = qr.replace("data:image/png;base64,", "");
		const finishTime = Date.now() - startTime;

		const embed = {
			title: ":white_check_mark: Generated!",
			color: 3066993,
			image: { url: "attachment://file.png" },
			footer: { text: `Took ${finishTime} ms.`},
		};

		await msg.channel.createMessage({ embed: embed }, {
			file: Buffer.from(qr, "base64"),
			name: "file.png",
		});
	}
};
