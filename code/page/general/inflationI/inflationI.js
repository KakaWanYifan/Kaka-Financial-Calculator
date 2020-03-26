var util = require("../../../common/kfc.js");
Page({
  reset:function(e)
  {

  },
  calculate: function (e) {
    var C = e.detail.value.C;
    var E = e.detail.value.E;
    var F = e.detail.value.F;
    var B = e.detail.value.B;
    if(C == ''){
      return util.showMsg('','请输入初始投资金额')
    };
    if (E == ''){
      return util.showMsg('', '请输入投资年限')
    };
    if (F == ''){
      return util.showMsg('', '请输入预期年收益率')
    };
    if (B == ''){
      return util.showMsg('', '请输入预期年通货膨胀率')
    };
    C = parseFloat(C);
    E = parseFloat(E);
    F = parseFloat(F)/100;
    B = parseFloat(B)/100;
    var D = 0,A = 0,G = 0;
    D = C * Math.pow(1 + F, E);
    D = D.toFixed(2);
    A = C * Math.pow((1 + F) / (1 + B), E);
    A = A.toFixed(2);
    G = (1 + F) / (1 + B) - 1;
    G = ((G*10000)/100).toFixed(2);
    util.showMsg('结果', '到期本利总额：' + D + '元\r\n' + '实际购买力：' + A + '元\r\n' + '实际收益率：' + G + '%');
  }
})