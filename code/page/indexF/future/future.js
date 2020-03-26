// page/stock/profitLoss/bonus.js
Page({
  data: {
    array: [],
    index: 0,
    k: '',
    v: [],
    checkState:true
  },
  onLoad: function (options) {
    this.setData({
      k: options.k,
      v: options.v
    });
    if (options.k == 'cost')
    {
      this.setData({
        dkBlockState:false
      })
    }
    else
    {
      this.setData({
        dkBlockState:true
      })
    }
    var that = this;
    wx.request({
      url: 'https://hq.sinajs.cn/list=CFF_RE_LIST',
      success: function (res) {
        if (res.statusCode.toString() == '200') {
          var result = res.data;
          result = result.substr(result.indexOf("=") + 2, result.indexOf(";") - result.indexOf("=") - 3)
          result = result.split(",");
          that.setData({
            iBlockStateY: true,
            iBlockStateN: false,
            array: result
          });
        }
        else {
          that.setData({
            iBlockStateY: true,
            iBlockStateN: false
          });
        }
      },
      fail: function (res) {
        that.setData({
          iBlockStateY: true,
          iBlockStateN: false
        });
      },
      complete:function(res){
        price(that,0);
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index:e.detail.value
    });
    price(this,e.detail.value);
  },
  close: function (e) {
    wx.navigateBack();
  },
  set: function (e) {
    var data = e.detail.value;
    if(data.i == null){
      data.i = '投资品种';
    }
    else{
      data.i = this.data.array[data.i];
    }
    if(data.p == ''){
      data.p = 0;
    };
    if (data.b == '') {
      data.b = 0;
    };
    if (data.k == '') {
      data.k = 0;
    }
    if (data.rp == '') {
      data.rp = 0;
    }
    data.id = new Date().getTime();
    var dataArr;
    if (this.data.v == "\"\"") {
      dataArr = [];
    }
    else {
      dataArr = JSON.parse((Array)(this.data.v)[0]);
    }
    dataArr.push(data);
    wx.setStorageSync(this.data.k, dataArr);
    wx.navigateBack();
  }
})


function price (that,i){
  var url = 'https://hq.sinajs.cn/list=CFF_RE_' + that.data.array[i];
  wx.request({
    url: url,
    success: function (res) {
      if (res.statusCode.toString() == '200') {
        var result = res.data;
        result = result.substr(result.indexOf("=") + 2, result.indexOf(";") - result.indexOf("=") - 3);
        result = result.split(",");
        var newPrice = result[3];
        var uTime = result[36] + ' ' + result[37];
        that.setData({
          pBlockStateY: true,
          pBlockStateN: false,
          newPrice: newPrice,
          uTime: uTime
        })
      }
      else {
        that.setData({
          pBlockStateY: false,
          pBlockStateN: true
        })
      }
    },
    fail: function (res) {
      that.setData({
        pBlockStateY: false,
        pBlockStateN: true
      })
    }
  });
}