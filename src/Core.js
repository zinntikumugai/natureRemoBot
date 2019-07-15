const config = process.CoreConfig
const utils = require("./utils")
const Discord = require("discord.js")

module.exports = class {
    constructor() {
        this.client = null
        this.commands = []
        this.discordCommandInit()
        this.discordInit()
    }

    discordCommandInit() {
        let files = utils.loader(process.cwd() + "/src/Commands")
        let datas = []
        this.commands = files.map(file => {
            let tmp = require(file)
            tmp = new tmp
            if (tmp.name && tmp.enable)
                return tmp
            return null
        }).filter(v => v).map(c => {
            if (datas.indexOf(c.name) != -1) {
                console.log("Faild Command:" + c.name)
                return
            }

            datas.push(c.name)
            return c
        }).filter(v => v)
    }

    discordInit() {
        this.client = new Discord.Client()
        this.client.login(config.discord.token)

        this.client.on("ready", () => {
            this.client.user.setActivity(`${config.discord.prefix}help`, { type: "PLAYING" })
            let data = {
                Client: "",
                ClientUserTag: this.client.user.tag,
                ClientUserId: this.client.user.id,
                ClientUserName: this.client.user.username,
                JoindGuid: this.client.guilds.array().length,
                Commnads: "",
                Prefix: config.discord.prefix,
                AllCommands: this.commands.map(c => c.name),
                ShowCommands: this.commands.map(c => { if (c.hide) return; return c.name }).filter(v => v),
            }
            let maxSize = 0
            Object.keys(data).forEach(key => {
                if (maxSize < key.length)
                    maxSize = key.length
            })
            Object.keys(data).forEach(key => {
                console.log(key + (' '.repeat(maxSize).slice(key.length)) + ': ' + data[key])
            })

            process.Updater = new (require("./natureRemo"))
        })

        this.client.on("error", e => {
            console.error(e)
        })

        this.client.on("message", async message => {
            if (message.author.id === this.client.user.id)
                return

            let args = message.content.split(/[　\s\n]+/g)
            if (args[0].substring(0, config.discord.prefix.length) !== config.discord.prefix)
                return
            args[0] = args[0].slice(config.discord.prefix.length).trim()
            args = args.map(s => s.trim()).filter(v => v)
            let command = this.searchCommand(args[0])
            if (command == -1) {
                return
            }
            if (command.permission != "all") {
                switch (command.permission) {
                    case "master":
                        // 管理者
                        if (!this.checkUser(message.author.id, config.discord.permission.master)) {
                            await command.bad(message)
                            return
                        }
                        break
                    case "user":
                        // 権限付与者
                        if (!this.checkUser(message.author.id, config.discord.permission.master) && !this.checkUser(message.author.id, config.discord.permission.user)) {
                            await command.bad(message)
                            return
                        }
                        break
                    default:
                }
            }
            await command.wait(message)
            console.log(args)
            command.call(this.client, message, JSON.parse(JSON.stringify(args)))
        })
    }

    searchCommand(commandName) {
        let c = -1
        if (typeof commandName !== "string")
            return -1
        this.commands.forEach(command => {
            if (command.name.toLocaleLowerCase() == commandName.toLocaleLowerCase())
                c = command
        })
        return c
    }

    checkUser(userId, datas) {
        let u = false
        datas.forEach(user => {
            if (userId == user)
                u = true
        })
        return u
    }

    async configSave() {
        await fs.writeFileSync(process.CoreConfigFilename, JSON.stringify(process.CoreConfig, null, "    "))

    }
}