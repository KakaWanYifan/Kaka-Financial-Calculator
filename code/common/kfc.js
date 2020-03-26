function showMsg(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}

function getDateDiffDays(suf, pre) {
  var sufTime = new Date(suf);
  var preTime = new Date(pre);
  var days = (sufTime.getTime() - preTime.getTime()) / 86400000;
  return parseInt(Math.abs(days));
}

function getDateDiffDaysPM(suf, pre) {
  var sufTime = new Date(suf);
  var preTime = new Date(pre);
  var days = (sufTime.getTime() - preTime.getTime()) / 86400000;
  return parseInt(days);
}

var requestHandler = {
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
}

//封装，方便调用
function getForex(requestHandler) {
  //chao_in 钞买价
  //chao_out 钞卖价
  //code 货币代码
  //day 日期
  //hui_in 汇买价
  //hui_out 汇卖价
  //name 货币名称
  //time 时间
  //zhesuan 中行折算价

  wx.request({
    url: 'https://ali-waihui.showapi.com/waihui-list',
    data: requestHandler.params,
    header: {
      'Authorization': 'APPCODE 312be8803bfd4e4b934b60a780f825a9'
    },
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function (res) {
      requestHandler.fail(res)
    }
  })
}

module.exports = {
  showMsg: showMsg,
  getDateDiffDays: getDateDiffDays,
  getForex: getForex,
  getDateDiffDaysPM: getDateDiffDaysPM
}