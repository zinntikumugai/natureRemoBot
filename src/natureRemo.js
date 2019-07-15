const utils = require(process.cwd() + "/src/utils")

module.exports = class {
    constructor() {
        let config = process.CoreConfig
        this.autoActivityUpdater()
        setInterval(async () => {
            await this.autoActivityUpdater()
        }, config.natureremoTempInterval);
    }

    async getDevices() {
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
        if(devices.error)
            return

        return devices
    }

    async updateActivity(data) {
        let client = process.Core.client

        client.user.setActivity(data)
    }

    async autoActivityUpdater() {
        let config = process.CoreConfig
        let datas = await this.getDevices()
        if(datas.code) {
            if (datas.code == 429001){   //many request
                this.updateActivity("API faild many request," + (new Date).toLocaleString())
                return
            }
        }
        datas.forEach(device => {
            if (device.id != config.natureremoTempDeviceId)
                return
            this.updateActivity(`${device.newest_events.te.val} - ${(new Date).toLocaleString()}`)
        });
    }
}