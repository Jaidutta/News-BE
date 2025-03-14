const {
  queryCommentsByArticleId,
  queryInsertCommentByArticleId, 
  queryRemoveCommentById
} = require("../models/comments.models");


const { queryArticlesById } = require("../models/articles.models");
const { queryUserByUsername } = require("../models/users.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return queryArticlesById(article_id)
    .then(() => {
      return queryCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body, ...extraFields } = req.body;

  if (Object.keys(extraFields).length > 0) {
    return next({ status: 400, msg: "Invalid request body" });
  }

  if (username === undefined || body === undefined) {
    return next({ status: 400, msg: "missing required fields" });
  }

  if (typeof username !== "string" || typeof body !== "string" || username.trim() === "" || body.trim() === "") {
    return next({ status: 400, msg: "username and body cannot be empty" });
  }

  queryArticlesById(article_id)
    .then(() => {
      return queryUserByUsername(username);
    })
    .then(() => {
      return queryInsertCommentByArticleId(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

   return queryRemoveCommentById(comment_id)
          .then(() => {
            res.status(204).send(); 
          })
          .catch(next);
};