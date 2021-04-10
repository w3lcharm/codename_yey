const weather = require("weather-js");

function findWeather(opts) {
  return new Promise((resolve, reject) => { 
    weather.find(opts, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = {
  name: "weather",
  group: "miscGroup",
  description: "weatherDescription",
  usage: "weatherUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const location = args.raw.join(" ");

    const data = await findWeather({ search: location, degreeType: "C", lang: msg.t("langName") })
      .then(r => r[0]);

    if (!data) {
      return msg.reply(msg.t("locationNotFound"));
    }

    const embed = {
      title: msg.t("weatherEmbedTitle", data.location.name),
      description: data.current.skytext,
      thumbnail: { url: data.current.imageUrl },
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("weatherTemperature"),
          value: `${data.current.temperature} °C`,
          inline: true,
        },
        {
          name: msg.t("weatherFeelsLike"),
          value: `${data.current.feelslike} °C`,
          inline: true,
        },
        {
          name: msg.t("weatherHumidity"),
          value: `${data.current.humidity}%`,
        },
        {
          name: msg.t("weatherWind"),
          value: data.current.winddisplay,
        },
      ],
    };

    await msg.reply({ embed });
  }
};