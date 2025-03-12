const db = require("../db/connection")

exports.queryAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({rows}) => {
    return rows
  })
}