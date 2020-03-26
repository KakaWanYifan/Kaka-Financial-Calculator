var util = require("../../../common/kfc.js");
Page({
  reset: function (e) {
  },
  calculate: function (e) {
    var p = e.detail.value.p;
    var bv = e.detail.value.bv;
    if (p == '') {
      return util.showMsg('', '请输入每股市价');
    };
    if (bv == '') {
      return util.showMsg('', '请输入每股净资产');
    };
    p = parseFloat(p);
    bv = parseFloat(bv);
    var ret = p / bv * 100;
    ret = ret.toFixed(2);
    util.showMsg('结果', '市净率：' + ret + '%');
  }
})