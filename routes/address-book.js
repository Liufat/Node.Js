const express = require('express');
const db = require(__dirname + '/../modules/db_connect2')
const router = express.Router();



router.use((req, res, next) => {

    next();
})

//CRUD

router.get('/', async (req, res) => {
    const perPage = 10;
    let page = +req.query.page || 1;//+號是將字串轉換成數值
    if (page < 1) {
        return res.redirect(req.baseUrl);//要加上return以結束程式
    }
    const t_sql = "SELECT COUNT(1) totalRows FROM address_book";
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0;
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
    }
    res.json({totalRows,totalPages,perPage,page});
});

module.exports = router;