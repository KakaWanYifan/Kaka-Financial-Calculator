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
  calculate: function (ent) {
    var a = ent.detail.value.a;
    var b = ent.detail.value.b;
    var c = ent.detail.value.c;
    var d = ent.detail.value.d;
    var e = ent.detail.value.e;
    var exchangeRate = ent.detail.value.exchangeRate;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率');
    }
    if (a == '') {
      return util.showMsg('', '请输入MOPS价格');
    }
    if (b == '') {
      return util.showMsg('', '请输入升贴水');
    }
    if (c == '') {
      return util.showMsg('', '请输入关税税率');
    }
    if (d == '') {
      return util.showMsg('', '请输入增值税率');
    }
    if (e == '') {
      return util.showMsg('', '请输入其他费用');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    c = parseFloat(c);
    d = parseFloat(d);
    e = parseFloat(e);
    exchangeRate = parseFloat(exchangeRate);
    var res = (a + b) * exchangeRate * (1 + c * 0.01) * (1 + d * 0.01) + e;
    res = res.toFixed(2);
    util.showMsg('结果', '成本：' + res + '元/吨');
  }
})