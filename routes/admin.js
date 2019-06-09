let express = require('express');
let router = express.Router();
let mysql = require('mysql');

// set database
let con = mysql.createConnection({
    host: "localhost", //主机 默认为localhost
    user: "root",
    password: "1.048596",
    database: "onlinePay" //数据库名
});

con.connect(err=>{
    if(err){
        console.log('connect err');
    }
});

router.get('/', function(req, res, next) {
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
        res.render('admin', {data: data, user: user });
    });
});

router.get('/stat', (req, res)=>{
    con.query('SELECT COUNT(id) AS USERNUM FROM user',' ',(err, row)=>{
        if(err){
            con.log(err);
        }
        res.render('stat', {userNum:row[0].USERNUM});
    });

});

router.get('/userReset', (req, res, next)=>{
    let id = req.query.id;
    console.log(id);
    let pwd = '12345678';
    con.query('UPDATE user SET password = ? WHERE id = ?',[pwd, id], (err, rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin');
        }
    });

});

module.exports = router;