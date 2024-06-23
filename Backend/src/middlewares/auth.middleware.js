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


exports.adminAuthMiddleware= asyncHandler(async (req, _res, next) => {
    const token = req.header('Authorization', 'Bearer Token');
    
    if (!token) throw error.AUTH_ERROR('Missing required token in request');

    let validToken = token.split(' ')

    const decodeToken = jwt.verify(validToken[1], config.USER_TOKEN_KEY);

    console.log(validToken[1],'token generate');
    if (!decodeToken) throw error.AUTH_ERROR('Unauthorised');

    const admin = await tables.Admin.findOne({where: { id: decodeToken.id }, attributes: { exclude: ['password'] }});
    console.log(admin,'data')

    if(admin.token !== validToken[1]) throw error.AUTH_ERROR('Unauthorised');
    
    if (!admin) throw error.AUTH_ERROR('Unauthorised');

    req.admin = admin
    
    next();
  }
);