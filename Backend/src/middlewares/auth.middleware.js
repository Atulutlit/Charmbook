const { tables } = require("../db/index.js");
const jwt = require("jsonwebtoken");
const config = require('../constant');
const error = require('../error.js');
const asyncHandler = require("../utils/asyncHandler.js");


exports.userAuthMiddleware = asyncHandler(async (req, _res, next) => {
  const token = req.header('Authorization', 'Bearer Token');

  if (!token) throw error.VALIDATION_ERROR('Missing required token in request');
  
  let validToken = token.split(' ')

  const decodeToken = jwt.verify(validToken[1], config.USER_TOKEN_KEY);
  
  if (!decodeToken) throw error.VALIDATION_ERROR('Unauthorised');

  const user = await tables.User.findOne({where: { id: decodeToken.id }, attributes: { exclude: ['password'] }, raw: true});
  
  if (!user) throw error.VALIDATION_ERROR('Unauthorised');

  if(user.token !== validToken[1]) throw error.AUTH_ERROR('Unauthorised');
  
  req.user = user;
  
  next();
})

//  old code
// exports.adminAuthMiddleware= asyncHandler(async (req, _res, next) => {
//     const token = req.header('Authorization', 'Bearer Token');
    
//     if (!token) throw error.AUTH_ERROR('Missing required token in request');

//     let validToken = token.split(' ')

//     const decodeToken = jwt.verify(validToken[1], config.USER_TOKEN_KEY);

//     console.log(validToken[1],'token generate');
//     if (!decodeToken) throw error.AUTH_ERROR('Unauthorised');

//     const admin = await tables.Admin.findOne({where: { id: decodeToken.id }, attributes: { exclude: ['password'] }});
//     console.log(admin,'data')

//     if(admin.token !== validToken[1]) throw error.AUTH_ERROR('Unauthorised');
    
//     if (!admin) throw error.AUTH_ERROR('Unauthorised');

//     req.admin = admin
    
//     next();
//   }
// );

// atul kesharwani (28/06/2024)
exports.adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: 'Missing required token in request',
    });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: 'Invalid token format',
    });
  }

  const token = tokenParts[1];

  try {
    const decodedToken = jwt.verify(token, config.USER_TOKEN_KEY);

    const admin = await tables.Admin.findOne({ 
      where: { id: decodedToken.id }, 
      attributes: { exclude: ['password'] } 
    });

    if (!admin || admin.token !== token) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: 'Unauthorized: ' + err.message,
    });
  }
});