var util = require("../../../common/kfc.js");
Page({
  onLoad: function (options) {
    switch (options.m) {
      case 'a':
        {
          this.setData({
            aViewState: 'view_show',
            bViewState: 'view_hide',
            cViewState: 'view_hide',
            aBlockState: true,
            bBlockState: false,
            cBlockState: false
          });
        }
        break
      case 'b':
        {
          this.setData({
            aViewState: 'view_show',
            bViewState: 'view_show',
            cViewState: 'view_hide',
            aBlockState: false,
            bBlockState: true,
            cBlockState: false
          });
        }
        break
      case 'c':
        {
          this.setData({
            aViewState: 'view_show',
            bViewState: 'view_show',
            cViewState: 'view_show',
            aBlockState: false,
            bBlockState: false,
            cBlockState: true
          });
        }
        break
    }
    this.setData({
      calType: options.m
    })
  },
  reset: function (e) {

  },
  calculate: function (e) {
    var Cost = e.detail.value.edCost;
    var BuyPrice = e.detail.value.edPrice;
    var Years = e.detail.value.edYear;
    var Rate = e.detail.value.edRate;
    var Freq = e.detail.value.edFreq;
    var calType = e.detail.value.calType

    if (Cost == '') {
      return util.showMsg('', '请输入债券面额');
    }
    if (BuyPrice == '') {
      return util.showMsg('', '请输入认购价格');
    }
    if (Years == '') {
      return util.showMsg('', '请输入债券期限');
    }

    Cost = parseFloat(Cost);
    BuyPrice = parseFloat(BuyPrice);
    Years = parseFloat(Years);

    var Msg = '';
    var ret;
    switch (calType) {
      case 'a':
        {
          if(BuyPrice >= Cost)
          {
            ret = '认购价格大于债券面额\r\n无收益';
            return util.showMsg('结果', ret);
          }
          else
          {
            ret = (Cost - BuyPrice * 1.0) / (BuyPrice * Years);
            ret = ret * 100;
            ret = ret.toFixed(2)
          }
        }
        break
      case 'b':
        {
          if (Rate == '') {
            return util.showMsg('', '请输入票面利率');
          }
          Rate = parseFloat(Rate) / 100;
          ret = Math.pow((Cost + Years * Cost * Rate) / BuyPrice, 1.0 / Years) - 1;
          ret = ret * 100;
          ret = ret.toFixed(2);
        }
        break
      case 'c':
        {
          if (Rate == '') {
            return util.showMsg('', '请输入票面利率');
          }
          if (Freq == '') {
            return util.showMsg('', '请输入利息支付频率');
          }
          Rate = parseFloat(Rate) / 100;
          Freq = parseFloat(Freq);

          var w, m;
          var pv, x, s, e, isetp, ret = 0;
          m = Years * Freq;
          w = 1;
          isetp = 0.0001;
          s = 0.001;
          e = 1;
          pv = 0;
          x = (1 - isetp) / 2;
          while ((Math.abs(pv - BuyPrice) > 0.001) && (Math.abs(e - s) > isetp)) {
            pv = Calcrg(x, w, m, Cost, Rate, Freq);
            if (pv == 0)
              break;
            if (pv < BuyPrice) {
              e = x;
              x = s + (e - s) / 2;
            }
            if (pv > BuyPrice) {
              s = x;
              x = s + (e - s) / 2;
            }
          }
          ret = x;
          ret = ret * 100;
          ret = ret.toFixed(2);
        }
        break
    }
    Msg = '认购收益率：' + ret + '%';
    util.showMsg('结果', Msg);
  }
})

function Calcrg(x, w, m, Cost, Rate, Freq) {
  var y = 0;
  var i;
  for (i = w; i <= w + m - 1; i++)
    y = y + (Cost * Rate / Freq) / Math.pow((1 + x / Freq), i);
  y = y + (Cost / Math.pow((1 + x / Freq), (w + m - 1)));
  return y;
}
