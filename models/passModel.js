const pool = require('./conn_pool');
const utils = require('./utils');

var tempUsername;

module.exports = {
    /*
 	 * @功能: 用户设置新的密码
 	 * @返回值: status = 1, success, 2, firstPasswd is not equal to secondPasswd, 3, modify failure
 	 * @作者: 黄启涵
 	 */
     changePasswd: async function(req, callback){
        try{
            const conn = await pool.getConnection();
            let firstPasswd = req.body.firstPasswd;
            let secondPasswd = req.body.secondPasswd;
            if(firstPasswd != secondPasswd){
                console.log("firstPasswd is not equal to secondPasswd");
                let status = 2;
                callback(undefined, status);
            } else {
                if(!req.session.token) {
                    username = tempUsername;
                } else {
                    username = req.session.token.username;
                }
                let sql = "update user set password = ? where username = ?";
                let param = [firstPasswd, username];
                let ret = await conn.query(sql, param);
                //console.log(req.session.token);
                let status = 1;
                callback(undefined, status);
            }
            conn.release();
        } catch(err) {
            callback(err, undefined)
        }
     },

     valiAuthencode: async function(req, callback){
        try {
            let username = req.body.username;
            let emailAddress = req.body.emailAddress;
            let authenCode = req.body.authenCode;
            if(username == "" || emailAddress == "") {
                let status = 2;
                callback(undefined, status);
            } else if(authenCode != "123456") {
                let status = 3;
                callback(undefined, status);
            } else {
                tempUsername = username;
                let status = 1;
                callback(undefined, status);
            }
        } catch(err) {
            callback(err, undefined);
        }
     },

     queryOrder: async function(req, callback){
        try{
            const conn = await pool.getConnection();
            let sql = "select * from deal_record";
            let ret = await conn.query(sql);
            //console.log(ret[0]);
    
            callback(undefined, ret[0]);
            conn.release();
        }catch(err){
            callback(err, undefined)
        }
     }
}