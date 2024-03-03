//201931541 임명우
const sanitize = require('sanitize-html');
var db = require('./db');
const date = require('./template');


module.exports = {
    //------------------------boardtype--------------------------------
    tview: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            
            if (boardtypes == '') {
                tag = "자료 없음"
            } else {
                var i = 0;
                var tag = '<table class="table table-bordered border-primary"><thead><td>제목</td><td>페이지당 글 수</td><td>설명</td><td>일반 사용자 쓰기 가능 여부</td><td>댓글 가능 여부</td><td></td><td></td></thead>'
                while (i < boardtypes.length) {
                    tag = tag + `<tr><td>${boardtypes[i].title}</td><td>${boardtypes[i].numPerPage}</td><td>${boardtypes[i].description}</td>
                    <td>${boardtypes[i].write_YN}</td><td>${boardtypes[i].re_YN}</td>
                    <td><a href="/board/type/update/${boardtypes[i].type_id}">수정</a></td>
                    <td><a href="/board/type/delete/${boardtypes[i].type_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                    </tr>`

                    i += 1
                } tag = tag + '</table>';
            }

            var context = {
                btype: 'boardtype',
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'board.ejs',
                logined: 'YES',
                tag: tag,
                boardtypes: boardtypes,
                class: req.session.class
            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    tupdate: (req, res) => {
        var id = req.params.id;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM boardtype WHERE type_id=?`, [id], (error, boardtype) => {

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardtypeCU.ejs',
                    logined: 'YES',
                    state: 'update',
                    boardtype: boardtype[0],
                    boardtypes: boardtypes
                };

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    tupdate_process: (req, res) => {
        var post = req.body;
        sanitizedtypeid = sanitize(post.type_id);
        sanitizedtitle = sanitize(post.title);
        sanitizeddescription = sanitize(post.description);
        sanitizednumPerPage = sanitize(post.numPerPage);
        sanitizedwrite_YN = sanitize(post.write_YN);
        sanitizedre_YN = sanitize(post.re_YN);

        db.query(`UPDATE boardtype SET title=?, description=?, numPerPage=?, write_YN=?, re_YN=? WHERE type_id=?`,
            [sanitizedtitle, sanitizeddescription, sanitizednumPerPage, sanitizedwrite_YN, sanitizedre_YN, sanitizedtypeid], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            })
    },
    tcreate: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {

            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'boardtypeCU.ejs',
                logined: 'YES',
                state: 'create',
                boardtypes: boardtypes
            };

            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    tcreate_process: (req, res) => {
        var post = req.body;
        sanitizedtitle = sanitize(post.title);
        sanitizeddescription = sanitize(post.description);
        sanitizednumPerPage = sanitize(post.numPerPage);
        sanitizedwrite_YN = sanitize(post.write_YN);
        sanitizedre_YN = sanitize(post.re_YN);

        db.query(`INSERT INTO boardtype (title, description, numPerPage, write_YN, re_YN) VALUES(?, ?, ?, ?, ?)`,
            [sanitizedtitle, sanitizeddescription, sanitizednumPerPage, sanitizedwrite_YN, sanitizedre_YN], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            })
    },
    tdelete_process: (req, res) => {
        id = req.params.id;
        db.query('DELETE FROM boardtype WHERE type_id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            db.query('DELETE FROM board WHERE type_id = ?', [id], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/type/view`);
                res.end();
            });
        });
    },
    view: (req, res) => {
        var id = req.params.id;
        var num = req.params.num;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT * FROM board LEFT JOIN person ON board.loginid = person.loginid WHERE board.type_id = ${id}`, (error2, boards) => {
                db.query(`SELECT * FROM boardtype WHERE type_id = ${id}`, (error2, board) => {
                    var numPerPage = board[0].numPerPage;
                    var totalPages = boards.length / numPerPage;

                    if (boards.length % numPerPage > 0) {
                        totalPages = totalPages + 1;
                    }
                    totalPages = Math.floor(totalPages);


                    if (req.session.class == '01' || (req.session.class == '02' && board[0].write_YN == 'Y')) {
                        if (boards == '') {
                            tag = `<br><div style="text-align: right;"><button type="button" onclick="location.href='http://localhost:3000/board/create/${id}'" class="btn btn-info me-md-2">글쓰기</button></div>`;
                        } else {
                            if (num < totalPages) {
                                var i = (num - 1) * numPerPage;
                                var tag = '<table class="table table-bordered border-primary"><thead><td>작성자</td><td>제목</td><td>날짜</td></thead>'

                                while (i < num * board[0].numPerPage) {
                                    tag = tag + `<tr><td>${boards[i].name}</td><td><a href="/board/detail/${boards[i].type_id}/${boards[i].board_id}">${boards[i].title}</a></td><td>${boards[i].date}</td></tr>`
                                    i += 1
                                }

                                tag = tag + '</table>';
                                tag = tag + `<br><div style="text-align: right;"><button type="button" onclick="location.href='http://localhost:3000/board/create/${id}'" class="btn btn-info me-md-2">글쓰기</button></div>`;
                            } else if (num == totalPages) {
                                var i = (num - 1) * numPerPage;
                                var tag = '<table class="table table-bordered border-primary"><thead><td>작성자</td><td>제목</td><td>날짜</td></thead>'
                                if (totalPages == 1) {
                                    i = 0;
                                }
                                while (i < boards.length) {
                                    tag = tag + `<tr><td>${boards[i].name}</td><td><a href="/board/detail/${boards[i].type_id}/${boards[i].board_id}">${boards[i].title}</a></td><td>${boards[i].date}</td></tr>`
                                    i += 1
                                }
                                tag = tag + '</table>';
                                tag = tag + `<br><div style="text-align: right;"><button type="button" onclick="location.href='http://localhost:3000/board/create/${id}'" class="btn btn-info me-md-2">글쓰기</button></div>`;
                            }
                        }
                    } else {
                        if (boards == '') {
                            tag = `게시글 없음`;
                        } else {
                            if (num < totalPages) {
                                var i = (num - 1) * numPerPage;
                                var tag = '<table class="table table-bordered border-primary"><thead><td>작성자</td><td>제목</td><td>날짜</td></thead>'

                                while (i < num * board[0].numPerPage) {
                                    tag = tag + `<tr><td>${boards[i].name}</td><td><a href="/board/detail/${boards[i].type_id}/${boards[i].board_id}">${boards[i].title}</a></td><td>${boards[i].date}</td></tr>`
                                    i += 1
                                }

                                tag = tag + '</table>';
                            } else if (num == totalPages) {
                                var i = (num - 1) * numPerPage;
                                var tag = '<table class="table table-bordered border-primary"><thead><td>작성자</td><td>제목</td><td>날짜</td></thead>'
                                if (totalPages == 1) {
                                    i = 0;
                                }
                                while (i < boards.length) {
                                    tag = tag + `<tr><td>${boards[i].name}</td><td><a href="/board/detail/${boards[i].type_id}/${boards[i].board_id}">${boards[i].title}</a></td><td>${boards[i].date}</td></tr>`
                                    i += 1
                                }
                                tag = tag + '</table>';
                            }
                        }
                    }

                    if (req.session.name == undefined) {
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: '손님',
                            body: 'board.ejs',
                            logined: 'NO',
                            loginid: '',
                            tag: tag,
                            btype: 'board',
                            pNum: num,
                            btname: board[0],
                            totalPages: totalPages,
                            boardtypes: boardtypes
                        };
                    } else if (req.session.class == '02') {
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'board.ejs',
                            logined: 'YES',
                            tag: tag,
                            btype: 'board',
                            pNum: num,
                            btname: board[0],
                            totalPages: totalPages,
                            boardtypes: boardtypes
                        };
                    } else {
                        var context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'board.ejs',
                            logined: 'YES',
                            tag: tag,
                            btype: 'board',
                            pNum: num,
                            btname: board[0],
                            totalPages: totalPages,
                            boardtypes: boardtypes
                        };
                    }

                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                })
            })
        })
    },
    create: (req, res) => {
        var id = req.params.id;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query('SELECT * FROM boardtype WHERE type_id=?', [id], (error, boardtype) => {

                if (req.session.name == undefined) {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'boardCRU.ejs',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        btname: boardtype[0],
                        loginid: '',
                        state: 'create'
                    };
                } else if (req.session.class == '02') {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        btname: boardtype[0],
                        loginid: req.session.loginid,
                        state: 'create'
                    };
                } else {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        btname: boardtype[0],
                        loginid: req.session.loginid,
                        state: 'create'
                    };
                }

                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
        })
    },
    create_process: (req, res) => {
        var post = req.body;
        sanitizedtypeid = sanitize(post.type_id);
        sanitizedloginid = sanitize(post.loginid);
        sanitizedtitle = sanitize(post.title);
        sanitizedcontent = sanitize(post.content);
        sanitizedpassword = sanitize(post.password);

        db.query(`INSERT INTO board (type_id, loginid, title, content, password, date) VALUES(?, ?, ?, ?, ?, '${date.dateOfEightDigit()}')`,
            [sanitizedtypeid, sanitizedloginid, sanitizedtitle, sanitizedcontent, sanitizedpassword], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/view/${post.type_id}/1` });
                res.end();
            })
    },
    update: (req, res) => {
        var id = req.params.id;
        var id2 = req.params.id2;
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            db.query(`SELECT *, board.password AS ps FROM board INNER JOIN person ON board.loginid = person.loginid WHERE type_id=? && board_id=?`, [id, id2], (error, board) => {
                
                if (req.session.name == undefined) {
                    var context = {
                        para: '',
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'boardCRU.ejs',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        btname: board[0],
                        board: board[0],
                        loginid: '',
                        state: 'update'
                    };
                } else if (req.session.class == '00') {
                    var context = {
                        para: req.session.class,
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        btname: board[0],
                        board: board[0],
                        loginid: req.session.loginid,
                        state: 'update'
                    };
                } else if (req.session.class == '02') {
                    var context = {
                        para: req.session.class,
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        btname: board[0],
                        board: board[0],
                        loginid: req.session.loginid,
                        state: 'update'
                    };
                } else {
                    var context = {
                        para: req.session.class,
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtypes: boardtypes,
                        btname: board[0],
                        board: board[0],
                        loginid: req.session.loginid,
                        state: 'update'
                    };
                }
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })

            })
        })
    },
    update_process: (req, res) => {
        var post = req.body;
        sanitizedboardid = sanitize(post.board_id);
        sanitizedtypeid = sanitize(post.type_id);
        sanitizedtitle = sanitize(post.title);
        sanitizedcontent = sanitize(post.content);
        sanitizedpassword = sanitize(post.password);
        
        db.query(`UPDATE board SET title=?, content=?, password=? WHERE type_id=? && board_id=?`,
            [sanitizedtitle, sanitizedcontent, sanitizedpassword, sanitizedtypeid, sanitizedboardid], (error, result) => {
                if (error) {
                    throw error;
                }
                res.writeHead(302, { Location: `/board/view/${sanitizedtypeid}/1` });
                res.end();
            })
    },
    delete_process: (req, res) => {
        id = req.params.id;
        id2 = req.params.id2;

        db.query('DELETE FROM board WHERE board_id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            res.redirect(`/board/view/${id2}/1`);
            res.end();

        });
    },
}
