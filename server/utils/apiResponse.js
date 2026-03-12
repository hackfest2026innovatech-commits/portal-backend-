function success(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function created(res, data, message = 'Created successfully') {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

function noContent(res) {
  return res.status(204).send();
}

module.exports = { success, created, noContent };
