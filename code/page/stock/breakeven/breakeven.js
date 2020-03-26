var util = require("../../../common/kfc.js");
Page({
  data: {
    array: [
      {
        'menuId': 0,
        'menu': '沪市A股',
        'k': 'bsha'
      },
      {
        'menuId': 1,
        'menu': '沪市B股',
        'k': 'bshb'
      },
      {
        'menuId': 2,
        'menu': '深市A股',
        'k': 'bsza'
      },
      {
        'menuId': 3,
        'menu': '深市B股',
        'k': 'bszb'
      }
    ],
    shaBlockState: true,
    shbBlockState: false,
    szaBlockState: false,
    szbBlockState: false,
    activeIndex: 0,
    bonus: 'view_hide',
    isBonus: false,
    bonusData: []
  },
  onShow: function () {
    // 页面显示
    var span = wx.getSystemInfoSync().windowWidth / this.data.array.length + 'px';
    this.setData({
      itemWidth: span
    });
    this.setData({
      bonusData: wx.getStorageSync(this.data.array[this.data.activeIndex].k)
    });
  },
  onUnload: function () {
    wx.clearStorageSync();
  },
  tabChange: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.clearStorageSync();
    this.setData({
      activeIndex: index,
      bonusData: [],
      bonus: 'view_hide'
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
  switchChange: function (e) {
    if (e.detail.value) {
      this.setData({
        bonus: 'view_show'
      });
    }
    else {
      this.setData({
        bonus: 'view_hide'
      });
    }
  },
  addBonus: function (e) {
    wx.navigateTo({
      url: '../bonus/bonus?k=' + e.currentTarget.dataset.k + '&v=' + JSON.stringify(this.data.bonusData)
    })
  },
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.bonusData[index].scrollLeft = 0;
    this.data.bonusData.splice(index, 1);
    this.setData({
      bonusData: this.data.bonusData
    });
  },
  cancel: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.bonusData[index].scrollLeft = 0;
    this.setData({
      bonusData: this.data.bonusData
    });
  },
  reset: function (e) {
    wx.clearStorageSync();
    this.setData({
      index: 0,
      shaBlockState: true,
      shbBlockState: false,
      szaBlockState: false,
      szbBlockState: false,
      bonus: 'view_hide',
      bonusData: []
    })
  },
  calculate: function (e) {
    var tradeType = this.data.activeIndex.toString();
    switch (tradeType) {
      case '0':
        {
          caseCalFuncOne(e, this.data.bonusData,0);
        }
        break;
      case '1':
        {
          caseCalFuncTwo(e, this.data.bonusData);
        }
        break;
      case '2':
        {
          caseCalFuncOne(e, this.data.bonusData, 2);
        }
        break;
      case '3':
        {
          caseCalFuncOne(e, this.data.bonusData, 3);
        }
        break;
    }
  }
})

//保本计算
function getPriceFuncOne(P0, V0, V, bonus, dt, t, y, b, max) {
  max = max || 5;
  //累加
  function calc(P, P0, V0, V, bonus, dt, t, y, b, max) {
    return (P0 * V0 + Math.max(max, P0 * V0 * y) + (b != 0 ? Math.max(1, V0 * b / 1000) : 0)
      + P * V * t + Math.max(max, P * V * y) + (b != 0 ? Math.max(1, V * b / 1000) : 0) - bonus + dt
    ) / P;
  }

  //初始参数
  var UP = P0 * 50, DOWN = 0.001, limit = 0.0001, X0 = (UP - DOWN) / 2, Vt = 0;

  do {
    Vt = calc(X0, P0, V0, V, bonus, dt, t, y, b, max);
    //取中值	
    if (Vt < V) {
      UP = X0;
      X0 = (UP + DOWN) / 2;
    } else {
      DOWN = X0;
      X0 = (UP + DOWN) / 2;
    }
  } while ((Math.abs(Vt - V) > 0.001) && (Math.abs(UP - DOWN) > limit))

  return X0;
}

