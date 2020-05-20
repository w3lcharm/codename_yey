const QRCode = require("qrcode");

module.exports = {
	name: "qr",
	group: "utilityGroup",
	description: "qrDescription",
	usage: "qrUsage",
	async run(client, msg, args, prefix, lang) {
		const text = msg.content.slice(prefix.length + this.name.length + 1);

		if (!text.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));

		const startTime = Date.now();
		let qr = await QRCode.toDataURL(text);
		qr = qr.replace("data:image/png;base64,", "");
		const finishTime = Date.now() - startTime;

		const embed = {
			color: Math.round(Math.random() * 16777216) + 1,
			image: { url: "attachment://file.png" },
			footer: { text: lang.generationTime(finishTime)},
		};

		await msg.channel.createMessage({ embed: embed }, {
			file: Buffer.from(qr, "base64"),
			name: "file.png",
		});
	}
};
