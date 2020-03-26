var util = require("../../../common/kfc.js");
Page({
  data: {
    checkState:true
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://vip.stock.finance.sina.com.cn/q/view/vCalculator.php', 
      success: function (res) {
        if (res.statusCode.toString() == '200')
        {
          var result = res.data.toString();
          var a = result.indexOf("[");
          result = result.substr(a + 1,result.length - a -2);
          result = result.replace(/M2/, '"M2"');
          result = result.replace(/M1/, '"M1"');
          result = result.replace(/M0/, '"M0"');
          var keySet = JSON.parse(result);
          that.setData({
            view_state:'view_show',
            M2: (parseFloat(keySet['M2'])/10000).toFixed(2),
            M1: (parseFloat(keySet['M1']) / 10000).toFixed(2),
            M0: (parseFloat(keySet['M0']) / 10000).toFixed(2),
          })
        }
        else
        {
          that.setData({
            view_state: 'view_hide',
            M2: '',
            M1: '',
            M0: ''
          })
        }
      },
      fail:function(res)
      {
        that.setData({
          view_state: 'view_hide',
          M2: '',
          M1: '',
          M0: ''
        })
      }
    });
  },
  reset:function(e)
  {
    this.setData({
      checkState: true
    });
    var that = this;
    wx.request({
      url: 'https://vip.stock.finance.sina.com.cn/q/view/vCalculator.php',
      success: function (res) {
        if (res.statusCode.toString() == '200') {
          var result = res.data.toString();
          var a = result.indexOf("[");
          result = result.substr(a + 1, result.length - a - 2);
          result = result.replace(/M2/, '"M2"');
          result = result.replace(/M1/, '"M1"');
          result = result.replace(/M0/, '"M0"');
          var keySet = JSON.parse(result);
          that.setData({
            view_state: 'view_show',
            M2: (parseFloat(keySet['M2']) / 10000).toFixed(2),
            M1: (parseFloat(keySet['M1']) / 10000).toFixed(2),
            M0: (parseFloat(keySet['M0']) / 10000).toFixed(2),
          })
        }
        else {
          that.setData({
            view_state: 'view_hide',
            M2: '',
            M1: '',
            M0: ''
          })
        }
      },
      fail: function (res) {
        that.setData({
          view_state: 'view_hide',
          M2: '',
          M1: '',
          M0: ''
        })
      }
    });
  },
  calculate:function(e)
  {
    var M2 = e.detail.value.M2;
    var M1 = e.detail.value.M1;
    var M0 = e.detail.value.M0;
    var orientation = e.detail.value.orientation;
    var rate = e.detail.value.rate;
    if(M2 == ''){
      return util.showMsg('','请输入广义货币供应量(M2)')
    };
    if (M1 == '') {
      return util.showMsg('', '请输入狭义货币供应量(M1)')
    };
    if (M0 == '') {
      return util.showMsg('', '请输入流通中的现金(M0)')
    };
    if (orientation == '') {
      return util.showMsg('', '请输入法定存款准备金率调整方向')
    };
    if (rate == '') {
      return util.showMsg('', '请输入法定存款准备金率调整百分点')
    };
    M2 = parseFloat(M2);
    M1 = parseFloat(M1);
    M0 = parseFloat(M0);
    if((M2 >M1) && (M1 > M0))
    {
      var ret = (M2 - M0) * rate / 100;
      ret = ret.toFixed(2);
      util.showMsg('结果', orientation + '\r\n' + ret + '万亿');
    }
    else
    {
      util.showMsg('', 'M2必须大于M1，M1必须大于M0');
    }
  }
})