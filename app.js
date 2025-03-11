const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const {getArticleById} = require("./controllers/articles.controllers");
const { handleCustomErrors, handlePsqlErrors } = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById )

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

module.exports = app