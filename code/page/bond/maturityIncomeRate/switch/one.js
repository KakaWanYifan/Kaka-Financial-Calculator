var util = require("../../../../common/kfc.js");
Page({
  data: {
    array: ['贴现', '一次还本付息', '定期支付'],
    index: 0,
    capitalWithInterest: 'view_hide',
    periodicPayment: 'view_hide'
  },
  bindPickerChange: function(e)
  {
    this.setData({
      index: e.detail.value,
    })
    var arr = this.data.array;
    switch (arr[e.detail.value])
    {
      case '贴现':
        {
          this.setData({
            capitalWithInterest: 'view_hide',
            periodicPayment: 'view_hide'
          });
        }
        break;
      case '一次还本付息':
        {
          this.setData({
            capitalWithInterest: 'view_show',
            periodicPayment: 'view_hide'
          })
        }
        break;
      case '定期支付':
        {
          this.setData({
            capitalWithInterest: 'view_hide',
            periodicPayment: 'view_show'
          })
        }
        break;
    }
  },
  deliveryDateChange:function(e)
  {
    this.setData({
      deliveryDate:e.detail.value
    })
  },
  payDateChange:function(e)
  {
    this.setData({
      payDate: e.detail.value
    })
  },
  reset: function(e)
  {
    this.setData({
      index: 0,
      capitalWithInterest: 'view_hide',
      periodicPayment: 'view_hide',
      deliveryDate:'',
      payDate:''
    })
  },
  calculate: function (e)
  {
    var unitCost = e.detail.value.unitCost;
    var unitValue = e.detail.value.unitValue;
    var deliveryDate = e.detail.value.deliveryDate;
    var payDate = e.detail.value.payDate;
    var interestPayType = e.detail.value.interestPayType;
    var c_annualInterestRate = e.detail.value.c_annualInterestRate;
    var repayExpires = e.detail.value.repayExpires;
    var p_annualInterestRate = e.detail.value.p_annualInterestRate;
    var repayFrequency = e.detail.value.repayFrequency;

    if (unitCost == ''){
      return util.showMsg('','请输入单位成本');
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
    var days = util.getDateDiffDays(payDate, deliveryDate) + 1;

    unitValue = parseFloat(unitValue);
    unitCost = parseFloat(unitCost);
    days = parseFloat(days);

    var bondEndRate;
    var arr = this.data.array;
    switch (arr[interestPayType])
    {
      case '贴现':
        {
          bondEndRate = (unitValue - unitCost) / unitCost * 365 / days;
        }
        break;
      case '一次还本付息':
        {
          if (c_annualInterestRate == ''){
            return util.showMsg('', '请输入票面年利率');
          }
          if (repayExpires == '') {
            return util.showMsg('', '请输入偿还期限');
          }
          c_annualInterestRate = parseFloat(c_annualInterestRate)/100;
          repayExpires = parseFloat(repayExpires);
          bondEndRate = (unitValue + repayExpires * unitValue * c_annualInterestRate - unitCost) / unitCost * 365 / days;
        }
        break;
      case '定期支付':
        {
          if (p_annualInterestRate == '') {
            return util.showMsg('', '请输入票面年利率');
          }
          if (repayFrequency == '') {
            return util.showMsg('', '请输入利息支付频率');
          }
          p_annualInterestRate = parseFloat(p_annualInterestRate)/100;
          repayFrequency = parseFloat(repayFrequency);
          bondEndRate = ((unitValue + unitValue * p_annualInterestRate / repayFrequency) - unitCost) / unitCost * 365.0 / days;
        }
        break;
    }
    bondEndRate = (bondEndRate * 100).toFixed(2);
    util.showMsg('结果', '到期收益率：' + bondEndRate + '%');
  }
})