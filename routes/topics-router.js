const topicsRouter = require("express").Router();

const topicsControllers = require("../controllers/topics.controllers")

topicsRouter.route("/")
    .get(topicsControllers.getAllTopics)

module.exports = topicsRouter