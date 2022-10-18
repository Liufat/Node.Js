const bcrypt = require('bcryptjs');

(async ()=>{
    const h = await bcrypt.hash('123456',10);
    console.log(h);

    const hashstr = '$2a$10$jkCo/e0cyzWL8Xv.eFdQaemtU6UzYQ9bX4hx3jc67XrUQp/AQ32t.';
    console.log(await bcrypt.compare('123456',hashstr));
})();
