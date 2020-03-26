Page({
  data: {
    list: [
      {
        id: 'fund',
        name: '基金类',
        open: false,
        pages: [
                { path: 'fund', url: 'preSubscriptionFee', name: '基金认购费用' },
                { path: 'fund', url: 'subscriptionFee', name: '基金申购费用' },
                { path: 'fund', url: 'redemptionFee', name: '基金赎回费用' },
                { path: 'fund', url: 'closedEndFund', name: '封闭式基金投资损益' },
                { path: 'fund', url: 'income', name: '基金收益' }
               ]
      },
      {
        id: 'stock',
        name: '股票类',
        open: false,
        pages: [
          { path: 'stock', url: 'pe', name: '市盈率' },
          { path: 'stock', url: 'pb', name: '市净率' },
          { path: 'stock', url: 'charge', name: '交易手续率' },
          { path: 'stock', url: 'profitLoss', name: '投资损益' },
          { path: 'stock', url: 'breakeven', name: '保本卖出价' }
        ]
      },
      {
        id: 'bond',
        name: '债券类',
        open: false,
        pages: [
                  { path: 'bond', url: 'incomeRate', name: '债券收益率' },
                  { path: 'bond', url: 'maturityIncomeRate', name: '债券到期收益率' },
                  { path: 'bond', url: 'preSubRate', name: '债券认购收益率' },
                  { path: 'bond', url: 'holdPeriodRate', name: '债券持有期收益率' },
               ]
      },
      {
        id: 'future',
        name: '期货类',
        open: false,
        pages: [
                  { path: 'future', url: 'soybean', name: '豆类换算' },
                  { path: 'future', url: 'metal', name: '金属换算' },
                  { path: 'future', url: 'oil', name: '原油换算' },
                  { path: 'future', url: 'cotton', name: '棉花换算' },
                  { path: 'future', url: 'corn', name: '玉米换算' },
                  { path: 'future', url: 'wheat', name: '小麦换算' },
                  { path: 'future', url: 'rubber', name: '天胶换算' },
                  { path: 'future', url: 'sugar', name: '白糖换算' },
                  { path: 'future', url: 'pta', name: 'PTA换算' },
                  { path: 'future', url: 'palmoil', name: '棕榈油换算' },
                  { path: 'future', url: 'gold', name: '黄金换算' },
                  { path: 'future', url: 'silver', name: '白银换算' },
                  { path: 'future', url: 'coal', name: '焦煤换算' }
               ]
      },
      {
        id: 'indexF',
        name: '期指类',
        open: false,
        pages: [
          { path: 'indexF', url: 'cost', name: '投资成本' },
          { path: 'indexF', url: 'profitLoss', name: '投资损益' }
        ]
      },
      {
        id: 'note',
        name: '票据类',
        open: false,
        pages: [
          { path: 'note', url: 'discount', name: '贴现利息' },
          { path: 'note', url: 'tDiscount', name: '转贴现利息' }
        ]

      },
      {
        id: 'forex',
        name: '外汇类',
        open: false,
        pages: [
          { path: 'forex', url: 'purchasing', name: '购汇' },
          { path: 'forex', url: 'settlement', name: '结汇' }
        ]
      },
      {
        id: 'general',
        name: '综合类',
        open: false,
        pages: [
          { path: 'general', url: 'reserve', name: '存款准备金率调整影响' },
          { path: 'general', url: 'inflationC', name: '通货膨胀对消费的影响' },
          { path: 'general', url: 'inflationI', name: '通货膨胀对投资的影响' }
        ]
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})

