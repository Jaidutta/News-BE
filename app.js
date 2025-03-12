const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { getAllArticles } = require("./controllers/articles.controllers");
const { handleNonExistentEndpoint, handleCustomErrors, handleServerError } = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/articles", getAllArticles)

app.all("/*", handleNonExistentEndpoint)

app.use(handleCustomErrors);

app.use(handleServerError);

module.exports = app