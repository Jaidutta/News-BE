const articles = require("../db/data/test-data/articles")
const { queryAllArticles } = require("../models/articles.models")

exports.getAllArticles = (req, res, next) => {
  return queryAllArticles()
    .then(articles => {
    res.status(200).send({articles})
    })
    .catch(err => {
      next(err)
    })
}