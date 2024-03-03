//201931541 임명우
const board = require('./board');
var db = require('./db');
const sanitize = require('sanitize-html');
const date = require('./template');

module.exports = {
    //-------------------------------------purchase-----------------------------------------------------
    view: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM purchase INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id WHERE loginid=?', [req.session.loginid], (error, purchases) => {
                if (purchases == '') {
                    tag = "자료 없음"
                } else {
                    var i = 0;
                    var tag = '<table style="text-align: center;" class="table table-bordered"><thead><td>상품</td><td>상품명</td><td>단가</td><td>구매량</td><td>총금액</td><td>구매일</td><td>취소여부</td></thead>'
                    while (i < purchases.length) {
                        tag = tag + `<tr border:5px><td><img src="${purchases[i].image}" style="width:100px;height:100px;"></td><td>${purchases[i].name}</td><td>${purchases[i].price}</td>
                        <td>${purchases[i].qty}</td><td>${purchases[i].total}</td><td>${purchases[i].date}</td>`
                        if (purchases[i].cancel == "Y") {
                            tag = tag + `<td><p>취소된 상품</p></td></tr>`
                        } else {
                            tag = tag + `<td><a href="/purchase/cancel/${purchases[i].purchase_id}" onclick='if(confirm("정말로 취소하시겠습니까?")==false){ return false }'>구매취소</a></td>
                        </tr>`
                        }
                        i += 1
                    } tag = tag + '</table>';
                }

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'purchase.ejs',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    allview: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM purchase INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id', (error, purchases) => {
                if (purchases == '') {
                    tag = "자료 없음"
                } else {
                    var i = 0;
                    var tag = '<table style="text-align: center;" class="table table-bordered"><thead><td>구매자</td><td>상품</td><td>상품명</td><td>단가</td><td>구매량</td><td>총금액</td><td>구매일</td><td rowspan="2">취소여부</td><td>수정 및 삭제</td></thead>'
                    while (i < purchases.length) {
                        tag = tag + `<tr border:5px><td>${purchases[i].loginid}</td><td><img src="${purchases[i].image}" style="width:100px;height:100px;"></td><td>${purchases[i].name}</td><td>${purchases[i].price}</td>
                        <td>${purchases[i].qty}</td><td>${purchases[i].total}</td><td>${purchases[i].date}</td>`
                        tag = tag + `<td><p>${purchases[i].cancel}</p></td>`;
                        tag = tag + `<td><a href="/purchase/update/${purchases[i].purchase_id}">수정</a>&nbsp
                        <a href="/purchase/delete_process/${purchases[i].purchase_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></tr></td>`
                        i += 1
                    } tag = tag + '</table>';
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
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
    detail: (req, res) => {
        var merid = req.params.merid;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise WHERE mer_id=?', [merid], (error, merchandise) => {

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        merchandise: merchandise,
                        body: 'purchaseCU.ejs',
                        logined: 'YES',
                        id: merid,
                        state: 'detail',
                        boardtypes: boardtypes,
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        merchandise: merchandise,
                        body: 'purchaseCU.ejs',
                        logined: 'YES',
                        state: 'detail',
                        boardtypes: boardtypes
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'purchaseCU.ejs',
                        logined: 'YES',
                        state: 'detail',
                        merchandise: merchandise,
                        boardtypes: boardtypes,
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'purchaseCU.ejs',
                        logined: 'NO',
                        state: 'detail',
                        merchandise: merchandise,
                        boardtypes: boardtypes,
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchaseCU.ejs',
                    logined: 'YES',
                    state: 'create',
                    merchandises: merchandises,
                    boardtypes: boardtypes,
                    type: req.session.class
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    create_process: (req, res) => {
        if (req.session.class === '01') {
            var post = req.body;
            sanitizedmerid = sanitize(post.mer_id);

            db.query('SELECT * FROM merchandise WHERE mer_id=?', [sanitizedmerid], (error, merchandise) => {
                loginid = req.session.loginid;
                sanitizedpayYN = sanitize(post.payYN);
                sanitizedcancel = sanitize(post.cancel);
                sanitizedqty = sanitize(post.qty);
                sanitizedrefund = sanitize(post.refund);
                sanitizedchecked = sanitize(post.checked);
                sanitizedprice = sanitize(post.price);
                point = sanitizedprice * 0.005;
                if (req.session.class === '01') {
                    sanitizedprice = merchandise[0].price;
                    point = sanitize(post.point);
                }
                total = sanitizedqty * sanitizedprice;

                db.query(`INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES(?, ?, '${date.dateOfEightDigit()}', ?, ?, ?, ?, ?, ?, ?)`,
                    [loginid, sanitizedmerid, sanitizedprice, point, sanitizedqty, total, sanitizedpayYN, sanitizedcancel, sanitizedrefund], (error, result) => {
                        if (error) {
                            throw error;
                        }
                        res.writeHead(302, { Location: `/purchase/allview` });
                        res.end();
                    })
            })
        } else {
            var post = req.body;
            if (post.state == 'cart') {

                loginid = req.session.loginid;
                const indexesWithValues = post.qty.reduce((acc, currentValue, currentIndex) => {
                    if (currentValue !== '') {
                        acc.push(currentIndex);
                    }
                    return acc;
                }, []);
                indexesWithValues.forEach(index => {
                    db.query(`INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES(?, ?, '${date.dateOfEightDigit()}', ?, ?, ?, ?, ?, ?, ?)`,
                        [loginid, post.mer_id[index], post.price[index], post.price[index] * 0.05, post.qty[index], post.price[index] * post.qty[index], post.payYN[index], post.cancel[index], post.refund[index]], (error, result) => {
                            if (error) {
                                throw error;
                            }
                        })
                    db.query('DELETE FROM cart WHERE cart_id = ?', [post.cart_id[index]], (error, result) => {
                        if (error) {
                            throw error;
                        }
                    });

                });
                res.writeHead(302, { Location: `/purchase/view` });
                res.end();
            } else {
                var post = req.body;
                sanitizedmerid = sanitize(post.mer_id);

                db.query('SELECT * FROM merchandise WHERE mer_id=?', [sanitizedmerid], (error, merchandise) => {
                    loginid = req.session.loginid;
                    sanitizedpayYN = sanitize(post.payYN);
                    sanitizedcancel = sanitize(post.cancel);
                    sanitizedqty = sanitize(post.qty);
                    sanitizedrefund = sanitize(post.refund);
                    sanitizedprice = sanitize(post.price);
                    point = sanitizedprice * 0.005;
                    total = sanitizedqty * sanitizedprice;

                    db.query(`INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES(?, ?, '${date.dateOfEightDigit()}', ?, ?, ?, ?, ?, ?, ?)`,
                        [loginid, sanitizedmerid, sanitizedprice, point, sanitizedqty, total, sanitizedpayYN, sanitizedcancel, sanitizedrefund], (error, result) => {
                            if (error) {
                                throw error;
                            }
                            res.writeHead(302, { Location: `/purchase/view` });
                            res.end();
                        })
                })
            }
        }
    },

    update: (req, res) => {
        var id = req.params.id;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM purchase INNER JOIN merchandise ON purchase.mer_id = merchandise.mer_id WHERE purchase_id=?`, [id], (error, purchase) => {
                db.query('SELECT * FROM merchandise', (error, merchandises) => {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'purchaseCU.ejs',
                        logined: 'YES',
                        purchase: purchase,
                        boardtypes: boardtypes,
                        merchandises: merchandises,
                        loginid: req.session.loginid,
                        state: 'update'
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })
    },
    update_process: (req, res) => {
        id = req.params.id;
        var post = req.body;
        sanitizedmerid = sanitize(post.mer_id);
        sanitizedpayYN = sanitize(post.payYN);
        sanitizedcancel = sanitize(post.cancel);
        saniatizedpoint = sanitize(post.point);
        sanitizedqty = sanitize(post.qty);
        db.query('SELECT * FROM merchandise WHERE mer_id = ?', [sanitizedmerid], (error, merchandise) => {
            total = merchandise[0].price * sanitizedqty;
            db.query(`UPDATE purchase SET mer_id=?, price=?, point=?, qty=?, total=?, payYN=?, cancel=? WHERE purchase_id=?`,
                [sanitizedmerid, merchandise[0].price, saniatizedpoint, sanitizedqty, total, sanitizedpayYN, sanitizedcancel, id], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    res.writeHead(302, { Location: `/purchase/allview` });
                    res.end();
                })
        })
    },
    cancel: (req, res) => {
        id = req.params.id;
        db.query(`UPDATE purchase SET cancel=? WHERE purchase_id=?`, ['Y', id], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/purchase/view` });
                res.end();
            })

    },
    delete_process: (req, res) => {
        id = req.params.id;
        db.query('DELETE FROM purchase WHERE purchase_id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/purchase/allview`);
            res.end();

        });
    },
    //-------------------------------------------Cart--------------------------------------------------------------
    cart_view: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM cart INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id WHERE loginid=?', [req.session.loginid], (error, carts) => {

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'cart.ejs',
                        logined: 'YES',
                        state: req.session.class,
                        boardtypes: boardtypes,
                        carts: carts,
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'cart.ejs',
                        logined: 'YES',
                        state: req.session.class,
                        boardtypes: boardtypes,
                        carts: carts,
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'cart.ejs',
                        carts: carts,
                        state: req.session.class,
                        logined: 'YES',
                        boardtypes: boardtypes,
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'cart.ejs',
                        carts: carts,
                        state: req.session.class,
                        logined: 'NO',
                        boardtypes: boardtypes,
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    cart_all_view: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM cart INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id', (error, carts) => {

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cart.ejs',
                    logined: 'YES',
                    boardtypes: boardtypes,
                    carts: carts,
                    state: req.session.class
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    cart_create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cartCU.ejs',
                    logined: 'YES',
                    state: 'create',
                    boardtypes: boardtypes,
                    merchandises: merchandises

                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    cart_create_process: (req, res) => {
        var post = req.body;
        sanitizedmerid = sanitize(post.mer_id);
        loginid = req.session.loginid;

        db.query(`INSERT INTO cart (loginid, mer_id, date) VALUES(?, ?, '${date.dateOfEightDigit()}')`,
            [loginid, sanitizedmerid], (error, result) => {
                if (error) {
                    throw error;
                }
                if (req.session.class === '01') {
                    res.writeHead(302, { Location: `/purchase/allcart` });
                } else {
                    res.writeHead(302, { Location: `/purchase/cart` });
                }
                res.end();
            })
    },
    cart_update: (req, res) => {
        var id = req.params.id;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
                db.query('SELECT * FROM cart INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id WHERE cart_id=?', [id], (error, cart) => {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'cartCU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        cart: cart,
                        merchandises: merchandises,
                        state: 'update'
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })
    },
    cart_update_process: (req, res) => {
        id = req.params.id;
        var post = req.body;
        sanitizedmerid = sanitize(post.mer_id);
        db.query(`UPDATE cart SET mer_id=? WHERE cart_id=?`,
            [sanitizedmerid, id], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/purchase/allcart` });
                res.end();
            })
    },
    cart_delete_process: (req, res) => {
        id = req.params.id;
        db.query('DELETE FROM cart WHERE cart_id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/purchase/allcart`);
            res.end();

        });
    },
}

