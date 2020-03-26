var util = require("../../../common/kfc.js");
Page({
  data: {
    array: ['进口棉花成本', '籽棉折皮棉收购价'],
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
    var a = ent.detail.value.a;
    var b = ent.detail.value.b;
    var c = ent.detail.value.c;
    var d = ent.detail.value.d;
    var f = ent.detail.value.f;
    var exchangeRate = ent.detail.value.exchangeRate;
    var zm = ent.detail.value.zm;
    var yf = ent.detail.value.yf;
    var calType = ent.detail.value.calType;
    calType = parseInt(calType);
    if (calType == 0) 
    {
      if (exchangeRate == '') {
        return util.showMsg('', '请输入汇率');
      };
      if (a == '') {
        return util.showMsg('', '请输入NYBOT棉花CNF报价');
      };
      if (b == '') {
        return util.showMsg('', '请输入海运保险费率');
      };
      if (c == '') {
        return util.showMsg('', '请输入进口代理费率');
      };
      if (d == '') {
        return util.showMsg('', '请输入关税税率');
      };
      if (f == '') {
        return util.showMsg('', '请输入增值税率');
      };
      a = parseFloat(a);
      b = parseFloat(b);
      c = parseFloat(c);
      d = parseFloat(d);
      exchangeRate = parseFloat(exchangeRate);
      f = parseFloat(f);
      var res = a * 22.0462 * (1 + b * 0.01) * (1 + d * 0.01) * (1 + f * 0.01) * (1 + c * 0.01) * exchangeRate
      res = res.toFixed(2);
      util.showMsg('结果', '成本：' + res + '元/吨');
    }
    else 
    {
      if (zm == '') {
        return util.showMsg('', '请输入籽棉');
      };
      if (yf == '') {
        return util.showMsg('', '请输入衣分');
      };
      zm = parseFloat(zm);
      yf = parseFloat(yf);
      var res = zm * yf*20;
      res = res.toFixed(2);
      util.showMsg('结果', '折皮棉收购价：' + res + '元/吨' + '\r\n忽略损耗');
    }
  }
})