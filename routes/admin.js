let express = require('express');
let router = express.Router();
let mysql = require('mysql');

// set database
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'account',
    port: '3306'
});

con.connect(err=>{
    if(err){
        console.log('connect err');
    }
});

router.get('/', function(req, res, next) {
    if(!req.session.token){
        res.redirect('../account');
        console.log('not login');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
        console.log('not admin');
    }

    let data = "";
    let user = req.query.user;
    let filter = "";
    if (user) {
        filter = 'WHERE id = ?';
    }
    con.query('SELECT * FROM user ' + filter, user, function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;
        res.render('account/admin', {data: data, user: user });
    });
});

router.get('/stat', (req, res)=>{
    if(!req.session.token){
        res.redirect('../account');
        console.log('not login');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
        console.log('not admin');
    }
    con.query('SELECT COUNT(id) AS USERNUM FROM user',' ',(err, row)=>{
        if(err){
            con.log(err);
        }
        res.render('account/stat', {userNum:row[0].USERNUM});
    });

});

router.get('/userReset', (req, res, next)=>{
    if(!req.session.token){
        res.redirect('../account');
        console.log('not login');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
        console.log('not admin');
    }
    let id = req.query.id;
    console.log(id);
    let pwd = '12345678';
    con.query('UPDATE user SET password = ? WHERE id = ?',[pwd, id], (err, rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/account/admin');
        }
    });

});

module.exports = router;