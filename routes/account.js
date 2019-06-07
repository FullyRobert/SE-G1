let express = require('express');
let router = express.Router();
let amodel = require('../models/accountModel.js');
let utils = require('../models/utils.js');
let app = express();


router.get('/', function(req, res, next) {
	res.render('regis');
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
        //res.send({status:1}).end();
    });
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


module.exports = router;
