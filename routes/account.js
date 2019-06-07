let express = require('express');
let router = express.Router();
let amodel = require('../models/accountmentModel.js');
let utils = require('../models/utils.js');
let app = express();


router.get('/', function(req, res, next) {
	res.render('login');
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

