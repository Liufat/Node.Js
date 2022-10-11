require('dotenv').config();

//引入express
const express = require('express');
//建立物件
const app = express();
//建立路由
app.get('/', (req, res) => {
    res.send(`<h2>你好</h2>`);
})

app.use((req,res)=>{
    // res.type('text/plain');//純文字，如果沒設定預設是type:html
    res.status(404).send('<h1>找不到頁面</h1>');
})


const port = process.env.SEVER_PORT || 3002;
//如果沒有設定前者，則使用3002通訊port
app.listen(port, ()=>{
    console.log(`server started, port: ${port}`);
});
