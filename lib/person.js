//201931541 임명우
const sanitize = require('sanitize-html');
var db = require('./db');
const board = require('./board');


module.exports = {
    view: (req, res) => {
        var vu = req.params.vu;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM person', (error, persons) => {
                if (vu == 'u') {
                    if (persons == '') {
                        tag = '자료없음'
                    } else {
                        var i = 0;
                        var tag = ''
                        while (i < persons.length) {
                            tag = tag + '<table class="table table-bordered ">'
                            tag = tag + `<tr border:5px><td width="400">아이디 : ${persons[i].loginid}</td><td width="450">비밀번호 : ${persons[i].password}</td>
                <td width="350">이름 : ${persons[i].name}</td><td width="400">주소 : ${persons[i].address}</td><td width="700">전화번호 : ${persons[i].tel}</td>
                <td width="350">생일 : ${persons[i].birth}</td><td width="350">클래스 : ${persons[i].class}</td><td width="350">포인트 : ${persons[i].point}</td>
                <td width="100"><a href="/person/update/${persons[i].loginid}">수정</a></td>
                <td width="100"><a href="/person/delete/${persons[i].loginid}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>`
                            tag = tag + '</table>';
                            i += 1
                        }
                    }
                } else if (vu == 'v') {
                    var i = 0;
                    var tag = ''
                    while (i < persons.length) {
                        tag = tag + '<table class="table table-bordered ">'
                        tag = tag + `<tr border:5px><td width="400">아이디 : ${persons[i].loginid}</td><td width="450">비밀번호 : ${persons[i].password}</td>
                <td width="350">이름 : ${persons[i].name}</td><td width="400">주소 : ${persons[i].address}</td><td width="700">전화번호 : ${persons[i].tel}</td>
                <td width="350">생일 : ${persons[i].birth}</td><td width="350">클래스 : ${persons[i].class}</td><td width="350">포인트 : ${persons[i].point}</td>`
                        tag = tag + '</table>';
                        i += 1
                    }
                }
                if (req.session.class == '01') {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'user.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes
                    };
                } else if (req.session.class == '02' || req.session.class == '00') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'user.ejs',
                        logined: 'YES',
                        tag: tag,
                        boardtypes: boardtypes
                    };
                } else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'user.ejs',
                        logined: 'NO',
                        tag: tag,
                        boardtypes: boardtypes
                    }
                }



                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'userCU.ejs',
                logined: 'YES',
                state: 'create',
                boardtypes: boardtypes

            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    signup: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            var context = {
                menu: 'menuForCustomer.ejs',
                who: req.session.name,
                body: 'userCU.ejs',
                logined: 'NO',
                state: 'signup',
                boardtypes: boardtypes

            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    create_process: (req, res) => {
        var post = req.body;
        sanitizedloginid = sanitize(post.loginid);
        sanitizedpassword = sanitize(post.password);
        sanitizedname = sanitize(post.name);
        sanitizedaddress = sanitize(post.address);
        sanitizedtel = sanitize(post.tel);
        sanitizedbirth = sanitize(post.birth);
        sanitizedclass = sanitize(post.class);
        sanitizedpoint = sanitize(post.point);
        if (sanitizedpoint == '') {
            sanitizedpoint = 0;
        }
        if (sanitizedclass == '') {
            sanitizedclass = "02";
        }
        db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, class, point)VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [sanitizedloginid, sanitizedpassword, sanitizedname, sanitizedaddress, sanitizedtel, sanitizedbirth, sanitizedclass, sanitizedpoint], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/` });
                res.end();
            })
    },
    update: (req, res) => {
        var id = req.params.id;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM person WHERE loginid='${id}'`, (error, person) => {

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'userCU.ejs',
                    logined: 'YES',
                    state: 'update',
                    person: person[0],
                    boardtypes: boardtypes
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    update_process: (req, res) => {
        var post = req.body;
        sanitizedloginid = sanitize(post.loginid);
        sanitizedpassword = sanitize(post.password);
        sanitizedname = sanitize(post.name);
        sanitizedaddress = sanitize(post.address);
        sanitizedtel = sanitize(post.tel);
        sanitizedbirth = sanitize(post.birth);
        sanitizedclass = sanitize(post.class);
        sanitizedpoint = sanitize(post.point);

        db.query(`UPDATE person SET password=?, name=?, address=?, tel=?, birth=?, class=?, point=? WHERE loginid=?`,
            [sanitizedpassword, sanitizedname, sanitizedaddress, sanitizedtel, sanitizedbirth, sanitizedclass, sanitizedpoint, sanitizedloginid], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/person/view/u` });
                res.end();
            })
    },
    delete_process: (req, res) => {
        var id = req.params.id;
        db.query(`DELETE FROM person WHERE loginid='${id}'`, (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/person/view/u`)
            res.end();

        });
    },
}