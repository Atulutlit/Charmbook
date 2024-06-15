require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DUMMY_OTP: process.env.DUMMY_OTP,
  DB_LOCAL_HOST: process.env.DB_LOCAL_HOST,
  DB_LOCAL_DATABASE: process.env.DB_LOCAL_DATABASE,
  DB_LOCAL_PASSWORD: process.env.DB_LOCAL_PASSWORD,
  DB_LOCAL_DIALECT: process.env.DB_LOCAL_DIALECT,
  USER_TOKEN_KEY: process.env.USER_TOKEN_KEY,
  ADMIN_TOKEN_KEY: process.env.ADMIN_TOKEN_KEY,
  SEND_GRID_REST_API_KEY: process.env.SEND_GRID_REST_API_KEY,
}
