var util = require("../../../common/kfc.js");
Page({
  data:{
    percentViewState: 'view_show',
    fixedViewState: 'view_hide',
    issuePrice : '1.0000',
    checkState: true
  },
  radioChange: function (e)
  {
    if(e.detail.value == 'percent')
    {
      this.setData({
        percentViewState: 'view_show',
        fixedViewState: 'view_hide'
      });
    }
    else
    {
      this.setData({
        percentViewState: 'view_hide',
        fixedViewState: 'view_show'
      });
    }
  },
  bindPreSubDateChange: function(e)
  {
    this.setData({
      preSubDate: e.detail.value
    });
  },
  bindSetDateChange: function(e)
  {
    this.setData({
      setDate: e.detail.value
    });
  },
  reset:function(e)
  {
    this.setData({
      checkState: true,
      preSubDate: '',
      setDate: '',
      percentViewState: 'view_show',
      fixedViewState: 'view_hide',
      issuePrice: '1.0000'
    })
  },
  calculate:function(e)
  {
    var preSubAmount = e.detail.value.preSubAmount;
    var issuePrice = e.detail.value.issuePrice;
    var preSubFeeType = e.detail.value.preSubFeeType;
    var preSubRate = e.detail.value.preSubRate;
    var preSubFixed = e.detail.value.preSubFixed;
    var depoRate = e.detail.value.depoRate;
    var preSubDate = e.detail.value.preSubDate;
    var setDate = e.detail.value.setDate;

    if (preSubAmount == '')
    {
      return util.showMsg('', '请输入认购金额');
    }
    if (issuePrice == '')
    {
      return util.showMsg('', '请输入发行价格');
    }
    if (preSubFeeType == '')
    {
      return util.showMsg('', '请选择认购费率类型');
    }
    if (preSubFeeType == 'percent' && preSubRate == '')
    {
      return util.showMsg('', '请输入认购费率百分比');
    }
    if (preSubFeeType == 'fixed' && preSubFixed == '')
    {
      return util.showMsg('', '请输入认购费率固定值');
    }
    if (depoRate == '')
    {
      return util.showMsg('', '请输入同业存款利率');
    }
    if (preSubDate == '')
    {
      return util.showMsg('', '请输入认购日期');
    }
    if (setDate == '')
    {
      return util.showMsg('', '请输入成立日期');
    }
    if(preSubDate >= setDate)
    {
      return util.showMsg('','成立日期必须晚于认购日期')
    }
    var interest;
    var preSubCharge;
    var preSubShares;
    var dateDiff = util.getDateDiffDays(setDate,preSubDate) - 1;

    preSubAmount = parseFloat(preSubAmount);
    issuePrice = parseFloat(issuePrice);
    preSubRate = parseFloat(preSubRate);
    preSubFixed = parseFloat(preSubFixed);
    depoRate = parseFloat(depoRate);
    dateDiff = parseFloat(dateDiff);

    depoRate = depoRate / 100;
    preSubRate = preSubRate/100;
    interest = preSubAmount * depoRate / 360 * dateDiff;
    interest = interest.toFixed(2);

    interest = parseFloat(interest);

    if(preSubFeeType == 'percent')
    {
      preSubCharge = preSubAmount / (1 + preSubRate) * preSubRate;
    }
    else
    {
      preSubCharge = preSubFixed;
    }
    preSubCharge = preSubCharge.toFixed(2);
    preSubCharge = parseFloat(preSubCharge);
    preSubShares = (preSubAmount - preSubCharge + interest) / issuePrice;
    preSubShares = parseFloat(preSubShares).toFixed(2);
    var Msg = '认购利息结转：' + interest.toFixed(2) + '元\r\n'
      + '认购手续费：' + preSubCharge.toFixed(2) + '元\r\n'
            + '认购份额：' + preSubShares + '份';
    util.showMsg('结果',Msg);
  }
})
