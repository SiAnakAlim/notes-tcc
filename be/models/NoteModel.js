import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";

const Note = db.define("notes", {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true
});

// Relasi: Note milik User
Note.belongsTo(User, { foreignKey: "userId" });

export default Note;


(async () => {
    await db.sync({ force: false });
})();
