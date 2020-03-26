var util = require("../../../common/kfc.js");
Page({
  onLoad: function (options) {
    var that = this;
    var params = new Object();
    params.code = "USD";
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = (parseFloat(keySet['hui_in']) + parseFloat(keySet['hui_out'])) / 200;
          rate = rate.toFixed(4);
          var utime = '更新时间：' + keySet['day'] + ' ' + keySet['time'];
          that.setData({
            exchangeRate: rate,
            updatetime: utime,
            forex: 'view_show'
          });
        }
        else {
          that.setData({
            forex: 'view_hide',
            exchangeRate: ''
          });
        }
      },
      fail: function (result) {
        that.setData({
          forex: 'view_hide',
          exchangeRate: ''
        });
      },
    });
  },
  reset: function (e) {
    var that = this;
    var params = new Object();
    params.code = "USD";
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = (parseFloat(keySet['hui_in']) + parseFloat(keySet['hui_out'])) / 200;
          rate = rate.toFixed(4);
          var utime = '更新时间：' + keySet['day'] + ' ' + keySet['time'];
          that.setData({
            exchangeRate: rate,
            updatetime: utime,
            forex: 'view_show'
          });
        }
        else {
          that.setData({
            forex: 'view_hide',
            exchangeRate: ''
          });
        }
      },
      fail: function (result) {
        that.setData({
          forex: 'view_hide',
          exchangeRate: ''
        });
      },
    });
  },
  calculate: function (enter) {
    var a = enter.detail.value.a;
    var b = enter.detail.value.b;
    var ca = enter.detail.value.ca;
    var cb = enter.detail.value.cb;
    var exchangeRate = enter.detail.value.exchangeRate;
    var e = enter.detail.value.e;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率');
    }
    if (a == '') {
      return util.showMsg('', '请输入运费');
    }
    if (b == '') {
      return util.showMsg('', '请输入基差');
    }
    if (ca == '') {
      return util.showMsg('', '请输入关税税率');
    }
    if (cb == '') {
      return util.showMsg('', '请输入增值税率');
    }
    if (e == '') {
      return util.showMsg('', '请输入芝加哥盘面价');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    ca = parseFloat(ca)/100;
    cb = parseFloat(cb)/100;
    exchangeRate = parseFloat(exchangeRate);
    e = parseFloat(e);
    var us = (e + b) * 0.3936825;
    var cn = ((e + b) * 0.3936825 + a) * exchangeRate * (1+ca) * (1+cb);
    us = us.toFixed(2);
    cn = cn.toFixed(2);
    util.showMsg('结果', '美国离岸成本：' + us + '美元/吨' + '\r\n' + '中国到岸成本：' + cn + '人民币元/吨');
  }
})