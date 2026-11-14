const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      const validationError = new Error(messages);
      validationError.statusCode = 400;
      return next(validationError);
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
