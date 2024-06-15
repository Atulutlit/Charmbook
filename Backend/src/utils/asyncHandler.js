const asyncHandler=(error) => {
  return (req, res, next) => {
    error(req, res, next).catch((error) => next(error));
  };
};

module.exports= asyncHandler;
