class Logger {
  constructor(level, name) {
    this.level = level;
    this.name = name;
  }
  
  trace(msg) {
    if (this.level > Logger.TRACE) return;
    console.log(`\x1b[37mTRACE [${this.name}]\x1b[0m  ${msg}`);
  }

  debug(msg) {
    if (this.level > Logger.DEBUG) return;
    console.log(`\x1b[36mDEBUG [${this.name}]\x1b[0m: ${msg}`);
  }

  info(msg) {
    if (this.level > Logger.INFO) return;
    console.log(`\x1b[32mINFO [${this.name}]\x1b[0m: ${msg}`);
  }

  warn(msg) {
    if (this.level > Logger.WARN) return;
    console.log(`\x1b[33mWARNING [${this.name}]\x1b[0m: ${msg}`);
        }

  error(msg) {
                if (this.level > Logger.ERROR) return;
                console.log(`\x1b[31mERROR [${this.name}]\x1b[0m: ${msg}`);
        }
}

Logger.TRACE = 1;
Logger.DEBUG = 2;
Logger.INFO = 3;
Logger.WARN = 4;
Logger.ERROR = 5;

module.exports = Logger;
