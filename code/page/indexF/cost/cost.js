var util = require("../../../common/kfc.js");
Page({
  data: {
    investData: null
  },
  onShow: function () {
    this.setData({
      investData: wx.getStorageSync('cost')
    });
  },
  onUnload: function () {
    wx.clearStorageSync();
  },
  addFutures: function (e) {
    wx.navigateTo({
      url: '../future/future?k=' + e.currentTarget.dataset.k + '&v=' + JSON.stringify(this.data.investData)
    })
  },
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.investData[index].scrollLeft = 0;
    this.data.investData.splice(index, 1);
    this.setData({
      investData: this.data.investData
    });
  },
  cancel: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.investData[index].scrollLeft = 0;
    this.setData({
      investData: this.data.investData
    });
  },
  reset: function (e) {
    wx.clearStorageSync();
    this.setData({
      investData: []
    })
  },
  calculate: function (e) {
    var feeRate = e.detail.value.feeRate;
    var tradesRate = e.detail.value.tradesRate;
    if(feeRate == ''){
      return util.showMsg('','请输入手续费比例');
    }
    if (tradesRate == '') {
      return util.showMsg('', '请输入投资仓位');
    }
    tradesRate = parseFloat(tradesRate);
    if (tradesRate > 100) {
      return util.showMsg('', '投资仓位必须小于100%');
    }
    if (tradesRate == 0) {
      return util.showMsg('', '投资仓位必须大于0%');
    }
    var f = parseFloat(feeRate) / 100;
    var X = parseFloat(tradesRate);
    var m = 300;
    var PV = 0;
    var F = 0;
    var M = 0;
    var S = 0;
    var L = 0;
    var investArr = this.data.investData;
    if (investArr == '') {
      return util.showMsg('', '请输入投资信息');
    }
    investArr.forEach(function (item) {
      var li = parseFloat(item.p);
      var Li = parseFloat(item.b)/100;
      var Qi = parseFloat(item.k);
      var PVi = li * Qi * m;
      PV += PVi;
      L += PVi * Li;
      F += PVi * f;
      })
      M = (L * (100 - X)) / X;
      S = L + F + M;
      PV = isNaN(PV) ? 0 : PV;
      L = isNaN(L) ? 0 : L;
      M = isNaN(M) ? 0 : M;
      F = isNaN(F) ? 0 : F;
      S = isNaN(S) ? 0 : S;
      var prodValue = (parseFloat(PV) / 10000).toFixed(4);
      var sureAmt = (parseFloat(L) / 10000).toFixed(4);
      var prepareAmt = (parseFloat(M) / 10000).toFixed(4);
      var openFee = F.toFixed(2);
      var Sum = (parseFloat(S) / 10000).toFixed(4);
      var msg = '品种价值：' + prodValue + '万元\r\n'
        + '交易保证金：' + sureAmt + '万元\r\n'
        + '结算准备金：' + prepareAmt + '万元\r\n'
        + '开仓手续费：' + openFee + '元\r\n'
        + '总资金需求：' + Sum + '万元';
      util.showMsg('结果',msg);
  }
})