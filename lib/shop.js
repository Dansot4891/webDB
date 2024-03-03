//201931541 임명우
const board = require('./board');
var db = require('./db');
const sanitize = require('sanitize-html');

function authIsOwner(req, res) {
    if (req.session.is_logined) {
        return true;
    }
    else {
        return false
    }
}

function authStatusUI(req, res) {
    var login = '<li><a class="dropdown-item" href="/auth/login">로그인</a></li>';
    if (authIsOwner(req, res)) { login = `<li><a class="dropdown-item" href="/auth/logout_process" onclick='if(confirm("로그아웃 하시겠습니까?")==false){ return false }'>로그아웃</a></li>` }
    return login;
}

module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
                var isOwner = authIsOwner(req, res);
                if (req.session.class === '01') {
                    if (merchandises == '') {
                        tag = "자료 없음"
                    } else {
                        var i = 0;
                        var tag = ''
                        while (i < merchandises.length) {
                            tag = tag + '<table class="table table-bordered ">'
                            tag = tag + `<tr border:5px><td width="400"><img src="${merchandises[i].image}" style="width:100px;height:100px; "></td><td width="400">${merchandises[i].name}</td>
                    <td width="400">가격 : ${merchandises[i].price}</td><td width="400">브랜드 : ${merchandises[i].brand}</td>`
                            tag = tag + '</table>';
                            i += 1
                        }
                    }
                } else {
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
                }


                if (isOwner) {
                    if (req.session.class === '00') {
                        var context = {
                            menu: 'menuForMIS.ejs',
                            // body: 'customerAnal.ejs',
                            // menu: 'menuForCustomer.ejs',
                            body: 'merchandise.ejs',
                            class: req.session.class,
                            who: req.session.name,
                            logined: 'YES',
                            tag: tag,
                            boardtypes: boardtypes
                        };
                    }

                    else if (req.session.class === '01') {
                        var context = {
                            menu: 'menuForManager.ejs',
                            class: req.session.class,
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            tag: tag,
                            boardtypes: boardtypes
                        };
                    }
                    else if (req.session.class === '02') {
                        var context = {
                            class: req.session.class,
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            tag: tag,
                            boardtypes: boardtypes
                        };
                    }
                } else {
                    var context = {
                        class: req.session.class,
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
                        logined: 'NO',
                        tag: tag,
                        boardtypes: boardtypes

                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    view: (req, res) => {
        subid = req.params.subid;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise WHERE category=?', [subid], (error, merchandises) => {
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

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes,
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes,
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes,
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
                        logined: 'NO',
                        tag: tag,
                        boardtypes: boardtypes,

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
            db.query('SELECT * FROM merchandise', (error, merchandises) => {
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

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
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
    search: (req, res) => {
        var post = req.body;
        sql2 = `select * from merchandise where name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(sql2, (error, merchandises) => {
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
                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        id: merid,
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        tag: tag
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
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
    detail: (req, res) => {
        var merid = req.params.merid;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM merchandise WHERE mer_id=?', [merid], (error, merchandise) => {

                if (req.session.class === '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'detail.ejs',
                        logined: 'YES',
                        state: req.session.class,
                        merchandise: merchandise,
                        boardtypes: boardtypes,
                    };
                }

                else if (req.session.class === '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'detail.ejs',
                        logined: 'YES',
                        state: req.session.class,
                        merchandise: merchandise,
                        boardtypes: boardtypes
                    };
                }
                else if (req.session.class === '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'detail.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        state: req.session.class,
                        merchandise: merchandise,
                    };
                }

                else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'detail.ejs',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        state: '99',
                        merchandise: merchandise,
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    customeranal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate 
        from person group by address;`
                db.query(sql1 + sql2, (error, results) => {
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs',
                        body: 'customerAnal.ejs',
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        } else {
            var sql1 = `select * from boardtype;`;
            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForCustomer.ejs',
                    body: 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/
                    merchandise: results[1],
                    vu: 'v'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            });
        }
    },
    merchananal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select category,ROUND(( count(*) / ( select count(*) from merchandise )) * 100, 2) as rate 
        from merchandise group by category;`
                db.query(sql1 + sql2, (error, results) => {
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs',
                        body: 'merchandiseAnal.ejs',
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        } else {
            var sql1 = `select * from boardtype;`;
            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForCustomer.ejs',
                    body: 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/
                    merchandise: results[1],
                    vu: 'v'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            });
        }
    },
    boardanal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select type_id,ROUND(( count(*) / ( select count(*) from board )) * 100, 2) as rate 
        from board group by type_id;`
                db.query(sql1 + sql2, (error, results) => {
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs',
                        body: 'boardAnal.ejs',
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        } else {
            var sql1 = `select * from boardtype;`;
            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForCustomer.ejs',
                    body: 'merchandise.ejs',
                    /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    /*********** mechandise.ejs에 필요한 변수 ***********/
                    merchandise: results[1],
                    vu: 'v'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            });
        }
    },
}
