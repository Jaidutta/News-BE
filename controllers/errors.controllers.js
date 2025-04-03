exports.handleNonExistentEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Path Not Found" });
  next();
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" ) {
    res.status(400).send({ msg: "bad request" });
  }
  if (err.code === "42703") {
    res.status(400).send({ msg: "Incorrect parameter entered" });
  } 
  if (err.code === "42601") {
    res.status(400).send({ msg: `Incorrect data was entered`})
  } 
  next(err);
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};