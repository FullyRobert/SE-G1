const pool = require('./conn_pool');
const utils = require('./utils');

module.exports = {
	/*
 	 * @功能: 用户登录操作验证
 	 * @返回值: 若验证通过返回该用户数据,否则返回空
 	 * @作者: 赵威凯
 	 */
	check_login: async function(req, callback) {
		try {
			const conn = await pool.getConnection();
			let sql = "select * from user where username = ? and password = ?";
			let param = [req.body.username, req.body.password];
			let ret = await conn.query(sql, param); 
			callback(undefined, ret[0]);
			conn.release();
		} catch (err) {
			callback(err, undefined);
		}
    },
}

module.exports=exports;
