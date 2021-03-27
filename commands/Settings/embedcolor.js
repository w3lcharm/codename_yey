const intToHex = require("../../utils/intToHex");

module.exports = {
  name: "embedcolor",
  group: "settingsGroup",
  description: "embedcolorDescription",
  usage: "embedcolorUsage",
  aliases: [ "embcolor" ],
  async run(client, msg, args, prefix) {
    const userColor = await db.embColors.findOrCreate({ where: { user: msg.author.id } })
      .then(c => c[0]);
    
    const color = args[0];
    if (!color) {
      const embed = {
        description: userColor.isRandom ? msg.t("embedcolorRandom") : userColor.color ? msg.t("embedColor", intToHex(userColor.color)) : msg.t("embedcolorDefault"),
        color: await msg.author.embColor(),
        footer: { text: msg.t("embedcolorFooter", prefix) },
      };

      await msg.reply({ embed });
    } else {
      switch (color) {
        case "default":
          await userColor.update({ color: null, isRandom: false });
          return msg.reply(msg.t("embedcolorDefaultSuccess"));
        case "random":
          await userColor.update({ color: null, isRandom: true });
          return msg.reply(msg.t("embedcolorRandomSuccess"));
        default: {
          const colorNum = color.startsWith("#") ?
            parseInt(color.replace("#", ""), 16) :
            parseInt(color);
          
          if (isNaN(colorNum) || colorNum > 16777216) {
            return msg.reply(msg.t("invalidColor"));
          }

          await userColor.update({ color: colorNum, isRandom: false });
          return msg.reply(msg.t("embedcolorSuccess", intToHex(colorNum)));
        }
      }
    }
  }
}