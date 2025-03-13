const { queryAllTopics } = require("../models/topics.models")

exports.getAllTopics = (req, res) => {
   
  return queryAllTopics().then(topics => { 
    res.status(200).send({topics})
  })
  .catch(err => {
    next(err)
  })
}