const { queryArticlesById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
    
  const {article_id} = req.params
  return queryArticlesById(article_id)
    .then(article => {
      res.status(200).send({article})
    })
    .catch(err => {      
      next(err)
    })
}