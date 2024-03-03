//201931541 임명우
const sanitize = require('sanitize-html');
var db = require('./db');


module.exports = {
    view: (req, res) => {
        var vu = req.params.vu;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM code_tbl', (error, codes) => {
                if (vu == 'u') {
                    if (codes == '') {
                        tag = "자료 없음"
                    } else {
                        var i = 0;
                        var tag = '<table class="table table-bordered border-primary"><thead><td>대분류</td><td>대분류명</td><td>소분류</td><td>소분류명</td><td>시작일</td><td>종료일</td><td></td><td></td></thead>'
                        while (i < codes.length) {
                            tag = tag + `<tr><td>${codes[i].main_id}</td><td>${codes[i].main_name}</td><td>${codes[i].sub_id}</td>
                        <td>${codes[i].sub_name}</td><td>${codes[i].start}</td><td>${codes[i].end}</td>
                        <td><a href="/code/update/${codes[i].main_id}/${codes[i].sub_id}">수정</a></td>
                        <td><a href="/code/delete/${codes[i].main_id}/${codes[i].sub_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                        </tr>`

                            i += 1
                        } tag = tag + '</table>';
                    }
                } else if (vu == 'v') {
                    var i = 0;
                    var tag = '<table class="table table-bordered border-primary"><thead><td>대분류</td><td>대분류명</td><td>소분류</td><td>소분류명</td><td>시작일</td><td>종료일</td></thead>'
                    while (i < codes.length) {
                        tag = tag + `<tr><td>${codes[i].main_id}</td><td>${codes[i].main_name}</td><td>${codes[i].sub_id}</td>
                    <td>${codes[i].sub_name}</td><td>${codes[i].start}</td><td>${codes[i].end}</td>
                    </tr>`

                        i += 1
                    } tag = tag + '</table>';
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'code.ejs',
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
    create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'codeCU.ejs',
                logined: 'YES',
                state: 'create',
                boardtypes: boardtypes

            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    create_process: (req, res) => {
        var post = req.body;
        sanitizedmainid = sanitize(post.main_id);
        if (sanitizedmainid == '') {
            sanitizedmainid = '0000';
        }
        sanitizedmainname = sanitize(post.main_name);
        sanitizedsubid = sanitize(post.sub_id);
        sanitizedsubname = sanitize(post.sub_name);
        sanitizedstart = sanitize(post.start);
        sanitizedend = sanitize(post.end);

        db.query(`INSERT INTO code_tbl (main_id, main_name, sub_id, sub_name, start, end)VALUES(?, ?, ?, ?, ?, ?)`,
            [sanitizedmainid, sanitizedmainname, sanitizedsubid, sanitizedsubname, sanitizedstart, sanitizedend], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/code/view/v` });
                res.end();
            })
    },
    update: (req, res) => {
        var main = req.params.main;
        var sub = req.params.sub;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM code_tbl WHERE main_id=? and sub_id=?`, [main, sub], (error, code) => {

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'codeCU.ejs',
                    logined: 'YES',
                    state: 'update',
                    code: code[0],
                    boardtypes
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    update_process: (req, res) => {
        var post = req.body;
        sanitizedmainid = sanitize(post.main_id);
        sanitizedmainname = sanitize(post.main_name);
        sanitizedsubid = sanitize(post.sub_id);
        sanitizedsubname = sanitize(post.sub_name);

        db.query(`UPDATE code_tbl SET main_name=?, sub_name=? WHERE main_id=${sanitizedmainid} and sub_id=${sanitizedsubid}`,
            [sanitizedmainname, sanitizedsubname], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/code/view/v` });
                res.end();
            })
    },
    delete_process: (req, res) => {
        var main = req.params.main;
        var sub = req.params.sub;
        db.query(`DELETE FROM code_tbl WHERE main_id=${main} and sub_id=${sub}`, (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/code/view/u`)
            res.end();

        });
    },
}