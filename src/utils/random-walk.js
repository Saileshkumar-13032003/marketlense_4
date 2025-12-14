// simple random walk generator helpers
export function nextPrice(prev, volatility = 0.002) {
  // volatility is fraction e.g. 0.002 => ~0.2% steps
  const rand = (Math.random() - 0.5) * 2;
  const change = prev * volatility * rand;
  return Math.max(prev + change, 0.0001);
}

export function generateSeries(start, points = 100, volatility = 0.002) {
  const series = [];
  let p = start;
  for (let i = 0; i < points; i++) {
    p = nextPrice(p, volatility);
    series.push(Number(p.toFixed(4)));
  }
  return series;
}
