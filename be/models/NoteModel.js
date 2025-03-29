import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Note = db.define("notes", {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
    freezeTableName: true
});

export default Note;


(async () => {
    await db.sync();
})();
