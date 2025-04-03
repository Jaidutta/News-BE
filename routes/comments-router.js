const commentsRouter = require("express").Router();

const commentsControllers = require("../controllers/comments.controllers")

commentsRouter.route("/:comment_id")
    .delete(commentsControllers.deleteCommentById)


module.exports = commentsRouter