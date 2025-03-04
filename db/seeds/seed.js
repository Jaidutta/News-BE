const db = require("../connection")
const { dropTables, createTables } = require("../../drop-create-tables");
const { insertTopics, insertUsers, insertArticles, insertComments } = require("../../insert-data")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return dropTables()
    .then(() => createTables())
    .then(() => insertTopics(topicData))
    .then(({ rows: topicsRows }) => {
      console.log("Topics inserted:", topicsRows);

      return insertUsers(userData);
    })
    .then(({rows: usersRows}) => {
      // console.log("Users inserted:", usersRows);

      return insertArticles(articleData, usersRows);
    })
    .then(({rows: articleRows}) => {
      // console.log("articles inserted:", articleRows);
      insertComments(commentData, articleRows)
    })
    .then(({rows: commentRows}) => {
      console.log("articles comment:", commentRows);
      
    })
    .catch((error) => {
      console.error("Error during seeding process:", error);
    });
};
module.exports = seed;
