module.exports = class {
    constructor() {
        this.name = null
        this.enable = true
        this.hide = false
        this.permission = "all"
    }

    embed(client) {
        return {
            color: 0x0080ff,
            author: {
                name: client.user.tag,
                icon_url: client.user.avatarURL
            },
            fields: [],
            timestamp: new Date
        }
    }

    shortHelp() {
        throw new Error("Faild shortHelp")
    }

    help() {
        throw new Error("Faild help")
    }

    call() {
        throw new Error("Faild call")
    }

    async good(message) {
        await message.react("👍")
    }

    async bad(message) {
        await message.react("❌")
    }

    async wait(message) {
        await message.react("⌛")
    }
}