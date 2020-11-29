module.exports = {
  name: "err",
  group: "devGroup",
  hidden: true,
  ownerOnly: true,
  async run(client, msg) {
    throw new Error("test");
  }
};
