var util = require("../../../common/kfc.js");
Page({
  data: {
    arrCn: ['美元', '英镑', '日元', '加拿大元', '欧元', '澳大利亚元', '新西兰元', '港币', '澳门元', '瑞士法郎', '瑞典克朗', '丹麦克朗', '挪威克朗', '新加坡元', '泰国铢', '卢布', '菲律宾比索', '林吉特', '南非兰特', '土耳其里拉','韩国元'],
    arrEn: ['USD', 'GBP', 'JPY', 'CAD', 'EUR', 'AUD', 'NZD', 'HKD', 'MOP',  'CHF', 'SEK', 'DKK', 'NOK', 'SGD', 'THB', 'RUB', 'PHP', 'MYR',  'ZAR', 'TRY','KRW'],
    index:0
  },
  onLoad: function (options)
  {
    var that = this;
    var params = new Object();
    params.code = 'USD';
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = parseFloat(keySet['hui_out']) / 100;
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
      index:e.detail.value
    });
    var that = this;
    var params = new Object();
    params.code = this.data.arrEn[e.detail.value];
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = parseFloat(keySet['hui_out']) / 100;
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
    this.setData({
      index: 0
    });
    var that = this;
    var params = new Object();
    params.code = 'USD';
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = parseFloat(keySet['hui_out']) / 100;
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
  calculate: function (e) {
    var exchangeRate = e.detail.value.exchangeRate;
    var fa = e.detail.value.fa;
    if(exchangeRate == ''){
      return util,showMsg('','请输入汇率')
    };
    if(fa == '') {
      return util, showMsg('', '买入外汇数量')
    };
    exchangeRate = parseFloat(exchangeRate);
    fa = parseFloat(fa);
    var res = exchangeRate * fa;
    res = res.toFixed(2);
    util.showMsg('结果','需要支出人民币：' + res + '元');
  }
})
