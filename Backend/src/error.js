const VALIDATION_ERROR = function(errorMessage) {
  return {
    status: false,
    statusCode: 400,
    message: errorMessage,
  };
};

const AUTH_ERROR = function(errorMessage) {
  return {
    status: false,
    statusCode: 401,
    message: errorMessage,
  };
};


module.exports = {
  VALIDATION_ERROR,
  AUTH_ERROR
}