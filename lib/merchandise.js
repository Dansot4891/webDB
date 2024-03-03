//201931541 임명우
const sanitize = require('sanitize-html');
var db = require('./db');


module.exports = {
    view: (req, res) => {
        var vu = req.params.vu;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
                if (vu == 'v') {
                    if (merchandises == '') {
                        tag = "자료 없음"
                    } else {
                        var i = 0;
                        var tag = ''
                        while (i < merchandises.length) {
                            tag = tag + '<table class="table table-bordered ">'
                            tag = tag + `<tr border:5px><td width="400"><a href="/shop/detail/${merchandises[i].mer_id}"><img src="${merchandises[i].image}" style="width:100px;height:100px; "></a></td><td width="400">${merchandises[i].name}</td>
                    <td width="400">가격 : ${merchandises[i].price}</td><td width="400">브랜드 : ${merchandises[i].brand}</td>`
                            tag = tag + '</table>';
                            i += 1
                        }
                    }
                } else if (vu == 'u') {
                    var i = 0;
                    var tag = ''
                    while (i < merchandises.length) {
                        tag = tag + '<table class="table table-bordered ">'
                        tag = tag + `<tr border:5px><td width="400"><a href="/shop/detail/${merchandises[i].mer_id}"><img src="${merchandises[i].image}" style="width:100px;height:100px; "></a></td><td width="350">${merchandises[i].name}</td>
                <td width="350">가격 : ${merchandises[i].price}</td><td width="400">브랜드 : ${merchandises[i].brand}</td>
                <td width="100"><a href="/merchandise/update/${merchandises[i].mer_id}">수정</a></td>
                <td width="100"><a href="/merchandise/delete/${merchandises[i].mer_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>`
                        tag = tag + '</table>';
                        i += 1
                    }
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tag: tag,
                    boardtypes: boardtypes
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    update: (req, res) => {
        var vu = req.params.vu;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM merchandise WHERE mer_id=${vu}`, (error, merchandise) => {


                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: 'YES',
                    state: 'update',
                    merchandise: merchandise[0],
                    boardtypes: boardtypes
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    update_process: (req, res, file) => {
        var post = req.body;
        var filename = file;
        sanitizedcategory = sanitize(post.category);
        sanitizedname = sanitize(post.name);
        sanitizedprice = sanitize(post.price);
        sanitizedstock = sanitize(post.stock);
        sanitizedbrand = sanitize(post.brand);
        sanitizedsupplier = sanitize(post.supplier);
        sanitizedimage = sanitize(post.image);
        sanitizedsale_yn = sanitize(post.sale_yn);
        sanitizedsale_price = sanitize(post.sale_price);
        if (filename == "No") {
            filename = sanitizedimage;
        }

        db.query(`UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=? WHERE mer_id=?`,
            [sanitizedcategory, sanitizedname, sanitizedprice, sanitizedstock, sanitizedbrand, sanitizedsupplier, filename, sanitizedsale_yn, sanitizedsale_price, post.mer_id], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/merchandise/view/u` });
                res.end();
            })
    },
    create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'merchandiseCU.ejs',
                logined: 'YES',
                state: 'create',
                boardtypes: boardtypes
            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    create_process: (req, res, file) => {
        var filename = file;
        var post = req.body;
        sanitizedcategory = sanitize(post.category);
        sanitizedname = sanitize(post.name);
        sanitizedprice = sanitize(post.price);
        sanitizedstock = sanitize(post.stock);
        sanitizedbrand = sanitize(post.brand);
        sanitizedsupplier = sanitize(post.supplier);
        sanitizedimage = sanitize(post.fileName);
        sanitizedsale_yn = sanitize(post.sale_yn);
        sanitizedsale_price = sanitize(post.sale_price);
        if (file == 'No')
            filename = '/images/noimage.png'
        db.query(`INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sanitizedcategory, sanitizedname, sanitizedprice, sanitizedstock, sanitizedbrand, sanitizedsupplier, filename, sanitizedsale_yn, sanitizedsale_price,], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/` });
                res.end();
            })
    },
    delete_process: (req, res) => {
        vu = req.params.vu;
        db.query('DELETE FROM merchandise WHERE mer_id = ?', [vu], (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/merchandise/view/u`)
            res.end();

        });
    },
}
