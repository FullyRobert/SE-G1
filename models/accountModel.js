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
<<<<<<< HEAD
=======
	},
	
	regis: async function(req, callback) {
		try{
			const conn = await pool.getConnection();  
				let username = req.body.username;
				let password = req.body.password;
				let realName = req.body.realName;
				let licenseNumber = req.body.licenseNumber;
				let dateOfBirth = req.body.dateOfBirth;
				let phoneNumber = req.body.phoneNumber;
				let emailAddr = req.body.emailAddr;
				let typeOfUser = req.body.typeOfUser;
				let payPassword = req.body.payPassword;
				let balance = 0;
				
				if (username===null || password===null || realName===null|| licenseNumber===null|| dateOfBirth===null|| phoneNumber===null || emailAddr===null || payPassword===null)
				{
					callback(undefined,-1);
				}
				else
				{
					let sqlinsert = "insert into user (username, password, realName, licenseNumber, dateOfBirth, phoneNumber, emailAddr, typeOfUser, payPassword, balance) values('" + username + "', '" + password + "', '" + realName + "', '" +licenseNumber + "', '" + dateOfBirth + "', '" + phoneNumber + "', '" + emailAddr + "', '" + typeOfUser + "', '" + payPassword+ "', '" + balance+"') ";
					ret = await conn.query(sqlinsert);
					callback(undefined,ret[0].id);
				}
			conn.release();
		} catch (err) {
			callback(err, undefined);
		}
	},
	
}

module.exports = exports;
>>>>>>> 33c424830f5775a3ca3dc3a438f06ccc99aa6ba7
