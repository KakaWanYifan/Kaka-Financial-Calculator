var util = require("../../../common/kfc.js");
Page({
  reset: function (e) {
  },
  calculate: function (e) {
    var outAmount = e.detail.value.outAmount;
    var inAmount = e.detail.value.inAmount;
    var days = e.detail.value.days;
    if (outAmount == ''){
      return util.showMsg('','请输入投入本金')
    }
    if (inAmount == '') {
      return util.showMsg('', '请输入收入金额')
    }
    if (outAmount == '') {
      return util.showMsg('', '请输入持有期限')
    }
    outAmount = parseFloat(outAmount);
    inAmount = parseFloat(inAmount);
    days = parseFloat(days);

    var totalIncomeRate;
    var annualIncomeRate;

    totalIncomeRate = (inAmount - outAmount) / outAmount * 100;
    totalIncomeRate = totalIncomeRate.toFixed(2);
    totalIncomeRate = parseFloat(totalIncomeRate);

    annualIncomeRate = (inAmount - outAmount) / outAmount * 100 / days * 365;
    annualIncomeRate = annualIncomeRate.toFixed(2);

    var Msg = '持有期总收益率：' + totalIncomeRate + '%' + '\r\n'
      + '持有期年化收益率：' + annualIncomeRate + '%';
    util.showMsg('结果',Msg);
  }
})