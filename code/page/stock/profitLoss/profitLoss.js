var util = require("../../../common/kfc.js");
Page({
  data: {
    array: [
      {
        'menuId': 0,
        'menu': '沪市A股',
        'k':'psha'
      },
      {
        'menuId': 1,
        'menu': '沪市B股',
        'k': 'pshb'
      },
      {
        'menuId': 2,
        'menu': '深市A股',
        'k':'psza'
      },
      {
        'menuId': 3,
        'menu': '深市B股',
        'k':'pszb'
      }
    ],
    shaBlockState: true,
    shbBlockState: false,
    szaBlockState: false,
    szbBlockState: false,
    activeIndex: 0,
    bonus: 'view_hide',
    isBonus:false,
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
  switchChange:function(e)
  {
    if(e.detail.value)
    {
      this.setData({
        bonus:'view_show'
      });
    }
    else
    {
      this.setData({
        bonus: 'view_hide'
      });
    }
  },
  addBonus:function(e){
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
      bonusData:[]
    })
  },
  calculate: function (e) {
    var tradeType = this.data.activeIndex.toString();
    switch (tradeType) {
      case '0':
        {
          caseZeroCal(e,this.data.bonusData);
        }
        break;
      case '1':
        {
          caseOneCal(e, this.data.bonusData);
        }
        break;
      case '2':
        {
          caseTwoCal(e, this.data.bonusData);
        }
        break;
      case '3':
        {
          caseThreeeCal(e, this.data.bonusData);
        }
        break;
    }
  }
})

function caseZeroCal(e,bonusArr) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var sellPrice = e.detail.value.sellPrice;
  var sellAmt = e.detail.value.sellAmt;
  var brokerRate = e.detail.value.brokerRate;
  var stampTax = e.detail.value.stampTax;
  var transferFee = e.detail.value.transferFee;
  var isBonus = e.detail.value.isBonus;
  var dividendTax = e.detail.value.dividendTax;
  if(buyPrice == ''){
    return util.showMsg('','请输入买入价格');
  };
  if (buyAmt == '') {
    return util.showMsg('', '请输入买入数量');
  };
  if (sellPrice == '') {
    return util.showMsg('', '请输入卖出价格');
  };
  if (sellAmt == '') {
    return util.showMsg('', '请输入卖出数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (transferFee == '') {
    return util.showMsg('', '请输入过户费费率');
  };
  if (isBonus == true && dividendTax == '')
  {
    return util.showMsg('','请输入股利所得税税率');
  };
  if (parseFloat(sellAmt) > parseFloat(buyAmt))
  {
    return util.showMsg('', '卖出数量必须小于或等于买入数量');
  }
  var P0  = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0  = parseFloat(buyAmt);
  var P1  = parseFloat(sellPrice);
  var V1  = parseFloat(sellAmt);
  var y = parseFloat(brokerRate)/100;
  var t = parseFloat(stampTax)/100;
  var b = parseFloat(transferFee);
  var T = parseFloat(dividendTax)/100;
  var bonus = 0;
  var dt = 0;
  if (isBonus == true)
  {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg)); 
    });
  }
  var B = P0 * V0 + Math.max(V0 * b, 1) + Math.max(P0 * V0 * y, 5);
  var tf = Math.max(V1 * b / 1000, 1) + Math.max(V0 * b / 1000, 1);
  var st = P1 * V1 * t;
  var baB = Math.max(P0 * V0 * y, 5);
  var baS = Math.max(P1 * V1 * y, 5);
  var ba = baB + baS;
  var sum = tf + st + ba + dt;
  var Ic = V * P1 - sum - V0 * P0 + bonus;
  var R = Ic / B * 100;

  var msg = '过户费：' + tf.toFixed(2) + '元\r\n'
          + '印花税：' + st.toFixed(2) + '元\r\n'
          + '券商佣金：' + ba.toFixed(2) + '元\r\n'
          + '股利所得税：' + dt.toFixed(2) + '元\r\n'
          + '税费合计：' + sum.toFixed(2) + '元\r\n'
          + '股利净额：' + bonus.toFixed(2) + '元\r\n'
          + '总体投资损益：' + Ic.toFixed(2) + '元\r\n'
          + '总体盈亏比例：' + R.toFixed(2) + '%';
  util.showMsg('结果',msg);
}

function caseOneCal(e,bonusArr) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var sellPrice = e.detail.value.sellPrice;
  var sellAmt = e.detail.value.sellAmt;
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
  if (sellPrice == '') {
    return util.showMsg('', '请输入卖出价格');
  };
  if (sellAmt == '') {
    return util.showMsg('', '请输入卖出数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (transferFee == '') {
    return util.showMsg('', '请输入结算费费率');
  };
  if (isBonus == true && dividendTax == '') {
    return util.showMsg('', '请输入股利所得税税率');
  };
  if (parseFloat(sellAmt) > parseFloat(buyAmt)) {
    return util.showMsg('', '卖出数量必须小于或等于买入数量');
  }
  var P0 = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0 = parseFloat(buyAmt);
  var P1 = parseFloat(sellPrice);
  var V1 = parseFloat(sellAmt);
  var y = parseFloat(brokerRate) / 100;
  var t = parseFloat(stampTax) / 100;
  var b = parseFloat(transferFee)/100;
  var T = parseFloat(dividendTax) / 100;
  var bonus = 0;
  var dt = 0;
  if (isBonus == true) {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg));
    });
  }
  var B = P0 * V0 + P0 * V0 * b + Math.max(P0 * V0 * y, 1);
  var tf = P1 * V1 * b + P0 * V0 * b;
  var st = P1 * V1 * t;
  var ba = Math.max(P0 * V0 * y, 1) + Math.max(P1 * V1 * y, 1);
  var sum = tf + st + ba + dt;
  var Ic = V * P1 - sum - V0 * P0 + bonus;
  var R = Ic / B * 100;

  var msg = '结算费：' + tf.toFixed(2) + '美元\r\n'
    + '印花税：' + st.toFixed(2) + '美元\r\n'
    + '券商佣金：' + ba.toFixed(2) + '美元\r\n'
    + '股利所得税：' + dt.toFixed(2) + '美元\r\n'
    + '税费合计：' + sum.toFixed(2) + '美元\r\n'
    + '股利净额：' + bonus.toFixed(2) + '美元\r\n'
    + '总体投资损益：' + Ic.toFixed(2) + '美元\r\n'
    + '总体盈亏比例：' + R.toFixed(2) + '%';
  util.showMsg('结果', msg);
}

