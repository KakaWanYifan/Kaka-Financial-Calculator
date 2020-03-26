function Cal(x, w, m, EndCost, BondRate, Freq) {
  var y = 0;
  for (var i = 0; i <= m - 1; i++)
    y = y + ((EndCost * BondRate) / Freq) / Math.pow((1 + x / Freq), i + w);
  y = y + (EndCost / Math.pow((1 + x / Freq), (w + m - 1)));

  return y;
}

module.exports = {
  Cal: Cal
}