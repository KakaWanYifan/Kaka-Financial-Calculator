var util = require("../../../../common/kfc.js");
var c = require("threeCal.js");

Page({
  deliveryDateChange: function (e) {
    this.setData({
      deliveryDate: e.detail.value
    })
  },
  payDateChange: function (e) {
    this.setData({
      payDate: e.detail.value
    })
  },
  reset: function (e) {
    this.setData({
      deliveryDate: '',
      payDate: ''
    })
  },
  calculate: function (e) {
    var unitCost = e.detail.value.unitCost;
    var unitValue = e.detail.value.unitValue;
    var deliveryDate = e.detail.value.deliveryDate;
    var payDate = e.detail.value.payDate;
    var annualInterestRate = e.detail.value.annualInterestRate;
    var repayFrequency = e.detail.value.repayFrequency;

    if (unitCost == '') {
      return util.showMsg('', '请输入单位成本');
    }
    if (unitValue == '') {
      return util.showMsg('', '请输入单位面值');
    }
    if (deliveryDate == '') {
      return util.showMsg('', '请输入购买交割日');
    }
    if (payDate == '') {
      return util.showMsg('', '请输入到期兑付日');
    }
    if (deliveryDate >= payDate) {
      return util.showMsg('', '到期兑付日应当晚于购买交割日')
    }
    if (annualInterestRate == '') {
      return util.showMsg('', '请输入票面年利率');
    }
    if (repayFrequency == '') {
      return util.showMsg('', '请输入利息支付频率');
    }
    var days = util.getDateDiffDays(payDate, deliveryDate) + 1;

    unitValue = parseFloat(unitValue);
    unitCost = parseFloat(unitCost);
    days = parseFloat(days);
    annualInterestRate = parseFloat(annualInterestRate) / 100;
    repayFrequency = parseFloat(repayFrequency);

    var w,m;
    var l,isetp,s,e,pv,x;

    l = days * repayFrequency / 365;
    m = parseInt(l + 1);
    w = days % (365 / repayFrequency) / (365 / repayFrequency);
    isetp = 0.0001;
    s = 0.001;
    e = 1;
    pv = 0;
    x = (e - s) / 2;
    while ((Math.abs(pv - unitCost) > 0.001) && (Math.abs(e - s) > isetp)) {
      pv = c.Cal(x, w, m, unitValue, annualInterestRate, repayFrequency);
      if (pv == 0)
        break;
      if (pv < unitCost) {
        e = x;
        x = (s + e) / 2;
      }
      if (pv > unitCost) {
        s = x;
        x = (s + e) / 2;
      }
    }
    var bondEndRate = x;
    bondEndRate = (bondEndRate * 100).toFixed(2);
    util.showMsg('结果', '到期收益率：' + bondEndRate + '%');
  }
  
})