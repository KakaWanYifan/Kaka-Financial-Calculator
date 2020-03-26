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
    var exchangeRate = enter.detail.value.exchangeRate;
    var c = enter.detail.value.c;
    var mf = enter.detail.value.mf;
    var fob = enter.detail.value.fob;
    if (exchangeRate == '') {
      return util.showMsg('', '请输入汇率');
    }
    if (c == '') {
      return util.showMsg('', '请输入海上运费 + 保险费');
    }
    if (mf == '') {
      return util.showMsg('', '港口所有物流费');
    }
    if (fob == '') {
      return util.showMsg('', '请输入FOB离岸价');
    }
    exchangeRate = parseFloat(exchangeRate);
    c = parseFloat(c);
    mf = parseFloat(mf);
    fob = parseFloat(fob);
    var ret = (((fob + c)/exchangeRate)+mf)*1.17;
    ret = ret.toFixed(2);
    util.showMsg('结果', '上海仓单成本：' + ret + '元/吨');
  }
})