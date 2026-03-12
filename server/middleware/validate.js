const AppError = require('../utils/AppError');

function validate(schema, property = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join('. ');
      return next(new AppError(messages, 400));
    }

    req[property] = value;
    next();
  };
}

module.exports = validate;
