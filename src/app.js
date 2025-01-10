const express = require("express");
const app = express();
const router = require("./routers");
const sequelize = require("./db");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(router);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        app.listen(PORT, () =>
            console.log(`Server is running on http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Unable to connect to the database:", err);
    }
};

start();
