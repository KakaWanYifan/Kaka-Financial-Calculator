var util = require("../../../common/kfc.js");
Page({
  data: {
    investData: null
  },
  onShow: function () {
    this.setData({
      investData: wx.getStorageSync('prifitLoss')
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
    if (feeRate == '') {
      return util.showMsg('', '请输入手续费比例');
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
    var sumR = 0;
    var sumPVi0Li = 0;
    var sumF = 0;
    var R = 0;
    var F2 = 0;
    var R2 = 0
    var M2 = 0;
    var r = 0;
    var r2 = 0;
    var investArr = this.data.investData;
    if(investArr == ''){
      return util.showMsg('', '请输入投资信息');
    }
    investArr.forEach(function (item) {
      var li0 = parseFloat(item.p),   		//开仓价
        li = parseFloat(item.rp),   	//参考价
        Li = parseFloat(item.b) / 100,    		//保证金比例
        Di = (item.dk == '多') ? 1:-1,  				//开仓方向
        Qi = parseFloat(item.k);   			//开仓数量

      var PVi = li * Qi * m,
        PVi0 = li0 * Qi * m,
        Ri = (PVi - PVi0) * Di,
        Fi = PVi0 * f, //去除保证金比例
        Fi2 = PVi * f,
        PVi0Li = PVi0 * Li;

      PV += PVi;
      F += Fi;
      sumR += Ri;
      L += PVi * Li;
      sumPVi0Li += PVi0Li;
      F2 += Fi2;
    })
    R = sumR - F;   //浮动损益
    M = (sumPVi0Li * (100 - X)) / X;  //结算保证金
    S = L + F + M;
    r = (sumR / (sumPVi0Li + F)) * 100;
    M2 = R < 0 ? (M + R) : M;
    R2 = R - F2;
    r2 = (sumR / (sumPVi0Li + F + F2)) * 100;
    sumF = F + F2;
    PV = isNaN(PV)?0:PV;
    sumPVi0Li = isNaN(sumPVi0Li) ? 0 : sumPVi0Li;

    var prodValue = parseFloat(PV) / 10000;
    var sureAmt = parseFloat(sumPVi0Li)/10000;
    var prepareAmt = parseFloat(M2)/10000;
    var floatPlAmt = parseFloat(R)/10000;
    var floatPlRate = parseFloat(r);
    var plAmt = parseFloat(R2)/10000;
    var plRate = parseFloat(r2);
    var openFee = parseFloat(F);
    var Sum = parseFloat(sumF);

    prodValue = isNaN(prodValue) ? 0:prodValue;
    sureAmt = isNaN(sureAmt) ? 0:sureAmt;
    prepareAmt = isNaN(prepareAmt) ? 0:prepareAmt;
    floatPlAmt = isNaN(floatPlAmt)? 0: floatPlAmt;
    floatPlRate = isNaN(floatPlRate) ? 0: floatPlRate;
    plAmt = isNaN(plAmt) ? 0: plAmt;
    plRate = isNaN(plRate) ? 0: plRate;
    openFee = isNaN(openFee) ? 0: openFee;
    Sum = isNaN(Sum) ? 0 : Sum;
    var msg = '品种参照价值：' + prodValue.toFixed(4) + '万元\r\n'
      + '交易保证金：' + sureAmt.toFixed(4) + '万元\r\n'
      + '结算准备金：' + prepareAmt.toFixed(4) + '万元\r\n'
      + '开仓手续费：' + openFee.toFixed(2) + '元\r\n'
      + '浮动损益：' + floatPlAmt.toFixed(4) + '万元\r\n'
      + '盈亏比例：' + floatPlRate.toFixed(2) + '%\r\n'
      + '平仓损益：' + plAmt.toFixed(4) + '万元\r\n'
      + '平仓盈亏比例：' + plRate.toFixed(2) + '%\r\n'
      + '手续费合计：' + Sum.toFixed(2) + '元';
    if ((sumR + M) < 0) {
      msg = '本投资组合理论上已“爆仓”，期货公司会提前要求追加保证金，如资金不到位，将强行平仓。\r\n\r\n' + msg;
    }
    util.showMsg('结果',msg);
  }
})