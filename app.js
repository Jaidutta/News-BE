const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { 
  getAllArticles, 
  getArticleById
} = require("./controllers/articles.controllers");

const { getAllTopics } = require("./controllers/topics.controllers");

const {getCommentsByArticleId} = require("./controllers/comments.controllers");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleNonExistentEndpoint,
  handleServerError,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", handleNonExistentEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerError);

module.exports = app;