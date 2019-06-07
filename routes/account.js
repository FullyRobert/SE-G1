let express = require('express');
let router = express.Router();
let amodel = require('../models/accountModel.js');
let utils = require('../models/utils.js');
let app = express();


router.get('/', function(req, res, next) {
	res.render('regis');
});

router.post('/regis',function(req, res) {
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


module.exports = router;