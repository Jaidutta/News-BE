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

exports.queryInsertCommentByArticleId = (articleId, userName, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [articleId, userName, body]
    )
    .then(({ rows }) => rows[0]);
}

exports.queryRemoveCommentById = (comment_id) => {
  return db
      .query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
      .then(({ rowCount }) => {
          if (rowCount === 0) {
              return Promise.reject({ status: 404, msg: `Comment ${comment_id} not found` });
          }
      });
};