var requestHandler = {
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
}

//封装，方便调用
function getWorkdayAfterDays(requestHandler) {
  wx.request({
    url: 'https://sapi.k780.com',
    data: requestHandler.params,
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function (res) {
      requestHandler.fail(res)
    },
    complete: function (res) {
      requestHandler.complete(res)
    }
  })
}

function d2s(date)
{
  date = new Date(date);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + '-' + m + '-' +d;
}

module.exports = {
  getWorkdayAfterDays: getWorkdayAfterDays,
  d2s:d2s
}