const { queryAllUsers, queryUsername } = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
  return queryAllUsers()
      .then((users) => {
          res.status(200).send({ users });
      })
      .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params

    return queryUsername(username)
        .then((data) => {
            res.status(200).send({ user: data })
        })
        .catch((err) => {
            next(err);
        })
}