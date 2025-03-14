const { 
  queryAllArticles, 
  queryArticlesById, 
  queryUpdateArticleVotes
 } = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  return queryAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return queryArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
      return next({ status: 400, msg: "inc_votes is required" });
  }

  if (typeof inc_votes !== 'number') {
      return next({ status: 400, msg: "inc_votes must be a number" });
  }

  queryArticlesById(article_id) 
      .then(() => {
          return queryUpdateArticleVotes(article_id, inc_votes);
      })
      .then((updatedArticle) => {
          res.status(200).send({ article: updatedArticle });
      })
      .catch(next);
};