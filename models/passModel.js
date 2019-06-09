const pool = require('./conn_pool');
const utils = require('./utils');

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
                let uid = req.session.token.uid;
                let sql = "update user set password = ? where id = ?";
                let param = [firstPasswd, uid];
                let ret = await conn.query(sql, param);
                //console.log(req.session.token);
                let status = 1;
                callback(undefined, status);
            }
            conn.release();
        }catch(err){
            callback(err, undefined)
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