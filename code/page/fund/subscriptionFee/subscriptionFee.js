var util = require("../../../common/kfc.js");
Page({
  data: {
    percentViewState: 'view_show',
    fixedViewState: 'view_hide',
    checkState: true
  },
  radioChange: function (e) {
    if (e.detail.value == 'percent') {
      this.setData({
        percentViewState: 'view_show',
        fixedViewState: 'view_hide'
      });
    }
    else {
      this.setData({
        percentViewState: 'view_hide',
        fixedViewState: 'view_show'
      });
    }
  },
  reset: function (e) {
    this.setData({
      checkState: true,
      percentViewState: 'view_show',
      fixedViewState: 'view_hide'
    })
  },
  calculate: function (e) {
    var subAmount = e.detail.value.subAmount;
    var netValue = e.detail.value.netValue;
    var subFeeType = e.detail.value.subFeeType;
    var subRate = e.detail.value.subRate;
    var subFixed = e.detail.value.subFixed;

    if (subAmount == '') {
      return util.showMsg('', '请输入申购金额');
    }
    if (netValue == '') {
      return util.showMsg('', '请输入基金净值');
    }
    if (subFeeType == '') {
      return util.showMsg('', '请选择申购费率类型');
    }
    if (subFeeType == 'percent' && subRate == '') {
      return util.showMsg('', '请输入申购费率百分比');
    }
    if (subFeeType == 'fixed' && subFixed == '') {
      return util.showMsg('', '请输入申购费率固定值');
    }
    var subCharge;
    var subShares;

    subAmount = parseFloat(subAmount);
    netValue = parseFloat(netValue);
    subRate = parseFloat(subRate);
    subFixed = parseFloat(subFixed);

    subRate = subRate / 100;

    if (subFeeType == 'percent') {
      subCharge = subAmount / (1 + subRate) * subRate;
    }
    else {
      subCharge = parseFloat(subFixed);
    }
    subCharge = subCharge.toFixed(2);
    subCharge = parseFloat(subCharge);
    subRate = parseFloat(subRate);

    subShares = (subAmount - subCharge) / netValue;
    subShares = subShares.toFixed(2);
    var Msg = '认购手续费：' + subCharge.toFixed(2) + '元\r\n'
      + '认购份额：' + subShares + '份';
    util.showMsg('结果', Msg);
  }
})