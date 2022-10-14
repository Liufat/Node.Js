const mysql = require('mysql2');

//建立連線池(效能比較好)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    waitForConnections:true,//是否等待連線完成？
    connectionLimit:10,//同時最大連線數
    queueLimit:0//0 = 不限制排隊數量
});

module.exports = pool.promise();
