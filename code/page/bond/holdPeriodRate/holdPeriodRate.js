var util = require("../../../common/kfc.js");
Page({
  data: {
    array: ['贴现债券', '付息债券'],
    index: 0,
    specialViewState: 'view_hide',
    PayArr:['固定频率付息','一次还本付息'],
    PayId:0
  },
  bindPickerChange: function(e)
  {
    if(e.detail.value == 0)
    {
      this.setData({
        index: 0,
        specialViewState: 'view_hide'
      })
    }
    else
    {
      this.setData({
        index:1,
        specialViewState: 'view_show',
        PadId:0,
        payMethodViewState:'view_show'
      })
    }
  },
  bindPayPickerChange:function(e)
  {
    if (e.detail.value == 0)
    {
      this.setData({
        PayId: 0,
        payMethodViewState: 'view_show'
      });
    }
    else
    {
      this.setData({
        PayId: 1,
        payMethodViewState: 'view_hide'
      });
    }
  },
  bindDateChange_buyDate: function (e) {
    this.setData({
      buyDate: e.detail.value
    });
  },
  bindDateChange_sellDate: function (e) {
    this.setData({
      sellDate: e.detail.value
    });
  },
  bindDateChange_payDate: function(e){
    this.setData({
      payDate:e.detail.value
    });
  },
  reset:function(e)
  {
    this.setData({
      index: 0,
      buyDate:'',
      sellDate:'',
      payDate:'',
      specialViewState: 'view_hide'
    })
  },
  calculate:function(e)
  {
    var calType = e.detail.value.calType;
    var price = e.detail.value.price;
    var rate = e.detail.value.rate;
    var payDate = e.detail.value.payDate;
    var payMethod = e.detail.value.payMethod;
    var freq = e.detail.value.freq;
    var buyDate = e.detail.value.buyDate;
    var buyPrice = e.detail.value.buyPrice;
    var sellDate = e.detail.value.sellDate;
    var sellPrice = e.detail.value.sellPrice;
    
    if(calType.toString == '1')
    {
      if(price == ''){
        return util.showMsg('','请输入债券面额')
      }
      if (rate == '') {
        return util.showMsg('', '请输入附息债券利率')
      }
      if (payDate == ''){
        return util.showMsg('', '请输入债券到期日')
      }
      if (payMethod.toString() == "0" && freq == ''){
        return util.showMsg('', '请输入利息支付频率')
      }
    }
    if (buyDate == '') {
      return util.showMsg('', '请输入买入日期')
    }
    if (buyPrice == '') {
      return util.showMsg('', '请输入买入价格')
    }
    if (sellDate == '') {
      return util.showMsg('', '请输入卖出日期')
    }
    if (sellPrice == '') {
      return util.showMsg('', '请输入卖出价格')
    }
    if (sellDate <= buyDate)
    {
      return util.showMsg('','买入日期必须早于卖出日期')
    }
    price = parseFloat(price);
    rate = parseFloat(rate)/100;
    freq = parseFloat(freq);
    buyPrice = parseFloat(buyPrice);
    sellPrice = parseFloat(sellPrice);

    var FirstPayDate = new Date();
    var limitdate = new Date();
    if ((calType.toString() == '1') && (payMethod == '0'))
    {
      limitdate = new Date(payDate);
      FirstPayDate = CalPayDate(limitdate, buyDate, freq);
    }

    var days = parseInt(util.getDateDiffDays(sellDate, buyDate));
    var years = parseFloat(days/365);

    var w, n, y;
    var isetp = 0.0001;//误差上限
    var s = 0.001;//黄金下限值
    var e = 1;//黄金上限值
    var pv = 0;//收益率计算所得的购买价格
    var tDays = util.getDateDiffDays(buyDate, FirstPayDate);//债券交割日距下一次付息日的实际天数
    var rnt;

    if (calType.toString() == '0')
    {
      rnt = (((sellPrice - buyPrice) / years) / buyPrice);
    }
    else
    {
      if (payMethod.toString() == '0') // 按年付息
      {
        w = tDays * freq / 365;//债券交割日距下一次付息日的实际天数 * 年付息频率 / 365			
        n = parseInt(util.getDateDiffDaysPM(sellDate, FirstPayDate)/365 * freq);//剩余的付息次数=1+[(卖出日 - 首次付息日)	/365 * 年付息频率]取整，不舍入
        if (FirstPayDate <= new Date(sellDate))//如果第一次付息日早与卖出日期则计算为付息次数+1
          n = n + 1;
        if (n > 0)//如果购买期间有付息
        {
          y = (e - s) / 2;//收益率初次估算值

          //y = 0.4995;
          //w = 1.0136986301369864;
          //n = 11;
          //price = 10;
          //rate = 0.1234
          //freq = "6";
          //sellPrice = 11;
          //years = 2;

          while ((Math.abs(pv - buyPrice) > isetp) && (Math.abs(e - s) > isetp)) {
            pv = Calc(y, w, n, price * rate, freq, sellPrice, years);
            if (pv == 0)
              break;
            if (pv < buyPrice) {
              e = y;
              y = (s + e) / 2;
            }
            if (pv > buyPrice) {
              s = y;
              y = (s + e) / 2;
            }
          }
        }
        else//购买时间内无付息
        {
          y = (((sellPrice - buyPrice) / years) / buyPrice);
        }
        rnt = y;
      }
      else
      {
        rnt = (((sellPrice - buyPrice) / years) / buyPrice);
      }
    }
    rnt = rnt*100;
    rnt = rnt.toFixed(2);
    util.showMsg('结果','认购收益率：' + rnt + '%');
  }
})

/*根据债券到期日计算首次付息日
EndDate:债券到期日
BuyDate:债券购买日 
PayFreq:年付息平率（次/年）
思路：假设购买年=第一次付息年，根据年付息频率估算付息年所有的付息日；
比较付息日与购买日的天数差，取最小的正整数差得付昔日作为第一次付息日。
*/
function CalPayDate(limitdate, buydate, PayFreq) {
  var BuyDate = new Date(buydate);
  var EndDate = new Date(limitdate);
  var PayDiffDays = Math.ceil(365 / PayFreq);
  var tmpPayDate = new Array();
  var diff = new Array();
  var i;
  for (i = 0; i < PayFreq; i++) {
    tmpPayDate[i] = new Date(BuyDate.getFullYear(), EndDate.getMonth(), EndDate.getDate() + new Number((i + 1) * PayDiffDays + 1));
    diff[i] = (tmpPayDate[i] - BuyDate) / (60 * 60 * 24 * 1000);
  }
  var tmpdiff = 365;
  var nearDate = tmpPayDate[0];
  for (i = 0; i < PayFreq; i++) {
    if (diff[i] < tmpdiff && diff[i] > 0) {
      tmpdiff = diff[i];
      nearDate = tmpPayDate[i];
    }
  }
  return nearDate;
}

function Calc(y, w, n, C, f, M, diffDay) {
  var PV = 0;
  for (var i = 0; i <= n - 1; i++) {
    PV = PV + (C / f) / Math.pow((1 + y / f), i + w);
  }
  PV = PV + M / Math.pow((1 + y / f), diffDay);

  return PV;
}