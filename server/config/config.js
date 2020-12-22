require('dotenv').config();
module.exports = {
"development": {
    "username": process.env.MYSQL_USER || 'root',
    "password": process.env.MYSQL_PASSWORD || null,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST, //process.env.DB_HOST || mysql
    "dialect": "mysql"
},
"test": {
    "username": process.env.MYSQL_USER || 'root',
    "password": process.env.MYSQL_PASSWORD || null,
    "database": process.env.MYSQL_DATABASE_TEST,
    "host": process.env.MYSQL_HOST || '127.0.0.1',
    "dialect": "mysql"
},
"production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": "database_production",
    "host": "mysql",
    "dialect": "mysql"
}
};
