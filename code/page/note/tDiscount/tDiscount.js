var util = require("../../../common/kfc.js");
var node = require("../note.js");
Page({
  data: {
    array:['年利率','月利率','日利率'],
    index:0,
    interestDesc:'年利率（%）',
    fm:100,
    checkState: true
  },
  bindbDateChange: function (e) {
    this.setData({
      bDate: e.detail.value
    });
  },
  bindeDateChange: function (e) {
    this.setData({
      eDate: e.detail.value
    });
  },
  bindPickerChange:function(e)
  {
    if(e.detail.value == 0){
      this.setData({
        index: 0,
        interestDesc: '年利率（%）',
        fm: 100,
      });
    }
    if (e.detail.value == 1) {
      this.setData({
        index: 1,
        interestDesc: '月利率（‰）',
        fm:1000,
      });
    }
    if (e.detail.value == 2) {
      this.setData({
        index: 2,
        interestDesc: '日利率（ ‱）',
        fm:10000,
      });
    }
  },
  reset: function (e) {
    this.setData({
      checkState: true,
      bDate: '',
      eDate: '',
      index: 0,
      interestDesc: '年利率（%）',
      fm: 100
    })
  },
  calculate: function (e) {
    var fa = e.detail.value.fa;
    var bDate = e.detail.value.bDate;
    var eDate = e.detail.value.eDate;
    var interestRate = e.detail.value.interestRate;
    var three = e.detail.value.three;

    if (fa == '') {
      return util.showMsg('', '请输入票面金额')
    };
    if (bDate == '') {
      return util.showMsg('', '请输入转贴现日期')
    };
    if (eDate == '') {
      return util.showMsg('', '请输入票面到期日')
    };
    if (interestRate == '') {
      return util.showMsg('', '请输入月利率')
    };
    if (three == '') {
      return util.showMsg('', '请输入同城异地')
    };
    if (bDate >= eDate) {
      return util.showMsg('', '票面到期日必须大于贴现日')
    };
    wx.showToast({
      icon: "loading",
      duration: 5000
    })
    var endDate;
    fa = parseFloat(fa) * 10000;
    interestRate = parseFloat(interestRate) / this.data.fm;
    three = parseFloat(three);
    bDate = bDate;
    eDate = eDate;
    var pDate;
    pDate = new Date(eDate);
    pDate = new Date(pDate.getTime() - 24 * 60 * 60 * 1000);
    pDate = node.d2s(pDate);
    var desc = '';
    var params = new Object();
    params.app = 'life.workday_after_days';
    params.appkey = '28949';
    params.sign = '806a6739be4b2c79d7198f4efe0ef214';
    params.strdate = pDate;
    params.workday = '1';
    params.format = 'json';
    var ret;
    var dmy = 0;
    if(this.data.index == 0){
      dmy = 360
    }
    if (this.data.index == 1) {
      dmy = 30
    }
    if (this.data.index == 2) {
      dmy = 1
    }
    node.getWorkdayAfterDays({
      params: params,
      success: function (res) {
        if (res.statusCode.toString() == '200') {
          if (res.data.success.toString() == '1') {
            endDate = res.data.result['date'];
          }
          else {
            endDate = eDate;
            desc = eDate.toString().substr(0, 4) + '年节假日安排尚未公布';
          }
        }
        else {
          endDate = eDate;
          desc = eDate.toString().substr(0, 4) + '年节假日安排尚未公布';
        }
      },
      fail: function (res) {
        endDate = eDate;
        desc = '【以上结果为估算值】';
      },
      complete: function (res) {
        endDate = new Date(endDate);
        endDate = new Date(endDate.getTime() + three * 24 * 60 * 60 * 1000);
        var interestDays = util.getDateDiffDays(endDate, bDate);
        var putDays = util.getDateDiffDays(endDate, eDate);
        var interest = fa * (interestRate / dmy) * interestDays;
        interest = interest.toFixed(2);
        var disAmount = fa - interest;
        disAmount = disAmount.toFixed(2);
        endDate = node.d2s(endDate);
        var msg = '计息开始日：' + bDate + '\r\n';
        msg = msg + '计息到期日：' + endDate + '\r\n';
        msg = msg + '顺延天数：' + putDays + '天' + '\r\n';
        msg = msg + '计息天数：' + interestDays + '天' + '\r\n';
        msg = msg + '贴现利息：' + interest + '元' + '\r\n';
        msg = msg + '贴现金额：' + disAmount + '元';
        if (desc != '') {
          msg = msg + '\r\n' + desc;
        }
        wx.hideToast();
        util.showMsg('结果', msg);
      }
    })
  }
})
