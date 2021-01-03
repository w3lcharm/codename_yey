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
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const location = args.raw.join(" ");

    const data = await findWeather({ search: location, degreeType: "C", lang: lang.langName })
      .then(r => r[0]);

    if (!data) {
      return msg.channel.createMessage(lang.locationNotFound);
    }

    const embed = {
      title: lang.weatherEmbedTitle(data.location.name),
      description: data.current.skytext,
      thumbnail: { url: data.current.imageUrl },
      color: await msg.author.embColor(),
      fields: [
        {
          name: lang.weatherTemperature,
          value: `${data.current.temperature} °C`,
          inline: true,
        },
        {
          name: lang.weatherFeelsLike,
          value: `${data.current.feelslike} °C`,
          inline: true,
        },
        {
          name: lang.weatherHumidity,
          value: `${data.current.humidity}%`,
        },
        {
          name: lang.weatherWind,
          value: data.current.winddisplay,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
};
