const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Click = sequelize.define(
    "click",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        urlMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        underscored: true,
    }
);

module.exports = Click;
