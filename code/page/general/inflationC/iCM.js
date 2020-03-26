var util = require("../../../common/kfc.js");
Page({
  onLoad: function (options) {
    switch (options.m) {
      case 'a':
        {
          this.setData({
            aBlockState: true,
            bBlockState: false,
            inputTitle:'目前持有的现金金额（元）'
          });
        }
        break
      case 'b':
        {
          this.setData({
            aBlockState: false,
            bBlockState: true,
            inputTitle: '目前该种商品的价格（元）'
          });
        }
        break
    }
    this.setData({
      calType: options.m
    })
  },
  reset: function (e) {

  },
  calculate: function (e) {
    var calType = e.detail.value.calType;
    var years = e.detail.value.years;
    var volume = e.detail.value.volume;
    var rate = e.detail.value.rate;
    if (years == ''){
      return util.showMsg('','请输入年数');
    };
    if (volume == ''){
      if(calType == 'a')
      {
        return util.showMsg('', '请输入目前持有的现金金额');
      }
      else
      {
        return util.showMsg('', '请输入目前该种商品的价格:');
      }
    };
    if (rate == ''){
      return util.showMsg('', '请输入年通货膨胀率');
    };
    years = parseFloat(years);
    volume = parseFloat(volume);
    rate = parseFloat(rate)/100;
    if(calType == 'a')
    {
      var ret = volume/(Math.pow((1+rate),years))
      ret = ret.toFixed(2);
      util.showMsg('结果', years + '年后\r\n现金实际购买力价值\r\n' + ret + '元');
    }
    else
    {
      var ret = volume * (Math.pow((1 + rate), years))
      ret = ret.toFixed(2);
      util.showMsg('结果', years + '年后\r\n该种商品的价格\r\n' + ret + '元');
    }
  }
})