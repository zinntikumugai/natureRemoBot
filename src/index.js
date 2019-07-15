process.on("unhandledRejection", console.dir)
process.CoreConfigFilename = process.cwd() + "/config.json"
process.CoreConfig = require(process.CoreConfigFilename)
process.Core = new (require("./Core"))