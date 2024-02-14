const { MongoClient } = require("mongodb")

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(process.env.dbURL)
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                return cb(err)
            })
    },
    getDb: () => dbConnection
}