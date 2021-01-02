module.exports = {
  name: "base64",
  group: "utilityGroup",
  description: "base64Description",
  usage: [ "base64Usage", "base64DecodeUsage" ],
  aliases: [ "b64" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.raw.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
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
      await msg.channel.createMessage("", { name: "result.txt", file });
    } else {
      await msg.channel.createMessage(`\`\`\`${result}\`\`\``);
    }
  }
};
