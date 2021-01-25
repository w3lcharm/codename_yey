module.exports = {
  name: "err",
  group: "devGroup",
  hidden: true,
  ownerOnly: true,
  async run(client, msg, args) {
    throw new Error(args.join(" "));
  }
};
