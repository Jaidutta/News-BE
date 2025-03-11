const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const {getAllTopics} = require("./controllers/topics.controllers");
const { handleNonExistentEndpoint, handleServerError } = require("./controllers/errors.controllers");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.all("/*", handleNonExistentEndpoint)

app.use(handleServerError);

module.exports = app