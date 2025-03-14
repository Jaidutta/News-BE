const { queryCommentsByArticleId } = require("../models/comments.models");
const { queryArticlesById } = require("../models/articles.models");

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