function caseTwoCal(e, bonusArr) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var sellPrice = e.detail.value.sellPrice;
  var sellAmt = e.detail.value.sellAmt;
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
  if (sellPrice == '') {
    return util.showMsg('', '请输入卖出价格');
  };
  if (sellAmt == '') {
    return util.showMsg('', '请输入卖出数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (isBonus == true && dividendTax == '') {
    return util.showMsg('', '请输入股利所得税税率');
  };
  if (parseFloat(sellAmt) > parseFloat(buyAmt)) {
    return util.showMsg('', '卖出数量必须小于或等于买入数量');
  }
  var P0 = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0 = parseFloat(buyAmt);
  var P1 = parseFloat(sellPrice);
  var V1 = parseFloat(sellAmt);
  var y = parseFloat(brokerRate) / 100;
  var t = parseFloat(stampTax) / 100;
  var T = parseFloat(dividendTax) / 100;
  var bonus = 0;
  var dt = 0;
  if (isBonus == true) {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg));
    });
  }
  var B = P0 * V0 + Math.max(P0 * V0 * y, 5);
  var st = P1 * V1 * t;
  var ba = Math.max(P0 * V0 * y, 5) + Math.max(P1 * V1 * y, 5);
  var sum = st + ba + dt;
  var Ic = V * P1 - sum - V0 * P0 + bonus;
  var  R = Ic / B * 100;

  var msg = '印花税：' + st.toFixed(2) + '元\r\n'
    + '券商佣金：' + ba.toFixed(2) + '元\r\n'
    + '股利所得税：' + dt.toFixed(2) + '元\r\n'
    + '税费合计：' + sum.toFixed(2) + '元\r\n'
    + '股利净额：' + bonus.toFixed(2) + '元\r\n'
    + '总体投资损益：' + Ic.toFixed(2) + '元\r\n'
    + '总体盈亏比例：' + R.toFixed(2) + '%';
  util.showMsg('结果', msg);
}

function caseThreeeCal(e, bonusArr) {
  var buyPrice = e.detail.value.buyPrice;
  var buyAmt = e.detail.value.buyAmt;
  var sellPrice = e.detail.value.sellPrice;
  var sellAmt = e.detail.value.sellAmt;
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
  if (sellPrice == '') {
    return util.showMsg('', '请输入卖出价格');
  };
  if (sellAmt == '') {
    return util.showMsg('', '请输入卖出数量');
  };
  if (brokerRate == '') {
    return util.showMsg('', '请输入佣金比率');
  };
  if (stampTax == '') {
    return util.showMsg('', '请输入印花税税率');
  };
  if (transferFee == '') {
    return util.showMsg('', '请输入结算费费率');
  };
  if (isBonus == true && dividendTax == '') {
    return util.showMsg('', '请输入股利所得税税率');
  };
  if (parseFloat(sellAmt) > parseFloat(buyAmt)) {
    return util.showMsg('', '卖出数量必须小于或等于买入数量');
  }
  var P0 = parseFloat(buyPrice);
  var V = parseFloat(buyAmt);
  var V0 = parseFloat(buyAmt);
  var P1 = parseFloat(sellPrice);
  var V1 = parseFloat(sellAmt);
  var y = parseFloat(brokerRate) / 100;
  var t = parseFloat(stampTax) / 100;
  var b = parseFloat(transferFee)/100;
  var T = parseFloat(dividendTax) / 100;
  var bonus = 0;
  var dt = 0;
  if (isBonus == true) {
    bonusArr.forEach(function (item) {
      if (parseFloat(item.px) && !parseFloat(item.sg)) {
        bonus += V / 10 * parseFloat(item.px) * (1 - T);
        dt += V / 10 * parseFloat(item.px) * T;
      }
      V += V / 10 * (parseFloat(item.zzgb) + parseFloat(item.sg));
    });
  }
  var B = P0 * V0 + P0 * V0 * b + Math.max(P0 * V0 * y, 5);
  var tf = P1 * V1 * b + P0 * V0 * b;
  var st = P1 * V1 * t;
  var ba = Math.max(P0 * V0 * y, 5) + Math.max(P1 * V1 * y, 5);
  var sum = tf + st + ba + dt;
  var Ic = V * P1 - sum - V0 * P0 + bonus;
  var R = Ic / B * 100;

  var msg = '结算费：' + tf.toFixed(2) + '港元\r\n'
    + '印花税：' + st.toFixed(2) + '港元\r\n'
    + '券商佣金：' + ba.toFixed(2) + '港元\r\n'
    + '股利所得税：' + dt.toFixed(2) + '港元\r\n'
    + '税费合计：' + sum.toFixed(2) + '港元\r\n'
    + '股利净额：' + bonus.toFixed(2) + '港元\r\n'
    + '总体投资损益：' + Ic.toFixed(2) + '港元\r\n'
    + '总体盈亏比例：' + R.toFixed(2) + '%';
  util.showMsg('结果', msg);
}