const Sequelize = require('sequelize');
const DB = require('../config.json').DB;
const DataTypes = Sequelize.DataTypes;

//creating database
const db = new Sequelize(
    DB.DATABASE,
    DB.USER,
    DB.PASSWORD,
    {
        host: DB.HOST,
        dialect: "mysql"
    }
);

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Passwords = db.define('password', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    password: DataTypes.STRING
    });

Passwords.belongsTo(User);
User.hasOne(Passwords);

db.sync({alter: true})
    .then(() => console.info("Database Configured"))
    .catch((err) => console.error(err));

exports.models = {
    User, Passwords
};