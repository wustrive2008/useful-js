//身份证校验工具
var idCardNoUtil = {
  /* 省,直辖市代码表 */
  provinceAndCitys : {
    11 : "北京",
    12 : "天津",
    13 : "河北",
    14 : "山西",
    15 : "内蒙古",
    21 : "辽宁",
    22 : "吉林",
    23 : "黑龙江",
    31 : "上海",
    32 : "江苏",
    33 : "浙江",
    34 : "安徽",
    35 : "福建",
    36 : "江西",
    37 : "山东",
    41 : "河南",
    42 : "湖北",
    43 : "湖南",
    44 : "广东",
    45 : "广西",
    46 : "海南",
    50 : "重庆",
    51 : "四川",
    52 : "贵州",
    53 : "云南",
    54 : "西藏",
    61 : "陕西",
    62 : "甘肃",
    63 : "青海",
    64 : "宁夏",
    65 : "新疆",
    71 : "台湾",
    81 : "香港",
    82 : "澳门",
    91 : "国外"
  },
  /* 校验地址码 */
  checkAddressCode : function(addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check)
      return false;
    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true;
    } else {
      return false;
    }
  },

  /* 校验日期码 */
  checkBirthDayCode : function(birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/
        .test(birDayCode);
    if (!check)
      return false;
    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
    var mm = parseInt(birDayCode.substring(4, 6), 10);
    var dd = parseInt(birDayCode.substring(6), 10);
    var xdata = new Date(yyyy, mm - 1, dd);
    if (xdata > new Date()) {
      return false;// 生日不能大于当前日期
    } else if ((xdata.getFullYear() == yyyy)
        && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
      return true;
    } else {
      return false;
    }
  },
  /* 每位加权因子 */
  powers : [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9",
      "10", "5", "8", "4", "2" ],

  /* 第18位校检码 */
  parityBit : [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ],

  /* 计算校检码 */
  getParityBit : function(idCardNo) {
    var id17 = idCardNo.substring(0, 17);
    /* 加权 */
    var power = 0;
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10)
          * parseInt(idCardNoUtil.powers[i]);
    }
    /* 取模 */
    var mod = power % 11;
    return idCardNoUtil.parityBit[mod];
  },

  /* 验证校检码 */
  checkParityBit : function(idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase();
    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
      return true;
    } else {
      return false;
    }
  },

  /* 校验15位或18位的身份证号码 */
  checkIdCardNo : function(idCardNo) {
    // 15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check)
      return false;
    // 判断长度为15位或18位
    if (idCardNo.length == 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo);
    } else {
      return false;
    }
  },

  // 校验15位的身份证号码
  check15IdCardNo : function(idCardNo) {
    // 15位身份证号码的基本校验
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/
        .test(idCardNo);
    if (!check)
      return false;
    // 校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check)
      return false;
    var birDayCode = '19' + idCardNo.substring(6, 12);
    // 校验日期码
    return idCardNoUtil.checkBirthDayCode(birDayCode);
  },

  // 校验18位的身份证号码
  check18IdCardNo : function(idCardNo) {
    // 18位身份证号码的基本格式校验
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
        .test(idCardNo);
    if (!check)
      return false;
    // 校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check)
      return false;
    // 校验日期码
    var birDayCode = idCardNo.substring(6, 14);
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check)
      return false;
    // 验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },
}

/**
* 根据身份证号计算出生日期,性别,年龄信息
* UUserCard :身份证号
* type: 类别  1：出生日期   2：性别  3：年龄信息
*/
function IdCard(UUserCard,type){
       if(type==1){
            //获取出生日期
            birth=UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
            return birth;
       }
       if(type==2){
           if(UUserCard == null || UUserCard == ''){
               return "未知";
           }
           //获取性别
           if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
               //男
            return "男";
           } else {
               //女
            return "女";
           }
       }
    if(type==3){
        if(UUserCard == null || UUserCard == ''){
            return 0;
        }
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}


  



