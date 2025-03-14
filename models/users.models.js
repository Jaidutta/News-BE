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