require('dotenv').config();

const { request } = require('express');
//引入express
const express = require('express');
//建立物件
const app = express();
//建立路由

const session = require('express-session');
//引入session模組

const moment = require('moment-timezone');

//上傳圖片，先require multer
const multer = require('multer');
//指定路徑
// const upload = multer({ dest: 'tmp_uploads/' });
const upload = require(__dirname + '/modules/upload-imgs');

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

app.use(session({
    saveUninitialized: false,//session在還沒有初始化時，是否要儲存？
    resave: false,//是否要強制回存？
    //以上兩個，為了避免版本變更改變程式預設值而導致錯誤，建議在此指定預設值

    secret: "fiojcio2ojjioc2r2131940",//加密用的，隨便給他打
    cookie: {
        //預設值如下：
        // "originalMaxAge": null,
        // "expires": null,
        // "httpOnly": true,
        // "path": "/"
        maxAge: 1_200_000 //20分鐘，單位：毫秒
    }
}));



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
    // if (req.file && req.file.originalname) {
    //     await fs.rename(req.file.path, `1011-public/imgs/${req.file.originalname}`);
    //     res.json(req.file);
    // } else {
    //     res.json({ msg: "上傳失敗" });
    // }
    res.json(req.file);//顯示結果而已，沒有這段一樣會上傳

})
app.post('/try-upload2', upload.array('photos'), async (req, res) => {
    res.json(req.files);
})

app.get('/my-params1/:action?/:id?', async (req, res) => {
    res.json(req.params);
})

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.slice(3);//從第三個字元(m/0)=>0開始
    u = u.split('?')[0];//去掉query string
    u = u.splut('-').join('');//去掉-
    res.json({ mobile: u });
})
app.use('/admin2', require(__dirname + '/routes/admin2'));



const myMiddle = (req, res, next) => {
    res.locals = { ...res.locals, shinder: '哈囉' };
    res.locals.yoooo = 123456;
    res.locals.yoooo2 = 1234567;
    next();//必要
}
app.get('/try-middle', [myMiddle], (req, res) => {
    //middleware其實是陣列，一個執行完後，接收next()指令，然後執行下一個
    res.json(res.locals);
})

app.get('/try-session', (req, res) => {
    req.session.aaa ||= 0; //預設值
    req.session.aaa++;
    res.json(req.session);
})

app.get('/try-date',(req,res)=>{
    const now = new Date;
    const m = moment();

    res.send({
        t1:now,
        t2:now.toString(),
        t3:now.toDateString(),
        t4:now.toLocaleDateString(),
        m:m.format('YYYY-MM-DD HH:mm:ss')
    })
})

//-------------------------------------------------------------
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