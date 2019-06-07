var express = require('express');
var router = express.Router();
var ex = require('../models/exampleModel.js');

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log("用户名:" + req.query.user);
    console.log("用户是嘤菜鸡吗:" + ex.check(req.query.user));
    /*if (req.query.user) {
        res.render('example', {username: req.query.user});
    } else {
        res.render('example', {username: "嘤菜鸡"});
    }*/
	next();
});


router.get('/index.ejs', (req,res) =>
	{ res.render('index'); });
router.get('/account.ejs', (req,res) =>
	{ res.render('account'); });
router.get('/admin.ejs', (req,res) =>
	{ res.render('admin'); });
router.get('/balance.ejs', (req,res) =>
	{ res.render('balance'); });
router.get('/change_passwd.ejs', (req,res) =>
	{ res.render('change_passwd'); });
router.get('/error.ejs', (req,res) =>
	{ res.render('error'); });
router.get('/example.ejs', (req,res) =>
	{ res.render('example'); });
router.get('/index.ejs', (req,res) =>
	{ res.render('index'); });
router.get('/refund.ejs', (req,res) =>
	{ res.render('refund'); });
router.get('/regis.ejs', (req,res) =>
	{ res.render('regis'); });
router.get('/transaction.ejs', (req,res) =>
	{ res.render('transaction'); });

/*使用回调函数异步执行*/
router.get('/login', (req, res) => {
    ex.login(req,(err,ret)=>{
    	if (err) {
    		console.log(err);
    	} else {
    		console.log(ret);
    	}
    });
});

module.exports = router;
