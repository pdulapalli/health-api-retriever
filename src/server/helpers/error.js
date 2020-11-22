function propagateErrToResp(responder, err) {
  if (!responder) {
    return;
  }

  if (!err) {
    return;
  }

  if (err.statusCode) {
    responder.status(`${err.statusCode}`).json({
      error: err.message,
    });

    return;
  }

  responder.status('500').json({
    error: err.message,
  });
}

module.exports = {
  propagateErrToResp,
};
