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
        let natureRemo = process.Updater
        let embed = this.embed(client)
        let config = process.CoreConfig

        let devices = await natureRemo.getDevices()
        for (const i in devices) {
            embed.fields.push({
                name: "name",
                value: devices[i].name
            })
            Object.keys(devices[i].newest_events).forEach(key => {
                let name
                let val = devices[i].newest_events[key].val
                switch (key) {
                    case "te":
                        name = "温度"
                        val += " 度"
                        break
                    case "hu":
                        name = "湿度"
                        val += " %"
                        break
                    case "il":
                        name = "照度"
                        break
                    default:
                }
                embed.fields.push({
                    name: name,
                    value: val
                })
            })
        }

        message.channel.send(message.author, { embed: embed })
        this.good(message)
    }
}