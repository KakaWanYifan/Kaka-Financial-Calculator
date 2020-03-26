function aCal(aBondValue, aBuyPrice, aExpireDays, aAnnualInterestRate)
{
  if(aBondValue == ''){
    return ['','请输入债券面值'];
  }
  if (aBuyPrice == '') {
    return ['','请输入买入价格'];
  }
  if (aExpireDays == '') {
    return ['','请输入到期时间'];
  }
  if (aAnnualInterestRate == '') {
    return ['','请输入票面年利率'];
  }
  var rnt;
  aBondValue = parseFloat(aBondValue);
  aBuyPrice = parseFloat(aBuyPrice);
  aExpireDays = parseFloat(aExpireDays);
  aAnnualInterestRate = parseFloat(aAnnualInterestRate)/100;
  rnt = (aBondValue + aBondValue * aAnnualInterestRate * aExpireDays / 365 - aBuyPrice) / (aBuyPrice * aExpireDays / 365) * 100;
  rnt = rnt.toFixed(2);
  rnt = '债券购买收益率：' + rnt + '%';
  return ['结果',rnt];
}

function bCal(bIssuePrice, bSellPrice, bHoldDays, bAnnualInterestRate)
{
  if (bIssuePrice == '') {
    return ['','请输入发行价格'];
  }
  if (bSellPrice == '') {
    return ['','请输入卖出价格'];
  }
  if (bHoldDays == '') {
    return ['','请输入持有时间'];
  }
  if (bAnnualInterestRate == '') {
    return ['','请输入票面年利率'];
  }
  var rnt;
  bIssuePrice = parseFloat(bIssuePrice);
  bSellPrice = parseFloat(bSellPrice);
  bHoldDays = parseFloat(bHoldDays);
  bAnnualInterestRate = parseFloat(bAnnualInterestRate)/100;
  rnt = ((bSellPrice - bIssuePrice + bHoldDays * bIssuePrice * bAnnualInterestRate / 365) / (bIssuePrice * bHoldDays / 365)) * 100;
  rnt = rnt.toFixed(2);
  rnt = '债券出售收益率为：' + rnt + '%';
  return ['结果',rnt];
}

function cCal(cBondValue, cBuyPrice, cSellPrice, cHoldDays, cAnnualInterestRate)
{
  if (cBondValue == '') {
    return ['','请输入债券面值'];
  }
  if (cBuyPrice == '') {
    return ['','请输入买入价格'];
  }
  if (cSellPrice == '') {
    return ['','请输入卖出价格'];
  }
  if (cHoldDays == '') {
    return ['','请输入持有时间'];
  }
  if (cAnnualInterestRate == '') {
    return ['','请输入票面年利率'];
  }
  var rnt;
  cBondValue = parseFloat(cBondValue);
  cBuyPrice = parseFloat(cBuyPrice);
  cSellPrice = parseFloat(cSellPrice);
  cHoldDays = parseFloat(cHoldDays);
  cAnnualInterestRate = parseFloat(cAnnualInterestRate)/100;
  rnt = ((cSellPrice - cBuyPrice + cBondValue * cAnnualInterestRate * cHoldDays / 365) / (cBuyPrice * cHoldDays / 365)) * 100;
  rnt = rnt.toFixed(2);
  rnt = '债券持有期间收益率为：' + rnt + '%';
  return ['结果',rnt];
}

module.exports = {
  aCal: aCal,
  bCal: bCal,
  cCal: cCal
}