const mysql = require('mysql2');

//建立連線池(效能比較好)
const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'root',
    database:'project57',
    waitForConnections:true,//是否等待連線完成？
    connectionLimit:10,//同時最大連線數
    queueLimit:0//0 = 不限制排隊數量
});

module.exports = pool.promise();
