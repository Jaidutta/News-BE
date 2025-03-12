exports.handleNonExistentEndpoint = (err, req, res, next) => {
  res.status(404).send({msg: "Path Not Found"});
  next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  if(err.status) {
    res.status(err.status).send({msg: err.msg})
  }
  next(err);
}

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({msg: "Internal Server Error"});
}