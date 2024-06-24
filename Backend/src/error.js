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

const ERROR = function(message,statusCode){
  return {
    status: false,
    statusCode: statusCode,
    message: message,
  };
};



module.exports = {
  VALIDATION_ERROR,
  AUTH_ERROR,
  ERROR
}