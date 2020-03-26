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
  calculate: function (enter)
  {
    var a = enter.detail.value.a;
    var b = enter.detail.value.b;
    var c = enter.detail.value.c;
    var exchangeRate = enter.detail.value.exchangeRate;
    var e = enter.detail.value.e;
    var f = enter.detail.value.f;
    var g = enter.detail.value.g;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率');
    }
    if(a == ''){
      return util.showMsg('', '请输入LME三月铜铝价');
    }
    if (b == '') {
      return util.showMsg('', '请输入现货/三个月升贴水');
    }
    if (c == '') {
      return util.showMsg('', '请输入升贴水');
    }
    if (e == '') {
      return util.showMsg('', '请输入关税税率');
    }
    if (f == '') {
      return util.showMsg('', '请输入增值税率');
    }
    if (g == '') {
      return util.showMsg('', '请输入其他费用');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    c = parseFloat(c);
    exchangeRate = parseFloat(exchangeRate);
    e = parseFloat(e);
    f = parseFloat(f);
    g = parseFloat(g);
    var res = (a - b + c) * exchangeRate * (1 + e * 0.01) * (1 + f * 0.01) + g;
    res = res.toFixed(2);
    util.showMsg('结果','成本：' + res + '元/吨');
  }
})