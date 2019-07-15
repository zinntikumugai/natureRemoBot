const fs = require('fs')
const path = require('path')
const request = require("request")
module.exports = class {
    constructor() {
    }

    static loader(folderPath = null) {
        if (!folderPath)
            return
        let loaded = []
        const readSubDirSync = (folderPath) => {
            let result = []
            const readTopDirSync = ((folderPath) => {
                let items = fs.readdirSync(folderPath)
                items = items.map((itemName) => {
                    return path.join(folderPath, itemName)
                })
                items.forEach((itemPath) => {
                    if (fs.statSync(itemPath).isDirectory())
                        readTopDirSync(itemPath)
                    else
                        result.push(itemPath)
                })
            })
            readTopDirSync(folderPath)
            return result
        }
        let list = readSubDirSync(folderPath)
        list = list.map(item => {
            return /.*\.js$/.test(item) ? item : null
        })
        list.forEach(js => {
            if (js === null)
                return
            loaded.push(js)
        })
        return loaded
    }

    static get(url) {
        return new Promise(async (resolve, reject) => {
            let ops = {
                uri: url,
                method: "GET",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }
            request.get(ops, (err, res) => {
                let json = null
                if (!res || !res.body) {
                    reject()
                    return
                }
                try {
                    json = JSON.parse(res.body)
                } catch (e) {
                    return reject(e)
                }
                resolve(json)
            })
        })
    }

    static getO(option) { 

        return new Promise(async (resolve, reject) => {
            request.get(option, (err, res) => {
                let json = null
                if (!res || !res.body) {
                    reject()
                    return
                }
                try {
                    json = JSON.parse(res.body)
                } catch (e) {
                    return reject(e)
                }
                resolve(json)
            })
        })
    }
}