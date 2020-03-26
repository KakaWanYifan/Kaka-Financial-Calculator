var util = require("../../../common/kfc.js");
var cal = require("incomeRateCal.js");
Page({
  data: {
    array: ['债券购买收益率', '债券出售收益率', '债券持有期间收益率'],
    index: 0,
    aViewState: 'view_show',
    bViewState: 'view_hide',
    cViewState: 'view_hide'
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
    if(e.detail.value == '0')
    {
      this.setData({
        aViewState: 'view_show',
        bViewState: 'view_hide',
        cViewState: 'view_hide',
      })
    }
    if (e.detail.value == '1') {
      this.setData({
        aViewState: 'view_hide',
        bViewState: 'view_show',
        cViewState: 'view_hide',
      })
    }
    if (e.detail.value == '2') {
      this.setData({
        aViewState: 'view_hide',
        bViewState: 'view_hide',
        cViewState: 'view_show',
      })
    }
  },
  reset:function(e)
  {
    this.setData({
      index: 0,
      aViewState: 'view_show',
      bViewState: 'view_hide',
      cViewState: 'view_hide'
    })
  },
  calculate: function(e)
  {
    var calType = parseInt(e.detail.value.calType);
    var aBondValue = e.detail.value.aBondValue;
    var aBuyPrice = e.detail.value.aBuyPrice;
    var aExpireDays = e.detail.value.aExpireDays;
    var aAnnualInterestRate = e.detail.value.aAnnualInterestRate;
    var bIssuePrice = e.detail.value.bIssuePrice;
    var bSellPrice = e.detail.value.bSellPrice;
    var bHoldDays = e.detail.value.bHoldDays;
    var bAnnualInterestRate = e.detail.value.bAnnualInterestRate;
    var cBondValue = e.detail.value.cBondValue;
    var cBuyPrice = e.detail.value.cBuyPrice;
    var cSellPrice = e.detail.value.cSellPrice;
    var cHoldDays = e.detail.value.cHoldDays;
    var cAnnualInterestRate = e.detail.value.cAnnualInterestRate;

    var Msg = '';
    switch (calType)
    {
      case 0:
        Msg = cal.aCal(aBondValue,aBuyPrice,aExpireDays,aAnnualInterestRate);
        break;
      case 1:
        Msg = cal.bCal(bIssuePrice,bSellPrice,bHoldDays,bAnnualInterestRate);
        break;
      case 2:
        Msg = cal.cCal(cBondValue,cBuyPrice,cSellPrice,cHoldDays,cAnnualInterestRate);
        break;
    }
    util.showMsg(Msg[0],Msg[1]);
  }
})