//201931541 임명우
var db = require('./db');


module.exports = {
    login: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
        var context = {
            menu: 'menuForCustomer.ejs',
            who: '손님',
            body: 'login.ejs',
            logined: '<li><a class="dropdown-item" href="/auth/login">로그인</a></li>',
            boardtypes:boardtypes
        };
        
        req.app.render('home', context, (err, html) => {
            res.end(html);
        })
    })
    },
    login_process: (req, res) => {
        var post = req.body;
        
        db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results) => {
            if (results[0].num === 1) {
                db.query('select name, class, loginid from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result) => {
                    req.session.is_logined = true;
                    req.session.name = result[0].name
                    req.session.loginid = result[0].loginid
                    req.session.class = result[0].class
                    
                    res.redirect('/');
                })
            }
            else {
                req.session.is_logined = false;
                req.session.name = '손님';
                req.session.loginid = '';
                req.session.class = '99';
                res.redirect('/');
            }
            
        })
    },
    logout_process: (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        })
    },
}