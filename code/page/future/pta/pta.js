var util = require("../../../common/kfc.js");
Page({
  reset:function(e)
  {

  },
  calculate:function(e)
  {
    var a = e.detail.value.a;
    var b = e.detail.value.b;
    if(a == ''){
      util.showMsg('','请输入PX价');
    }
    if (b == '') {
      util.showMsg('', '请输入费用');
    }
    a = parseFloat(a);
    b = parseFloat(b);
    var res = 0.655 * a + b;
    res = res.toFixed(2);
    util.showMsg('结果', '成本：' + res + '元/吨');
  }
})