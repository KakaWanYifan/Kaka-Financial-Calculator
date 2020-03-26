var util = require("../../../common/kfc.js");
Page({
  data: {
    array: [
      {
        'menuId': 0,
        'menu': '沪市A股'
      },
      {
        'menuId': 1,
        'menu': '沪市B股'
      },
      {
        'menuId': 2,
        'menu': '深市A股'
      },
      {
        'menuId': 3,
        'menu': '深市B股'
      }
    ],
    shaBlockState:true,
    shbBlockState: false,
    szaBlockState: false,
    szbBlockState: false,
    checkState:true,
    stampViewState:'view_hide',
    activeIndex: 0
  },
  onShow: function () {
    // 页面显示
    var span = wx.getSystemInfoSync().windowWidth / this.data.array.length + 'px';
    this.setData({
      itemWidth: this.data.array.length <= 5 ? span : '160rpx'
    });
  },
  tabChange: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    });
    switch (index.toString()) {
      case '0':
        {
          this.setData({
            shaBlockState: true,
            shbBlockState: false,
            szaBlockState: false,
            szbBlockState: false,
          })
        }
        break;
      case '1':
        {
          this.setData({
            shaBlockState: false,
            shbBlockState: true,
            szaBlockState: false,
            szbBlockState: false,
          })
        }
        break;
      case '2':
        {
          this.setData({
            shaBlockState: false,
            shbBlockState: false,
            szaBlockState: true,
            szbBlockState: false,
          })
        }
        break;
      case '3':
        {
          this.setData({
            shaBlockState: false,
            shbBlockState: false,
            szaBlockState: false,
            szbBlockState: true,
          })
        }
        break;
    }
  },
  radioChange:function(e){
    if (e.detail.value == 'buy'){
      this.setData({
        stampViewState: 'view_hide'
      });
    }
    else{
      this.setData({
        stampViewState: 'view_show'
      });
    }
  },
  reset: function (e) {
    this.setData({
      index: 0,
      shaBlockState: true,
      shbBlockState: false,
      szaBlockState: false,
      szbBlockState: false,
      checkState: true,
      stampViewState: 'view_hide'
    })
  },
  calculate: function (e) {
    var tradeType = this.data.activeIndex.toString();
    switch(tradeType)
    {
      case '0':
        {
          caseZeroCal(e);
        }
      break;
      case '1':
        {
          caseOneCal(e)
        }
        break;
      case '2':
        {
          caseTwoCal(e);
        }
        break;
      case '3':
        {
          caseThreeeCal(e);
        }
        break;
    }
  }
})

function caseZeroCal(e){
  var bs = e.detail.value.bs;
  var edTradePrice = e.detail.value.edTradePrice;
  var edTradeNum = e.detail.value.edTradeNum;
  var edTradeRate = e.detail.value.edTradeRate;
  var stampRate = e.detail.value.stampRate;
  var rtfRate = e.detail.value.rtfRate;
  if(edTradePrice == ''){
    return util.showMsg('','请输入成交价格');
  }
  if (edTradeNum == '') {
    return util.showMsg('', '请输入成交量');
  }
  if (edTradeRate == '') {
    return util.showMsg('', '请输入佣金比率');
  }
  if (bs == 'buy') {
    stampRate = 0;
  }
  else
  {
    if (stampRate == '') {
      return util.showMsg('', '请输入印花税税率');
    }
  }
  if (rtfRate == '') {
    return util.showMsg('', '请输入过户费费率');
  }
  edTradePrice = parseFloat(edTradePrice);
  edTradeNum = parseFloat(edTradeNum);
  edTradeRate = parseFloat(edTradeRate) / 100;
  stampRate = parseFloat(stampRate) / 100;
  rtfRate = parseFloat(rtfRate);
  var msg = '';
  var tradeSum = edTradePrice * edTradeNum;
  var stampTax = tradeSum * stampRate;
  var brokerage = tradeSum * edTradeRate;
  msg = msg + '印花税：' + stampTax.toFixed(2) + '元\r\n';
  if (brokerage < 5) {
    brokerage = 5;
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n（佣金最低为5元）\r\n';
  }
  else {
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n';
  }
  var rtf = Math.ceil(edTradeNum/1000) * rtfRate;
  if (rtf < 1) {
    rtf = 1;
    msg = msg + '过户费：' + rtf.toFixed(2) + '元\r\n（过户费最低为1元）\r\n';
  }
  else {
    msg = msg + '过户费：' + rtf.toFixed(2) + '元\r\n';
  }
  var total = stampTax + brokerage + rtf;
  msg = msg + '手续费共计：' + total.toFixed(2) + '元';
  util.showMsg('结果',msg);
}

