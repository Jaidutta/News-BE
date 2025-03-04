const db = require("./db/connection");

function dropTables(){
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => db.query("DROP TABLE IF EXISTS articles;"))
    .then(() => db.query("DROP TABLE IF EXISTS users;"))
    .then(() => db.query("DROP TABLE IF EXISTS topics;"));
};

function createTables() {
  return db
    .query(`
      CREATE TABLE topics (
        slug VARCHAR(300) PRIMARY KEY,
        description VARCHAR(300) NOT NULL,
        img_url VARCHAR(1000)
      );
    `)
    .then(() =>
      db.query(`
        CREATE TABLE users (
          username VARCHAR(100) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(300),
          topic VARCHAR(300) REFERENCES topics(slug) ON DELETE CASCADE,
          author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
    );
};

module.exports = {dropTables, createTables}