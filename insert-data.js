const db = require("./db/connection");
const format = require("pg-format");
const { createReferenceObject, convertTimestampToDate } = require("./db/seeds/utils");

function insertTopics(topics) {
  const formattedTopics = topics.map((topic) => [
    topic.slug,
    topic.description,
    topic.img_url,
  ]);

  const insertTopicsQuery = format(
    `INSERT INTO topics (slug, description, img_url)
     VALUES %L RETURNING *;`,
    formattedTopics
  );

  return db.query(insertTopicsQuery);
}

function insertUsers(users) {
  const formattedUsers = users.map((user) => [
    user.username,
    user.name,
    user.avatar_url,
  ]);

  const insertUsersQuery = format(
    `INSERT INTO users (username, name, avatar_url)
     VALUES %L RETURNING *;`,
    formattedUsers
  );

  return db.query(insertUsersQuery);
}

function insertArticles(articles, usersRows) {
  
  const userRef = createReferenceObject(usersRows, "username", "username");

  const formattedArticles = articles.map((article) => {
    const formattedArticle = convertTimestampToDate(article);
    return [
      formattedArticle.article_title, 
      formattedArticle.topic,
      userRef[formattedArticle.author], 
      formattedArticle.body,
      formattedArticle.created_at, 
      formattedArticle.votes,
      formattedArticle.article_img_url,
    ];
  });

  const insertArticlesQuery = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
     VALUES %L RETURNING *;`,
    formattedArticles
  );

  return db.query(insertArticlesQuery);

};

function insertComments(comments, articlesRows) {
  
  const articleRef = createReferenceObject(articlesRows, "title", "article_id");

  const formattedComments = comments.map((comment) => {
    const formattedComment = convertTimestampToDate(comment);
    return [
      articleRef[formattedComment.article_title], 
      formattedComment.body,
      formattedComment.votes,
      formattedComment.author,
      formattedComment.created_at, 
    ];
  });

  const insertCommentsQuery = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at)
     VALUES %L RETURNING *;`,
    formattedComments
  );

  return db.query(insertCommentsQuery);
}

 

module.exports = { insertTopics, insertUsers, insertArticles, insertComments }