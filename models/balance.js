const pool = require("./conn_pool");
const utils = require("./utils");


module.exports = {
 	/*
 	 * @功能: 查询余额
 	 * @作者: 刘长硕
 	 */
 	balance: async function(req, callback) {
        try {
           const conn = await pool.getConnection();
           let id=req.session.token.uid;
			let balance = "select balance,username from user where id = '"+ id +"'";
			ret = await conn.query(balance);
			callback(undefined,ret[0]);
			conn.release();
        } catch (err) {
            callback(err, undefined);
        }
	},

	updatebalance: async function(req, callback) {
        try {
           const conn = await pool.getConnection();
		   let balance=req.body.balance;
		   let charge=req.body.charge;
		   let username=req.body.username;
		   let newbalance=parseInt(balance)+parseInt(charge);
		   newbalance=parseInt(newbalance);
		   ret =0;
			let a = "update user set balance = " + newbalance + " where username ='"+ username +"'";
			ret = await conn.query(a);
			callback(undefined,ret[0]);

			conn.release();
			callback(undefined,ret[0]);
        } catch (err) {
            callback(err, undefined);
        }
    }
}
