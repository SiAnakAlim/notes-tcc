import { Sequelize } from "sequelize";
export default new Sequelize(
  process.env.DB_NAME || "notes-181",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "riooke2004", {
    host: process.env.DB_HOST || "34.28.42.159",
    dialect: "mysql",
    logging: false
  }
);