function caseCalFuncOne(e, bonusArr,num) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var brokerRate = e.detail.value.brokerRate;
  var stampTax = e.detail.value.stampTax;
  var isBonus = e.detail.value.isBonus;
  var dividendTax = e.detail.value.dividendTax;
  if (buyPrice == '') {
    return util.showMsg('', '请输入买入价格');
  };
  if (buyAmt == '') {
    return util.showMsg('', '请输入买入数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (num != 2 && e.detail.value.transferFee == '') {
    if(num == 0)
    {
      return util.showMsg('', '请输入过户费费率');
    }
    else
    {
      return util.showMsg('', '请输入结算费费率');
    }
  }
  if (isBonus == true && dividendTax == '') {
    return util.showMsg('', '请输入股利所得税税率');
  };
  var P0 = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0 = parseFloat(buyAmt);
  var y = parseFloat(brokerRate) / 100;
  var t = parseFloat(stampTax) / 100;
  var T = parseFloat(dividendTax) / 100;
  var bonus = 0;
  var dt = 0;
  var P = 0;
  var b = 0;
  if (num == 2) { b = 0; }
  else { b = parseFloat(e.detail.value.transferFee)/100; }

  if (isBonus == true) {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg));
    });
  }
  P = getPriceFuncOne(P0, V0, V, bonus, dt, t, y, b);

  var msg = '';
  if(num == 3)
  {
    msg = '保本卖出价' + P.toFixed(2) + '港元'
  }
  else
  {
    msg = '保本卖出价' + P.toFixed(2) + '元'
  }
  util.showMsg('结果', msg);
}

function getPriceFuncTwo(P0, V0, V, bonus, dt, t, y, b, max) {
  max = max || 5;
  //累加
  function calc(P, P0, V0, V, bonus, dt, t, y, b, max) {
    return (P0 * V0 + Math.max(max, P0 * V0 * y) + (b != 0 ? Math.max(1, P0 * V0 * b) : 0)
      + P * V * t + Math.max(max, P * V * y) + (b != 0 ? Math.max(1, P * V * b) : 0) - bonus + dt
    ) / P;
  }

  //初始参数
  var UP = P0 * 50, DOWN = 0.001, limit = 0.0001, X0 = (UP - DOWN) / 2, Vt = 0;

  do {
    Vt = calc(X0, P0, V0, V, bonus, dt, t, y, b, max);
    //取中值	
    if (Vt < V) {
      UP = X0;
      X0 = (UP + DOWN) / 2;
    } else {
      DOWN = X0;
      X0 = (UP + DOWN) / 2;
    }
  } while ((Math.abs(Vt - V) > 0.001) && (Math.abs(UP - DOWN) > limit))

  return X0;
}	

function caseCalFuncTwo(e, bonusArr) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var brokerRate = e.detail.value.brokerRate;
  var stampTax = e.detail.value.stampTax;
  var transferFee = e.detail.value.transferFee;
  var isBonus = e.detail.value.isBonus;
  var dividendTax = e.detail.value.dividendTax;
  if (buyPrice == '') {
    return util.showMsg('', '请输入买入价格');
  };
  if (buyAmt == '') {
    return util.showMsg('', '请输入买入数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (transferFee == '') {
      return util.showMsg('', '请输入结算费费率');
  }
  if (isBonus == true && dividendTax == '') {
    return util.showMsg('', '请输入股利所得税税率');
  };
  var P0 = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0 = parseFloat(buyAmt);
  var y = parseFloat(brokerRate) / 100;
  var t = parseFloat(stampTax) / 100;
  var T = parseFloat(dividendTax) / 100;
  var b = parseFloat(transferFee) / 100;
  var bonus = 0;
  var dt = 0;
  var P = 0;

  if (isBonus == true) {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg));
    });
  }
  P = getPriceFuncTwo(P0, V0, V, bonus, dt, t, y, b, 1);

  var msg = '保本卖出价' + P.toFixed(2) + '美元'
  util.showMsg('结果', msg);
}