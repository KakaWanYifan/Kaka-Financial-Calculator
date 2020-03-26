var util = require("../../../common/kfc.js");
Page({
  onLoad: function (options) {
    var that = this;
    var params = new Object();
    params.code = "USD";
    var today = new Date().toDateString();
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
    wx.request({
      url: 'https://ali-waihui.showapi.com/waihui-transform',
      data: {
        'fromCode':'USD',
        'money':'100',
        'toCode':'MYR'
      },
      header: {
        'Authorization': 'APPCODE 312be8803bfd4e4b934b60a780f825a9'
      },
      success: function (res) {
        if (res.statusCode.toString() == '200') {
          var result = res.data.showapi_res_body['money'];
          result = parseFloat(result) / 100;
          result = result.toFixed(4);
          that.setData({
            forexMYR: 'view_show',
            exchangeRateMYR: result,
            updatetimeMYR: today
          });
        }
        else {
          that.setData({
            forexMYR: 'view_hide',
            exchangeRateMYR: ''
          });
        }
      },
      fail: function (res) {
        that.setData({
          forexMYR:'view_hide',
          exchangeRateMYR: ''
        })
      }
    });
  },
  reset: function (e) {
    var that = this;
    var params = new Object();
    params.code = "USD";
    var today = new Date().toDateString();
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
    wx.request({
      url: 'https://ali-waihui.showapi.com/waihui-transform',
      data: {
        'fromCode': 'USD',
        'money': '100',
        'toCode': 'MYR'
      },
      header: {
        'Authorization': 'APPCODE 312be8803bfd4e4b934b60a780f825a9'
      },
      success: function (res) {
        if (res.statusCode.toString() == '200') {
          var result = res.data.showapi_res_body['money'];
          result = parseFloat(result) / 100;
          result = result.toFixed(4);
          that.setData({
            forexMYR: 'view_show',
            exchangeRateMYR: result,
            updatetimeMYR: today
          });
        }
        else {
          that.setData({
            forexMYR: 'view_hide',
            exchangeRateMYR: ''
          });
        }
      },
      fail: function (res) {
        that.setData({
          forexMYR: 'view_hide',
          exchangeRateMYR: ''
        })
      }
    });
  },
  calculate: function (ent) {
    var a = ent.detail.value.a;
    var b = ent.detail.value.b;
    var ca = ent.detail.value.ca;
    var cb = ent.detail.value.cb;
    var f = ent.detail.value.f;
    var exchangeRate = ent.detail.value.exchangeRate;
    var exchangeRateMYR = ent.detail.value.exchangeRateMYR;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率（美元/人民币）');
    }
    if (exchangeRateMYR == '') {
      return util.showMsg('', '请输入汇率（美元/令吉）');
    }
    if (a == '') {
      return util.showMsg('', '请输入运费');
    }
    if (b == '') {
      return util.showMsg('', '请输入到岸杂费');
    }
    if (ca == '') {
      return util.showMsg('', '请输入关税税率');
    }
    if (cb == '') {
      return util.showMsg('', '请输入增值税率');
    }
    if (f == '') {
      return util.showMsg('', '请输入马来西亚现货');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    ca = parseFloat(ca)/100;
    cb = parseFloat(cb)/100;
    f = parseFloat(f);
    exchangeRate = parseFloat(exchangeRate);
    exchangeRateMYR = parseFloat(exchangeRateMYR);
    var res = ((f / exchangeRateMYR) + a) * exchangeRate * ((1+ca) * (1+cb) * 0.01 + 1) + b;
    res = res.toFixed(2);
    util.showMsg('结果', '中国到岸成本：' + res + '元/吨');
  }
})