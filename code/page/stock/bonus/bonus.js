// page/stock/profitLoss/bonus.js
Page({
  data:{
    k:'',
    v:[]
  },
  onLoad: function (options) {
      this.setData({
        k: options.k,
        v: options.v
    });
    switch (options.k)
    {
      case 'psha':
      case 'bsha':
        {
          this.setData({
            currency:'元'
          });
        }
        break;
      case 'pshb':
      case 'bshb':
        {
          this.setData({
            currency: '美元'
          });
        }
        break;
      case 'psza':
      case 'bsza':
        {
          this.setData({
            currency: '元'
          });
        }
        break;
      case 'pszb':
      case 'bszb':
        {
          this.setData({
            currency: '港元'
          });
        }
        break;
    }
  },
  close: function (e) {
    wx.navigateBack();
  },
  set: function (e) {
    var data = e.detail.value;
    if(data.px == ''){
      data.px = 0;
    };
    if (data.sg == '') {
      data.sg = 0;
    };
    if (data.zzgb == '') {
      data.zzgb = 0;
    };
    data.id = new Date().getTime();
    var dataArr;
    if (this.data.v == "\"\"")
    {
      dataArr=[];
    }
    else
    {
      dataArr = JSON.parse((Array)(this.data.v)[0]);
    }
    dataArr.push(data);
    wx.setStorageSync(this.data.k, dataArr);
    wx.navigateBack();
  }
})