let mysql = require('mysql2/promise');

module.exports = (function() {
	var pool = mysql.createPool({
		host: "localhost", //主机 默认为localhost
		user: "root",
		password: "1.048596",
		database: "onlinePay" //数据库名
	});
	pool.on('connection', function(connection) {
		connection.query('SET SESSION auto_increment_increment=1');
	});
	return pool;
})();
