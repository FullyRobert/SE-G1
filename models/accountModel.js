const pool = require("./conn_pool");
const utils = require("./utils");

isCardNo = function (obj) {
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
  if (reg.test(obj) === false) {
    return false;
  }
  return true;
};
//取身份证前两位,校验省份
checkProvince = function (obj) {
  var province = obj.substr(0, 2);
  if (vcity[province] == undefined) {
    return false;
  }
  return true;
};
//检查生日是否正确
checkBirthday = function (obj) {
  var len = obj.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == "15") {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    var arr_data = obj.match(re_fifteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date("19" + year + "/" + month + "/" + day);
    return verifyBirthday("19" + year, month, day, birthday);
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == "18") {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    var arr_data = obj.match(re_eighteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date(year + "/" + month + "/" + day);
    return verifyBirthday(year, month, day, birthday);
  }
  return false;
};
//校验日期
verifyBirthday = function (year, month, day, birthday) {
  var now = new Date();
  var now_year = now.getFullYear();
  //年月日是否合理
  if (
    birthday.getFullYear() == year &&
    birthday.getMonth() + 1 == month &&
    birthday.getDate() == day
  ) {
    //判断年份的范围（3岁到100岁之间)
    var time = now_year - year;
    if (time >= 0 && time <= 130) {
      return true;
    }
    return false;
  }
  return false;
};
//校验位的检测
checkParity = function (obj) {
  //15位转18位
  obj = changeFivteenToEighteen(obj);
  var len = obj.length;
  if (len == "18") {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array(
      "1",
      "0",
      "X",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2"
    );
    var cardTemp = 0,
      i,
      valnum;
    for (i = 0; i < 17; i++) {
      cardTemp += obj.substr(i, 1) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (valnum == obj.substr(17, 1)) {
      return true;
    }
    return false;
  }
  return false;
};
//15位转18位身份证号
changeFivteenToEighteen = function (obj) {
  if (obj.length == "15") {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array(
      "1",
      "0",
      "X",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2"
    );
    var cardTemp = 0,
      i;
    obj = obj.substr(0, 6) + "19" + obj.substr(6, obj.length - 6);
    for (i = 0; i < 17; i++) {
      cardTemp += obj.substr(i, 1) * arrInt[i];
    }
    obj += arrCh[cardTemp % 11];
    return obj;
  }
  return obj;
};

var vcity = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
};

module.exports = {
  /*
   * @功能: 用户登录操作验证
   * @返回值: 若验证通过返回该用户数据,否则返回空
   * @作者: 赵威凯
   */
  check_login: async function (req, callback) {
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

  regis: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let username = req.body.username;
      let password = req.body.password;
      let realName = req.body.realName;
      let licenseNumber = req.body.licenseNumber;
      let dateOfBirth = req.body.dateOfBirth;
      let phoneNumber = req.body.phoneNumber;
      let emailAddr = req.body.emailAddr;
      let typeOfUser;
      let payPassword = req.body.paypassword;
      let balance = 0;

      if (req.body.typeOfUser === "Buy") typeOfUser = 1;
      else if (req.body.typeOfUser === "Sell") typeOfUser = 2;
      else typeOfUser = 3;

      if (
        username == null ||
        password === undefined ||
        realName === undefined ||
        licenseNumber === undefined ||
        dateOfBirth === undefined ||
        phoneNumber === undefined ||
        emailAddr === undefined ||
        payPassword === undefined
      ) {
        callback(undefined, -1);
      } else {
        let sqlinsert =
          "insert into user (username, password, realName, licenseNumber, dateOfBirth, phoneNumber, emailAddr, typeOfUser, payPassword, balance) values('" +
          username +
          "', '" +
          password +
          "', '" +
          realName +
          "', '" +
          licenseNumber +
          "', '" +
          dateOfBirth +
          "', '" +
          phoneNumber +
          "', '" +
          emailAddr +
          "', '" +
          typeOfUser +
          "', '" +
          payPassword +
          "', '" +
          balance +
          "') ";
        let ret = await conn.query(sqlinsert);
        callback(undefined, ret[0].id);
      }
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  getinfo: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let id = req.session.token.uid;
      console.log(id);
      let sql = "select * from user where id = '" + id + "'";
      ret = await conn.query(sql);
      callback(undefined, ret[0]);
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  updateinfo: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let realName = req.body.realName;
      let licenseNumber = req.body.licenseNumber;
      let dateOfBirth = req.body.dateOfBirth;
      let phoneNumber = req.body.phoneNumber;
      let emailAddr = req.body.emailAddr;

      if (
        realName === undefined ||
        licenseNumber === undefined ||
        dateOfBirth === undefined ||
        phoneNumber === undefined ||
        emailAddr === undefined
      ) {
        callback(undefined, -1);
        return;
      } else {
        let sqlupdate =
          "update user set realName = '" +
          realName +
          "',licenseNumber = '" +
          licenseNumber +
          "',dateOfBirth = '" +
          dateOfBirth +
          "',phoneNumber = '" +
          phoneNumber +
          "',emailAddr = '" +
          emailAddr +
          "' where id = " +
          req.session.token.uid;
        ret = await conn.query(sqlupdate);
        callback(undefined, ret[0].id);
      }
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },
  checkCard: function (obj) {
    //var card = document.getElementById('card_no').value;
    //是否为空
    // if(card === '')
    // {
    //  return false;
    //}
    //校验长度，类型
    if (isCardNo(obj) === false) {
      return false;
    }
    //检查省份
    if (checkProvince(obj) === false) {
      return false;
    }
    //校验生日
    if (checkBirthday(obj) === false) {
      return false;
    }
    //检验位的检测
    if (checkParity(obj) === false) {
      return false;
    }
    return true;
  },
  //检查号码是否符合规范，包括长度，类型
  changePasswd: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let firstPasswd = req.body.firstPasswd;
      let secondPasswd = req.body.secondPasswd;
      if (firstPasswd != secondPasswd) {
        console.log("firstPasswd is not equal to secondPasswd");
        let status = 2;
        callback(undefined, status);
      } else {
        if (!req.session.token) {
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
    } catch (err) {
      callback(err, undefined)
    }
  },

  valiAuthencode: async function (req, callback) {
    try {
      let username = req.body.username;
      let emailAddress = req.body.emailAddress;
      let authenCode = req.body.authenCode;
      if (username == "" || emailAddress == "") {
        let status = 2;
        callback(undefined, status);
      } else if (authenCode != "123456") {
        let status = 3;
        callback(undefined, status);
      } else {
        tempUsername = username;
        let status = 1;
        callback(undefined, status);
      }
    } catch (err) {
      callback(err, undefined);
    }
  },

  queryOrder: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let sql = "select * from deal_record";
      let ret = await conn.query(sql);
      //console.log(ret[0]);

      callback(undefined, ret[0]);
      conn.release();
    } catch (err) {
      callback(err, undefined)
    }
  },

  selectOrder: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let {
        start_time_date,
        end_time_date,
        start_time_year,
        end_time_year,
        sort_method,
        sort_type
      } = req.body;

        let start_time = '\'' + start_time_year + "-" + start_time_date.substring(0,2) + "-" + start_time_date.substr(2,4) + '\'';
        let end_time = '\'' + end_time_year + "-" + end_time_date.substring(0,2) + "-" + end_time_date.substr(2,4) + '\'';

        let sql = "select * from deal_record where created_time between" + " " + start_time + " " + "and" + ' ' + end_time;

        switch (sort_method) {
          case '0': sql += " order by order_id"; break;
          case '1': sql += " order by created_time"; break;
          case '2': sql += " order by amount"; break;
        }
          switch (sort_type) {
          case '0': break;
          case '1': sql += " desc"; break;
        }
        let ret = await conn.query(sql);

        callback(undefined, ret[0]);
        conn.release(); 
    }catch(err){
        callback(err, undefined);
    }
  },
  /*
 * @功能: 查询余额
 * @作者: 刘长硕
 */
  balance: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let id = req.session.token.uid;
      let balance = "select balance,username from user where id = '" + id + "'";
      ret = await conn.query(balance);
      callback(undefined, ret[0]);
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  updatebalance: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let sid = req.session.token.uid;
      let balance = req.body.balance;
      let charge = req.body.charge;
      let username = req.body.username;
      let newbalance = parseInt(balance) + parseInt(charge);
      newbalance = parseInt(newbalance);
      ret = 0;
      let a = "update user set balance = " + newbalance + " where id ='" + sid + "'";
      ret = await conn.query(a);
      callback(undefined, ret[0]);

      conn.release();
      callback(undefined, ret[0]);
    } catch (err) {
      callback(err, undefined);
    }
  }
};