require('dotenv').config();

//引入express
const express = require('express');
//建立物件
const app = express();
//建立路由

app.set('view engine', 'ejs')//set要放在最前面
app.set('views','1011-views')

app.get('/', (req, res) => {
    // res.send(`<h2>你好</h2>`);
    res.render('main', { name: 'Shinder' });
              //樣板名    //要傳的變數
})
app.use(express.static('1011-public'))
app.use(express.static('node_modules/bootstrap/dist'))
//C:\Users\劉肥\OneDrive\前端資料\07.NodeJS\mfee29-node\node_modules\bootstrap\dist\css\bootstrap-reboot.rtl.css.map
app.use((req, res) => {
    // res.type('text/plain');//純文字，如果沒設定預設是type:html
    res.status(404).send('<h1>找不到頁面</h1>');
})


const port = process.env.SEVER_PORT || 3002;
//如果沒有設定前者，則使用3002通訊port
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});