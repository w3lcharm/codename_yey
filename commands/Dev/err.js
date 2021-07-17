module.exports = {
  name: "err",
  group: "dev",
  hidden: true,
  ownerOnly: true,
  async run(client, msg, args) {
    throw new Error(args.join(" "));
  }
};
