const { request } = require('express');
const express = require('express');
const db = require(__dirname + '/../modules/db_connect2')
const router = express.Router();
const upload = require(__dirname + '/../modules/upload-imgs')



router.use((req, res, next) => {
    if(req.session.admin && req.session.admin.account){
        next();
    } else {
        res.status(403).send('請先登入')
    }
    
})

async function getListData(req,res) { //將功能分開寫
    const perPage = 10;
    let page = +req.query.page || 1;//+號是將字串轉換成數值
    if (page < 1) {
        return res.redirect(req.baseUrl);//要加上return以結束程式
    }

    let search = req.query.search ? req.query.search.trim() : '';
    let where = ` WHERE 1 `
    if (search) {
        where += ` AND 
            ( 
                \`name\` LIKE ${db.escape('%' + search + '%')}
            OR
                \`address\` LIKE ${db.escape('%' + search + '%')}
            ) `;
    }
    // res.type('text/plain; charset=utf-8')//編碼
    // return res.end(where);//測試

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where} `;
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0;
    let rows = [];
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage},${perPage}`;

        [rows] = await db.query(sql);
    }
    return { totalRows, totalPages, perPage, page, rows, search, query: req.query };//return處理完的資料
};

//CRUD

//新增資料
router.get('/add',async (req,res)=>{
    res.locals.title = '新增資料 |' + res.locals.title;
    res.render('address-book/add')
});

router.post('/add',upload.none(),async (req,res)=>{
    // res.json(req.body);
    const output = {
        success:false,
        code:0,
        error:{},
        postData:req.body
    };
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?,NOW())";

    //TODO:檢查欄位的格式，可以用joi

    const [result] = await db.query(sql,[
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday||null,
        req.body.address
    ])

    if(result.affectedRows) output.success = true;
    res.json(output);
});

//修改資料
router.get('/edit/:sid', async (req,res)=>{
    res.locals.title = '修改資料 |' + res.locals.title;
    const sql = "SELECT * FROM address_book WHERE sid=? "
    const [rows] = await db.query(sql, [req.params.sid]);
    if(!rows || !rows.length){
        return res.redirect(req.baseUrl);
    }
    res.render('address-book/edit',rows[0]);
});
router.put('/edit/:sid',async (req,res)=>{
    const output = {
        success:false,
        code:0,
        error:{},
        postData:req.body
    };
    const sql = "UPDATE `address_book` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=? WHERE `sid`=?";

    //TODO:檢查欄位的格式，可以用joi

    const [result] = await db.query(sql,[
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday||null,
        req.body.address,
        req.params.sid
    ])
    console.log(result);
    // if(result.affectedRows) output.success = true;
    if(result.changedRows) output.success = true;
    res.json(output);
});

//刪除
router.delete('/del/:sid',async(req,res)=>{
    const sql = "DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);

    res.json({success: !!result.affectedRows});
})

router.get(['/', '/list'], async (req, res) => { //匯入資料做渲染
    const data = await getListData(req);
    res.render('address-book/list', data);
});

router.get(['/api', '/api/list'], async (req, res) => {
    res.json(await getListData(req));
})

module.exports = router;