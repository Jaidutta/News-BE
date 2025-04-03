const usersRouter = require("express").Router();

const usersControllers = require("../controllers/users.controllers")

usersRouter.route("/")
    .get(usersControllers.getAllUsers)

module.exports = usersRouter