const db = require("../db/connection");

exports.queryUserByUsername = (username) => {
    return db
        .query("SELECT * FROM users WHERE username = $1", [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "username not found" });
            }
            return rows[0]; 
        });
};

exports.queryAllUsers = () => {
  return db.query(`
    SELECT username, name, avatar_url FROM users`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.queryUsername = (username) => {

  const queryString = `
  SELECT username, name, avatar_url 
  FROM users
  WHERE username = $1`

  return db
      .query(queryString,[username])
      .then(({ rows }) => {
          if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "no data found" });
          }
          else {
              return rows[0];
          }
      });
};