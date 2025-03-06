const db = require("./db/connection");

function dropTables() {
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
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR NOT NULL,
        img_url VARCHAR(1000) NOT NULL
      );
    `)
    .then(() =>
      db.query(`
        CREATE TABLE users (
          username VARCHAR(50) PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );
      `)
    )
    .then(() =>
      db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          topic VARCHAR(255) REFERENCES topics(slug) ON DELETE CASCADE,
          author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000) NOT NULL
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
          author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
    );
};

module.exports = { dropTables, createTables }