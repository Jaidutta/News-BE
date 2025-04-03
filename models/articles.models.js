const db = require("../db/connection");

exports.queryAllArticles = (sort_by, order, topic) => {
    console.log("<< from model");

    const validSortByColumns = [
        "article_id",
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "comment_count",
    ];
    const validOrderValues = ["ASC", "DESC"];

    // Default values
    if (!sort_by) {
        sort_by = "created_at";
    }
    if (!order) {
        order = "DESC";
    }

    // Validation
    if (!validSortByColumns.includes(sort_by) || !validOrderValues.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: "Incorrect data was entered" });
    }

    const queryParams = [];
    let queryString = `
        SELECT 
            a.author,
            a.title,
            a.article_id,
            a.topic,
            a.created_at,
            a.votes,
            a.article_img_url,
            count(c.body)::int as comment_count
        FROM articles a
            LEFT JOIN comments c ON a.article_id = c.article_id 
    `;

    if (topic) {
        queryParams.push(topic);
        queryString += `WHERE a.topic = $1`;
    }

    queryString += `
        GROUP BY
            a.article_id 
        ORDER BY ${sort_by} ${order.toUpperCase()}
    `;

    return db
        .query(queryString, queryParams)
        .then(({ rows }) => {
            return rows;
        });
};

exports.queryArticlesById = id => {
  const queryString = `
   SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`
  return db
    .query(queryString, [id])
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