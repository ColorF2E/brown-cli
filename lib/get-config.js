const fs = require('fs')
const { resolveCwd } = require('./utils')

module.exports = () => {
    if (fs.existsSync(resolveCwd('.colorc'))) {
        try {
            return fs.readFileSync(resolveCwd('.colorc'))
        } catch (err) {
            console.error('获取 colorc 出错')
            console.error(err)
        }
    } else if (fs.existsSync(resolveCwd('.colorc.js'))) {
        return require(resolveCwd('.colorc.js'))
    } else if (fs.existsSync(resolveCwd('.colorc.json'))) {
        return require(resolveCwd('.colorc.json'))
    } else {
        return
    }
}
