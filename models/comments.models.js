const db = require("../db/connection");

exports.queryCommentsByArticleId = articleId => {
    console.log("queryCommentsByArticleId called with articleId:", articleId);
    return db
        .query(
            `SELECT
                c.comment_id,
                c.votes::int,
                c.created_at,
                c.author,
                c.body,
                c.article_id
            FROM
                comments c
            WHERE
                c.article_id = $1
            ORDER BY
                c.created_at DESC;`,
            [articleId]
        )
        .then(({ rows }) => {
            return rows;
        });
};