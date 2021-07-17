module.exports = {
  name: "base64",
  group: "utility",
  description: "base64Description",
  usage: [ "base64Usage", "base64DecodeUsage" ],
  aliases: [ "b64" ],
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.raw.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }
    
    let decodeFlag = false;

    if (args.raw[0] == "-d" || args.raw[0] == "--decode") {
      args.raw.shift();
      decodeFlag = true;
    }

    const text = args.raw.join(" ")

    const result = decodeFlag ?
      Buffer.from(text, "base64").toString() :
      Buffer.from(text).toString("base64");

    if (result.length > 2000) {
      const file = Buffer.from(result);
      await msg.reply("", { name: "result.txt", file });
    } else {
      await msg.reply(`\`\`\`${result}\`\`\``);
    }
  }
};
