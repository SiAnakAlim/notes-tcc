import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

export default new Sequelize(
  // process.env.DB_NAME || "notes-181",
  // process.env.DB_USER || "root",
  // process.env.DB_PASSWORD || "riooke2004", 
  process.env.DB_NAME ,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    // host: process.env.DB_HOST || "34.28.42.159",
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    port: '3306'
  }
);