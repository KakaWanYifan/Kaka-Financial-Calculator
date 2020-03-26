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
    var exchangeRate = enter.detail.value.exchangeRate;
    var d = enter.detail.value.d;
    var e = enter.detail.value.e;
    var f = enter.detail.value.f;
    var g = enter.detail.value.g;
    var h = enter.detail.value.h;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率');
    }
    if (a == '') {
      return util.showMsg('', '请输入海上运费 + 保险费');
    }
    if (b == '') {
      return util.showMsg('', '请输入远期报价升水');
    }
    if (d == '') {
      return util.showMsg('', '请输入杂费');
    }
    if (e == '') {
      return util.showMsg('', '请输入运费 + 检验费');
    }
    if (f == '') {
      return util.showMsg('', '请输入关税税率');
    }
    if (g == '') {
      return util.showMsg('', '请输入增值税率');
    }
    if (h == '') {
      return util.showMsg('', '请输入FOB离岸价');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    exchangeRate = parseFloat(exchangeRate);
    d = parseFloat(d);
    e = parseFloat(e);
    f = parseFloat(f);
    g = parseFloat(g);
    h = parseFloat(h);
    var x = (h + a + b) * exchangeRate;
    var y = (h + b + a) * exchangeRate * (1 + f * 0.01) * (1 + g * 0.01);
    var z = (h + b + a) * exchangeRate * (1 + f * 0.01) * (1 + g * 0.01) + e;
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);
    util.showMsg('结果', 'CIF口岸价格：' + x + '元/吨' + '\r\n' + '完税价格：' + y + '元/吨' + '\r\n' + '上海仓单成本：' + z + '元/吨');
  }
})