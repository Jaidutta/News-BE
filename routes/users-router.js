const usersRouter = require("express").Router();

const usersControllers = require("../controllers/users.controllers")

usersRouter.route("/")
  .get(usersControllers.getAllUsers)

usersRouter.route("/:username")
  .get(usersControllers.getUserByUsername)

module.exports = usersRouter