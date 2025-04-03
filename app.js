const express = require("express");
const cors = require('cors');

const apiRouter = require("./routes/api-router")

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

const { getAllUsers } = require("./controllers/users.controllers");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleNonExistentEndpoint,
  handleServerError,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", apiRouter);

app.all("/*", handleNonExistentEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerError);

module.exports = app;