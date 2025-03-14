const { queryAllUsers } = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
  return queryAllUsers()
      .then((users) => {
          res.status(200).send({ users });
      })
      .catch(next);
};