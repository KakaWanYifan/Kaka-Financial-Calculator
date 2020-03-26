var util = require("../../../common/kfc.js");
Page({
  data: {
    array: ['黄金外内盘价格换算', '黄金内外盘价格换算'],
    index: 0,
    viewOneState: 'view_show',
    viewTwoState: 'view_hide'
  },
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
    if (e.detail.value == 0) {
      this.setData({
        viewOneState: 'view_show',
        viewTwoState: 'view_hide'
      });
    }
    else {
      this.setData({
        viewOneState: 'view_hide',
        viewTwoState: 'view_show'
      });
    }
  },
  reset: function (e) {
    var that = this;
    this.setData({
      index: 0,
      viewOneState: 'view_show',
      viewTwoState: 'view_hide'
    });
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
    var bo = ent.detail.value.bo;
    var bi = ent.detail.value.bi;
    var exchangeRate = ent.detail.value.exchangeRate;
    var calType = ent.detail.value.calType;
    calType = parseInt(calType);
    if (calType == 0) {
      if (exchangeRate == '') {
        return util.showMsg('', '请输入汇率');
      };
      if (bo == '') {
        return util.showMsg('', '请输入外盘');
      };
      bo = parseFloat(bo);
      exchangeRate = parseFloat(exchangeRate);
      var res = bo * exchangeRate / 31.1035;
      res = res.toFixed(2);
      util.showMsg('结果', '内盘：' + res + '元/克');
    }
    else {
      if (exchangeRate == '') {
        return util.showMsg('', '请输入汇率');
      };
      if (bi == '') {
        return util.showMsg('', '请输入外盘');
      };
      bi = parseFloat(bi);
      exchangeRate = parseFloat(exchangeRate);
      var res = bi  * 31.1035 / exchangeRate;
      res = res.toFixed(2);
      util.showMsg('结果', '外盘：' + res + '元/克');
    }
  }
})