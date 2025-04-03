const db = require("../db/connection");

exports.queryAllArticles = (sort_by, order) => {
  const whiteListedSortByColumnInputs = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const whiteListedOrderInputs = ["asc", "desc"];

  if (!sort_by) {
    sort_by = "created_at";
  }

  if (!order) {
    order = "desc";
  }

  if (!whiteListedSortByColumnInputs.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Column Input" });
  }

  if (!whiteListedOrderInputs.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Order Input" });
  }
  return db
    .query(
      `
      SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by} ${order};
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.queryArticlesById = id => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: `The Article id: ${id} does NOT exist` });
      }
      return rows[0];
    });
};

exports.queryUpdateArticleVotes = (article_id, inc_votes) => {
  return db
      .query(
          `
          UPDATE articles 
          SET votes = votes + $1 
          WHERE article_id = $2 
          RETURNING *,
              (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)::int AS comment_count
          `,
          [inc_votes, article_id]
      )
      .then(({ rows }) => {
          if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: `Article ${article_id} not found` });
          }
          return rows[0]; 
      })
}