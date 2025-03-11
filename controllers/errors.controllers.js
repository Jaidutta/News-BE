exports.handleNonExistentEndpoint = (req, res, next) => {
  res.status(404).send({msg: "Path Not Found"});
  next();
}

exports.handleServerError = (error, req, res, next) => {
  res.status(500).send({msg: "Internal Server Error"});
}

