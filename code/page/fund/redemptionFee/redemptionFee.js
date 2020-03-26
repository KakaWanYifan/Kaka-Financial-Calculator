var util = require("../../../common/kfc.js");
Page({
  data:{
    viewState:'view_hide'
  },
  switchChange:function(e)
  {
    if(e.detail.value == true)
    {
      this.setData({
        viewState:'view_show'
      })
    }
    else
    {
      this.setData({
        viewState: 'view_hide'
      })
    }
  },
  reset: function (e) {
    this.setData({
      viewState: 'view_hide'
    })
  },
  calculate: function (e) {
    var redAmount = e.detail.value.redAmount;
    var redNetValue = e.detail.value.redNetValue;
    var redRate = e.detail.value.redRate;
    var isBackend = e.detail.value.isBackend;
    var subRate = e.detail.value.subRate;
    var subNetValue = e.detail.value.subNetValue;
    if (redAmount == ''){
      return util.showMsg('','请输入赎回份额');
    }
    if (redNetValue == '') {
      return util.showMsg('', '请输入赎回净值');
    }
    if (redRate == '') {
      return util.showMsg('', '请输入赎回费率');
    }
    if (isBackend == true && subRate == '') {
      return util.showMsg('', '请输入申购净值');
    }
    if (isBackend == true && subNetValue == '') {
      return util.showMsg('', '请输入后端申购费率');
    }
    redAmount = parseFloat(redAmount);
    redNetValue = parseFloat(redNetValue);
    redRate = parseFloat(redRate);
    subRate = parseFloat(subRate);
    subNetValue = parseFloat(subNetValue);
    redRate = redRate/100;
    subRate = subRate/100;


    var redCharge;
    var subCharge;
    var effectiveIncome;

    var Msg = '';
    if (isBackend == true)
    {
      redCharge = redAmount * redNetValue * redRate;
      redCharge = redCharge.toFixed(2);
      redCharge = parseFloat(redCharge);

      subCharge = redAmount * subNetValue / (1+subRate) * subRate;
      subCharge = subCharge.toFixed(2);
      subCharge = parseFloat(subCharge);

      effectiveIncome = (redAmount * redNetValue) - redCharge - subCharge;
      effectiveIncome = effectiveIncome.toFixed(2);

      Msg = '赎回手续费：' + redCharge.toFixed(2) + '元' + '\r\n'
        + '后端申购手续费：' + subCharge.toFixed(2) + '元' + '\r\n'
          + '实际所得金额：' + effectiveIncome + '元';
    }
    else
    {
      redCharge = redAmount * redNetValue * redRate;
      redCharge = redCharge.toFixed(2);
      redCharge = parseFloat(redCharge);

      effectiveIncome = (redAmount * redNetValue) - redCharge;
      effectiveIncome = effectiveIncome.toFixed(2);

      Msg = '赎回手续费：' + redCharge.toFixed(2) + '元' + '\r\n'
        + '实际所得金额：' + effectiveIncome + '元';
    }
    util.showMsg('结果',Msg);
  }
})