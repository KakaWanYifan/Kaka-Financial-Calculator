var util = require("../../../../common/kfc.js");
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
    var repayExpires = e.detail.value.repayExpires;

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
    if (repayExpires == '') {
      return util.showMsg('', '请输入偿还期限');
    }
    var days = util.getDateDiffDays(payDate, deliveryDate) + 1;

    unitValue = parseFloat(unitValue);
    unitCost = parseFloat(unitCost);
    days = parseFloat(days);
    annualInterestRate = parseFloat(annualInterestRate)/100;
    repayExpires = parseFloat(repayExpires);

    var bondEndRate = Math.pow((unitValue + unitValue * repayExpires * annualInterestRate) / unitCost, 365.0 / days) - 1;
    bondEndRate = (bondEndRate * 100).toFixed(2);
    util.showMsg('结果', '到期收益率：' + bondEndRate + '%');
  }
})