const db = require("./db/connection");
const format = require("pg-format");
const { createReferenceObject, convertTimestampToDate } = require("./db/seeds/utils");

function insertTopics(topics) {
  const formattedTopics = topics.map((topic) => [
    topic.description,
    topic.slug,
    topic.img_url,
  ]);

  const insertTopicsQuery = format(
    `INSERT INTO topics ( description, slug, img_url)
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

  return db.query(insertUsersQuery)
    .catch(err => {
      console.error('Error inserting users:', err);
      throw err;
    })
}

function insertArticles(articles) {
  
 // const userRef = createReferenceObject(usersRows, "username", "username");

  const formattedArticles = articles.map((article) => {
    const formattedTimeStamp = convertTimestampToDate(article);
    return [
      article.title,
      article.topic,
      article.author,
      article.body,
      formattedTimeStamp.created_at, 
      article.votes,
      article.article_img_url
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
    const articleTitle = formattedComment.article_title;
    const articleId = articleRef[articleTitle];

    console.log(`Attempting to insert comment for article: ${articleTitle}, ID: ${articleId}`);
    return [
      articleId, 
      comment.body,
      comment.votes,
      comment.author,
      formattedComment.created_at, 
    ];
  });

  const insertCommentsQuery = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at)
     VALUES %L RETURNING *;`,
    formattedComments
  );

  return db.query(insertCommentsQuery)
            .catch((err)=>{
              console.log(err, "Error when inserting comments");
            });
}

 

module.exports = { insertTopics, insertUsers, insertArticles, insertComments }