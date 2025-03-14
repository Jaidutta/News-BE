const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { 
  getAllArticles, 
  getArticleById,
  patchArticleVotes
} = require("./controllers/articles.controllers");

const { getAllTopics } = require("./controllers/topics.controllers");

const {
  getCommentsByArticleId, 
  postCommentByArticleId,
  deleteCommentById
} = require("./controllers/comments.controllers");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleNonExistentEndpoint,
  handleServerError,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch('/api/articles/:article_id', patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.all("/*", handleNonExistentEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerError);

module.exports = app;