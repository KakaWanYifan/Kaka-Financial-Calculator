var util = require("../../../common/kfc.js");
Page({
  reset: function (e) {
  },
  calculate: function (e) {
    var buyPrice = e.detail.value.buyPrice;
    var bounus = e.detail.value.bounus;
    var sellPrice = e.detail.value.sellPrice;
    var sellShares = e.detail.value.sellShares;
    var tradeRate = e.detail.value.tradeRate;
    if(buyPrice == ''){
      return util.showMsg('','请输入买入价格');
    }
    if (bounus == '') {
      return util.showMsg('', '请输入分红金额');
    }
    if (sellPrice == '') {
      return util.showMsg('', '请输入卖出价格');
    }
    if (sellShares == '') {
      return util.showMsg('', '请输入卖出单位');
    }
    if (tradeRate == '') {
      return util.showMsg('', '请输入交易费率');
    }
    buyPrice = parseFloat(buyPrice);
    bounus = parseFloat(bounus);
    sellPrice = parseFloat(sellPrice);
    sellShares = parseFloat(sellShares);
    tradeRate = parseFloat(tradeRate)/100;

    var profit = sellPrice - buyPrice;
    profit = parseFloat(profit);

    var sum = sellPrice + buyPrice;
    sum = parseFloat(sum);

    var fundlost = profit * sellShares + bounus - sum * sellShares * tradeRate;
    fundlost = fundlost.toFixed(2);

    util.showMsg('结果','基金的投资损益：' + fundlost);
  }
})