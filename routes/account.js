let express = require('express');
let router = express.Router();
var ex = require('../models/exampleModel.js');
var amodel = require('../models/accountModel.js');
var pmodel = require('../models/passModel.js');

router.get('/', function(req, res, next) {
	res.render('login');
});

router.get('/resetpwd', function(req, res){
    res.render('resetpwd');
})

router.get('/resetpwd2',function(req, res){

    console.log("test");
    var token = {
        username:"hqh",
        uid:"1",
    };
    req.session.token = token;

    res.render('resetpwd2');
});

router.post('/resetpwd2',function(req,res){
    pmodel.changePasswd(req, function(err, status){
        if(err){
            console.log(err);
            res.send({status: 3}).end();
        } else {
            if (status == 2) {
                res.send({status: 2}).end();
            } else if (status == 1) {
                res.send({status: 1}).end();
            }
        }
    });
});

router.post('/queryOrder', function(req, res){

    console.log("test");

    pmodel.queryOrder(req, function(err, ret){
        if (err) {
            console.log(err);
            res.send({status: 0}).end();
        } else {
            console.log(ret);
            res.send({status: 1, orders: ret}).end();
        }
    });
});

router.get('/showinfo', function(req, res) {
    //登陆校验
    if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
        res.redirect('login');
        return;
    }
    amodel.getinfo(req, function(err, ret) {
        if (err) {
        	console.log(err);
            res.send({status: -1}).end();   //服务器异常
        } else {
            res.render('account.ejs',{username: ret.username, realname: ret.realname, licenseNumber:ret.licenseNumber,dateOfBirth: ret.dateOfBirth, phoneNumber: ret.phoneNumber, emailAddr:ret.emailAddr});
        }
    });
});

router.post('/login',function(req, res) {
    amodel.check_login(req, function(err, ret) {
        if (err) {
        	console.log(err);
            res.send({status: -1}).end();   //服务器异常
        } else {
            console.log(ret);
            var token = {
                username:null,
                uid:null,
            };

        	if (ret.length > 0) {
                token.username=ret.username;
                token.uid=ret.id;
                req.session.token=token;
        		res.send({status: 1}).end();   //验证成功
            } else {
        		res.send({status: 0}).end();   //验证失败
        	}
        }
    });
});

router.get('/showinfo', function(req, res) {
    //登陆校验
    if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
        res.redirect('/login');
        return;
    }
    amodel.getinfo(req, function(err, ret) {
        if (err) {
        	console.log(err);
            res.send({status: -1}).end();   //服务器异常
        } else {
            res.render('account.ejs',{username: ret.username, realname: ret.realname, licenseNumber: ret.licenseNumber,dateOfBirth: ret.dateOfBirth, phoneNumber: ret.phoneNumber, emailAddr: ret.emailAddr});
        }
    });
});

router.post('/register', function(req, res) {
    amodel.regis(req, function(err, ret) {
        if (err) {
        	console.log(err);
            res.send({status: -1}).end();   //服务器异常
        } else {
            console.log(ret);
            if (ret<0){
                res.send({status: 0}).end(); //缺少信息
            }
            else {
                res.send({status: 1}).end(); //成功
            }
        }
    });
});

router.post('/updateinfo', function(req, res) {
    amodel.updateinfo(req, function(err, ret) {
        if (err) {
        	console.log(err);
            res.send({status: -1}).end();   //服务器异常
        } else {
            console.log(ret);
            if (ret<0){
                res.send({status: 0}).end(); //缺少信息
            }
            else {
                res.send({status: 1}).end(); //成功
            }
        }
    });
});


router.get('/example', (req, res) => {
    console.log("用户名:" + req.query.user);
    console.log("用户是嘤菜鸡吗:" + ex.check(req.query.user));
    if (req.query.user) {
        res.render('example', {username: req.query.user});
    } else {
        res.render('example', {username: "嘤菜鸡"});
    }
});

router.get('/account.ejs', (req, res) => {
    res.render('account',
        {
            realName: "嘤菜鸡",
            lisenceNumber: "233333",
            emailAddr: "CaijiYing@zju.edu.cn",
            phoneNumber: "18888438438",
            dateOfBirth: "1998-04-01"
        });
});

router.get('/index.ejs', (req,res) =>
	{ res.render('index'); });
router.get('/admin.ejs', (req,res) =>
	{ res.render('admin'); });
router.get('/balance.ejs', (req,res) =>
	{ res.render('balance'); });
router.get('/change_passwd.ejs', (req,res) =>
	{ res.render('change_passwd'); });
router.get('/error.ejs', (req,res) =>
	{ res.render('error'); });
router.get('/index.ejs', (req,res) =>
	{ res.render('index'); });
router.get('/refund.ejs', (req,res) =>
	{ res.render('refund'); });
router.get('/login.ejs', (req,res) =>
	{ res.render('login'); });
router.get('/transaction.ejs', (req,res) =>
	{ res.render('transaction'); });
router.get('/register.ejs', (req,res) =>
	{ res.render('register'); });


module.exports = router;
