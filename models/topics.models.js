const db = require("../db/connection")

exports.queryAllTopics = () => {
  console.log("Hello from models");
  
  return db.query(`SELECT * FROM topics`).then(({rows}) => {
    return rows
  })
}