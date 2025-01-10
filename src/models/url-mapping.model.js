const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const UrlMapping = sequelize.define(
    "url_mapping",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        originalUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        clickCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        underscored: true,
    }
);

module.exports = UrlMapping;
