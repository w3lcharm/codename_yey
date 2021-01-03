const intToHex = require("../../utils/intToHex");

module.exports = {
  name: "embedcolor",
  group: "settingsGroup",
  description: "embedcolorDescription",
  usage: "embedcolorUsage",
  aliases: [ "embcolor" ],
  async run(client, msg, args, prefix, lang) {
    const userColor = await db.embColors.findOrCreate({ where: { user: msg.author.id } })
      .then(c => c[0]);
    
    const color = args[0];
    if (!color) {
      const embed = {
        description: userColor.isRandom ? lang.embedcolorRandom : userColor.color ? lang.embedColor(intToHex(userColor.color)) : lang.embedcolorDefault,
        color: await msg.author.embColor(),
        footer: { text: lang.embedcolorFooter(prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      switch (color) {
        case "default":
          await userColor.update({ color: null, isRandom: false });
          return msg.channel.createMessage(lang.embedcolorDefaultSuccess);
        case "random":
          await userColor.update({ color: null, isRandom: true });
          return msg.channel.createMessage(lang.embedcolorRandomSuccess);
        default: {
          const colorNum = color.startsWith("#") ?
            parseInt(color.replace("#", ""), 16) :
            parseInt(color);
          
          if (isNaN(colorNum) || colorNum > 16777216) {
            return msg.channel.createMessage(lang.invalidColor);
          }

          await userColor.update({ color: colorNum, isRandom: false });
          return msg.channel.createMessage(lang.embedcolorSuccess(intToHex(colorNum)));
        }
      }
    }
  }
}