const articlesRouter = require("express").Router();

const { patch } = require("../app");
const articlesControllers = require("../controllers/articles.controllers")
const commentControllers = require("../controllers/comments.controllers")

articlesRouter.route("/")
    .get(articlesControllers.getAllArticles)

articlesRouter.route("/:article_id")
    .get(articlesControllers.getArticleById)
    .patch(articlesControllers.patchArticleVotes)


articlesRouter.route("/:article_id/comments")
    .get(commentControllers.getCommentsByArticleId)
    .post(commentControllers.postCommentByArticleId)

articlesRouter.route("")
module.exports = articlesRouter