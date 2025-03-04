const devData = require('../data/development-data');

// console.log(Object.keys(devData));

console.log("Topics:", devData.articleData);
// console.log("Users:", devData.users);
// console.log("Articles:", devData.articles);
// console.log("Comments:", devData.comments);

const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
