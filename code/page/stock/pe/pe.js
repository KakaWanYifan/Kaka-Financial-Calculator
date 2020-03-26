var util = require("../../../common/kfc.js");
Page({
  reset: function (e) {
  },
  calculate: function (e) {
    var price = e.detail.value.price;
    var profit = e.detail.value.profit;
    if(price == ''){
      return util.showMsg('','请输入股票价格');
    };
    if (profit == '') {
      return util.showMsg('', '请输入每股税后利润');
    };
    price = parseFloat(price);
    profit = parseFloat(profit);
    var ret = price/profit * 100;
    ret = ret.toFixed(2);
    util.showMsg('结果','市盈率：' + ret + '%');
  }
})