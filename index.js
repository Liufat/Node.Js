require('dotenv').config();

const { request } = require('express');
//引入express
const express = require('express');
//建立物件
const app = express();
//建立路由

//上傳圖片，先require multer
const multer = require('multer');
//指定路徑
const upload = multer({ dest: 'tmp_uploads/' });

const fs = require('fs').promises;

app.set('view engine', 'ejs')//set要放在最前面
app.set('views', '1011-views')

//top-level middleware
//讀取資料檔頭，如果content type=x-www-form-urlencoded，則先進行解析後再往下進行
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//content type=application/json則解析後再往下進行
app.get('/', (req, res) => {
    // res.send(`<h2>你好</h2>`);
    res.render('main', { name: 'Shinder' });
    //樣板名    //要傳的變數
})

app.get('/json-test', (req, res) => {
    res.json({ name: 'sinder1', age: 30 });
    // res.send({name:'sinder2', age:30});/重複輸出的話只會輸出第一筆，且終端機會報錯
})
app.get('/sales-json', (req, res) => {
    const sales = require(__dirname + '/1011-deta/sales');
    // console.log(sales);
    res.render("sales-json", { sales });
})

app.get('/try-qs', (req, res) => {
    res.json(req.query);
})


// const urlencodedParser = express.urlencoded({extended:false});
//有top-level middleware的話就不需要middleware了
app.post('/try-post', (req, res) => {
    res.json(req.body);
    //post資料要使用urlrncoded方法，先做解析後才能傳出
    //因為沒有畫面，要使用Postman/body/encoded去做測試
})
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
})
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
})

//圖片上傳
app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    if (req.file && req.file.originalname) {
        await fs.rename(req.file.path, `1011-public/imgs/${req.file.originalname}`);
        res.json(req.file);
    } else {
        res.json({ msg: "上傳失敗" });
    }
})

app.use(express.static('1011-public'))
app.use(express.static('node_modules/bootstrap/dist'))
//C:\Users\劉肥\OneDrive\前端資料\07.NodeJS\mfee29-node\node_modules\bootstrap\dist\css\bootstrap-reboot.rtl.css.map
app.use((req, res) => {
    // res.type('text/plain');//純文字，如果沒設定預設是type:html
    res.status(404).render('404');
})


const port = process.env.SEVER_PORT || 3002;
//如果沒有設定前者，則使用3002通訊port
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});