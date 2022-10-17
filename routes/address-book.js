const express = require('express');
const db = require(__dirname + '/../modules/db_connect2')
const router = express.Router();



router.use((req, res, next) => {

    next();
})

//CRUD

router.get(['/','/list'], async (req, res) => {
    const perPage = 10;
    let page = +req.query.page || 1;//+號是將字串轉換成數值
    if (page < 1) {
        return res.redirect(req.baseUrl);//要加上return以結束程式
    }

    let search = req.query.search ? req.query.search.trim() : req.query.search;
    let where = ` WHERE 1 `
    if(search){
        where += ` AND \`name\` LIKE ${db.escape('%' +search+ '%')} `;
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
    res.render('address-book/list',{ totalRows, totalPages, perPage, page, rows });
});

module.exports = router;