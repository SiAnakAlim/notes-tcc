import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";

const RefreshToken = db.define("refresh_tokens", {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

// Relasi: RefreshToken milik User
RefreshToken.belongsTo(User, { foreignKey: "userId" });

export default RefreshToken;