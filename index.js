//引入express
const express = require('express');
//建立物件
const app = express();
//建立路由
app.get('/', (req, res) => {
    res.send(`<h2>你好</h2>`);
})


app.listen(3000, ()=>{
    console.log('server started');
});
