const Command = new require(process.cwd() + "/src/Model/Command")
const utils = require(process.cwd() + "/src/utils")

module.exports = class extends Command {
    constructor() {
        super()
        this.name = "now"
        this.enable = true
        this.hide = false
        this.shortHelp = "現在の状態を取得します"
        this.help = {
            " ": [
                ""
            ]
        }
    }

    async call(client, message, args) {
        args.shift()
        let embed = this.embed(client)
        let config = process.CoreConfig

        let ops = {
            uri: "https://api.nature.global/1/devices",
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + config.natureremo
            }
        }
        let devices = await utils.getO(ops)
        for (const i in devices) {
            console.log(devices[i].name)
            console.log(devices[i])
            console.log("users")
            for (const k in devices[i].users)
                console.log(devices[i].users[k])
            console.log("newet_event")
            console.log(devices[i].newest_events)

        }

        message.channel.send(message.author, { embed: embed })
        this.good(message)
    }
}