function caseOneCal(e) {
  var bs = e.detail.value.bs;
  var edTradePrice = e.detail.value.edTradePrice;
  var edTradeNum = e.detail.value.edTradeNum;
  var edTradeRate = e.detail.value.edTradeRate;
  var stampRate = e.detail.value.stampRate;
  var clearingRate = e.detail.value.clearingRate;
  if (edTradePrice == '') {
    return util.showMsg('', '请输入成交价格');
  }
  if (edTradeNum == '') {
    return util.showMsg('', '请输入成交量');
  }
  if (edTradeRate == '') {
    return util.showMsg('', '请输入佣金比率');
  }
  if (bs == 'buy') {
    stampRate = 0;
  }
  else {
    if (stampRate == '') {
      return util.showMsg('', '请输入印花税税率');
    }
  }
  if (clearingRate == '') {
    return util.showMsg('', '请输入结算费费率');
  }
  edTradePrice = parseFloat(edTradePrice);
  edTradeNum = parseFloat(edTradeNum);
  edTradeRate = parseFloat(edTradeRate) / 100;
  stampRate = parseFloat(stampRate) / 100;
  clearingRate = parseFloat(clearingRate) / 100;
  var msg = '';
  var tradeSum = edTradePrice * edTradeNum;
  var stampTax = tradeSum * stampRate;
  var brokerage = tradeSum * edTradeRate;
  msg = msg + '印花税：' + stampTax.toFixed(2) + '元\r\n';
  if (brokerage < 1) {
    brokerage = 1;
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n（佣金最低为1美元）\r\n';
  }
  else {
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n';
  }
  var clearing = tradeSum * clearingRate;
  msg = msg + '结算费：' + clearing.toFixed(2) + '元\r\n';
  var total = stampTax + brokerage + clearing;
  msg = msg + '手续费共计：' + total.toFixed(2) + '元';
  util.showMsg('结果', msg);
}

function caseTwoCal(e) {
  var bs = e.detail.value.bs;
  var edTradePrice = e.detail.value.edTradePrice;
  var edTradeNum = e.detail.value.edTradeNum;
  var edTradeRate = e.detail.value.edTradeRate;
  var stampRate = e.detail.value.stampRate;
  if (edTradePrice == '') {
    return util.showMsg('', '请输入成交价格');
  }
  if (edTradeNum == '') {
    return util.showMsg('', '请输入成交量');
  }
  if (edTradeRate == '') {
    return util.showMsg('', '请输入佣金比率');
  }
  if (bs == 'buy') {
    stampRate = 0;
  }
  else {
    if (stampRate == '') {
      return util.showMsg('', '请输入印花税税率');
    }
  }
  edTradePrice = parseFloat(edTradePrice);
  edTradeNum = parseFloat(edTradeNum);
  edTradeRate = parseFloat(edTradeRate) / 100;
  stampRate = parseFloat(stampRate) / 100;
  var msg = '';
  var tradeSum = edTradePrice * edTradeNum;
  var stampTax = tradeSum * stampRate;
  var brokerage = tradeSum * edTradeRate;
  msg = msg + '印花税：' + stampTax.toFixed(2) + '元\r\n';
  if (brokerage < 5) {
    brokerage = 5;
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n（佣金最低为5元）\r\n';
  }
  else {
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n';
  }
  var total = stampTax + brokerage;
  msg = msg + '手续费共计：' + total.toFixed(2) + '元';
  util.showMsg('结果', msg);
}

function caseThreeeCal(e) {
  var bs = e.detail.value.bs;
  var edTradePrice = e.detail.value.edTradePrice;
  var edTradeNum = e.detail.value.edTradeNum;
  var edTradeRate = e.detail.value.edTradeRate;
  var stampRate = e.detail.value.stampRate;
  var clearingRate = e.detail.value.clearingRate;
  if (edTradePrice == '') {
    return util.showMsg('', '请输入成交价格');
  }
  if (edTradeNum == '') {
    return util.showMsg('', '请输入成交量');
  }
  if (edTradeRate == '') {
    return util.showMsg('', '请输入佣金比率');
  }
  if (bs == 'buy') {
    stampRate = 0;
  }
  else {
    if (stampRate == '') {
      return util.showMsg('', '请输入印花税税率');
    }
  }
  if (clearingRate == '') {
    return util.showMsg('', '请输入结算费费率');
  }
  edTradePrice = parseFloat(edTradePrice);
  edTradeNum = parseFloat(edTradeNum);
  edTradeRate = parseFloat(edTradeRate) / 100;
  stampRate = parseFloat(stampRate) / 100;
  clearingRate = parseFloat(clearingRate) / 100;
  var msg = '';
  var tradeSum = edTradePrice * edTradeNum;
  var stampTax = tradeSum * stampRate;
  var brokerage = tradeSum * edTradeRate;
  msg = msg + '印花税：' + stampTax.toFixed(2) + '元\r\n';
  if (brokerage < 5) {
    brokerage = 5;
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n（佣金最低为5港元）\r\n';
  }
  else {
    msg = msg + '佣金：' + brokerage.toFixed(2) + '元\r\n';
  }
  var clearing = tradeSum * clearingRate;
  msg = msg + '结算费：' + clearing.toFixed(2) + '元\r\n';
  var total = stampTax + brokerage + clearing;
  msg = msg + '手续费共计：' + total.toFixed(2) + '元';
  util.showMsg('结果', msg);
}