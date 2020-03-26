var util = require("../../../common/kfc.js");
Page({
  data: {
    array: ['进口大豆到岸成本', '进口豆粕到岸成本', '进口豆油到岸成本', '国产大豆压榨利润','进口大豆压榨利润'],
    index: 0,
    viewOneState:'view_show',
    viewTwoState: 'view_hide'
  },
  onLoad: function (options) {
    var that = this;
    var params = new Object();
    params.code = "USD";
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = (parseFloat(keySet['hui_in']) + parseFloat(keySet['hui_out'])) / 200;
          rate = rate.toFixed(4);
          var utime = '更新时间：' + keySet['day'] + ' ' + keySet['time'];
          that.setData({
            exchangeRate: rate,
            updatetime: utime,
            forex: 'view_show'
          });
        }
        else {
          that.setData({
            forex: 'view_hide',
            exchangeRate:''
          });
        }
      },
      fail: function (result) {
        that.setData({
          forex: 'view_hide',
          exchangeRate:''
        });
      },
    });
  },
  bindPickerChange:function(e)
  {
    this.setData({
      index:e.detail.value
    });
    if (e.detail.value <= 2)
    {
      this.setData({
        viewOneState: 'view_show',
        viewTwoState: 'view_hide'
      });
    }
    else
    {
      this.setData({
        viewOneState: 'view_hide',
        viewTwoState: 'view_show'
      });
    }
  },
  reset:function(e)
  {
    var that = this;
    this.setData({
      index: 0,
      viewOneState: 'view_show',
      viewTwoState: 'view_hide'
    });
    var params = new Object();
    params.code = "USD";
    util.getForex({
      params: params,
      success: function (result) {
        if (result.statusCode.toString() == '200') {
          var keySet = result.data.showapi_res_body.list[0];
          var rate = (parseFloat(keySet['hui_in']) + parseFloat(keySet['hui_out'])) / 200;
          rate = rate.toFixed(4);
          var utime = '更新时间：' + keySet['day'] + ' ' + keySet['time'];
          that.setData({
            exchangeRate: rate,
            updatetime: utime,
            forex: 'view_show'
          });
        }
        else {
          that.setData({
            forex: 'view_hide',
            exchangeRate: ''
          });
        }
      },
      fail: function (result) {
        that.setData({
          forex: 'view_hide',
          exchangeRate: ''
        });
      },
    });
  },
  calculate:function(e)
  {
    var calType = e.detail.value.calType;
    var carriage = e.detail.value.carriage;
    var tax = e.detail.value.tax;
    var addTax = e.detail.value.addTax;
    var basis = e.detail.value.basis;
    var exchangeRate = e.detail.value.exchangeRate;
    var quotation = e.detail.value.quotation;
    var soya = e.detail.value.soya;
    var pulp = e.detail.value.pulp;
    var oil = e.detail.value.oil;
    var prc = e.detail.value.prc;
    calType = parseInt(calType);
    if (calType <= 2)
    {
      if (exchangeRate == '') {
        return util.showMsg('', '请输入汇率');
      };
      if(carriage == ''){
        return util.showMsg('','请输入运费');
      };
      if (tax == '') {
        return util.showMsg('', '请输入关税税率');
      };
      if (addTax == '') {
        return util.showMsg('', '请输入增值税率');
      };
      if (basis == '') {
        return util.showMsg('', '请输入基差');
      };
      if (quotation == '') {
        return util.showMsg('', '请输入芝加哥盘面价');
      };
      carriage = parseFloat(carriage);
      tax = parseFloat(tax)/100;
      addTax = parseFloat(addTax)/100;
      basis = parseFloat(basis);
      exchangeRate = parseFloat(exchangeRate);
      quotation = parseFloat(quotation);
      var us;
      var cn;
      switch(calType)
      {
        case 0:
          {
            us = (quotation + basis) * 36.7437 * 0.01;
            cn = ((quotation + basis) * 36.7437 * 0.01 + carriage) * exchangeRate * (1+tax) * (1+addTax);
          }
        break;
        case 1:
          {
            us = (quotation + basis) * 1.1025;
            cn = ((quotation + basis) * 1.1025 + carriage) * exchangeRate * (1 + tax) * (1 + addTax);
          }
          break;
        case 2:
          {
            us = (quotation + basis) * 22.0462;
            cn = ((quotation + basis) * 22.0462 + carriage) * exchangeRate * (1 + tax) * (1 + addTax);
          }
          break;
      }
      us = us.toFixed(2);
      cn = cn.toFixed(2);
      util.showMsg('结果', '美国离岸成本：' + us + '美元/吨' + '\r\n' + '中国到岸成本：' + cn + '人民币/吨');
    }
    else
    {
      if (soya == '') {
        return util.showMsg('', '请输入大豆价格');
      };
      if (pulp == '') {
        return util.showMsg('', '请输入豆粕价格');
      };
      if (oil == '') {
        return util.showMsg('', '请输入豆油价格');
      };
      if (prc == '') {
        return util.showMsg('', '请输入加工费');
      };
      soya = parseFloat(soya);
      pulp = parseFloat(pulp);
      oil = parseFloat(oil);
      prc = parseFloat(prc);
      var rnt;
      var remark;
      switch(calType)
      {
        case 3:
          {
            rnt = oil * 0.165 + pulp * 0.79 - soya - prc;
            remark = '按出油率16.5%、出粕率79%计算';
          }
          break;
        case 4:
          {
            rnt = oil * 0.185 + pulp * 0.785 - soya - prc;
            remark = '按出油率18.5%、出粕率78.5%计算';
          }
          break;
      }
      rnt = rnt.toFixed(2);
      util.showMsg('结果', '压榨利润：' + rnt + '\r\n' + remark);
    }
  }
})