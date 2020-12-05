module.exports = class Group {
  constructor(client, name) {
    this.client = client;
    this.name = name;
  }

  get commands() {
    return this.client.commands.filter(cmd => cmd.group === this.name);
  }
}
