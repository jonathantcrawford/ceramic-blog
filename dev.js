process.env.PORT = process.env.PORT ?? 3000;
// process.env.ARC_LOCAL = process.env.ARC_LOCAL ?? 1;
// process.env.ARC_TABLES_PORT = process.env.ARC_TABLES_PORT ?? 5555;
process.env.ARC_ENV = "staging";

const { watchFile, unwatchFile } = require("fs");
const { join } = require("path");
const arc = require("@architect/architect");

const server = join(__dirname, "server/index.js");

// Wait until the server is built
watchFile(server, { interval: 100 }, (curr, prev) => {
  if (!prev.size && curr.size) {
    void arc();
    unwatchFile(server);
  }
});