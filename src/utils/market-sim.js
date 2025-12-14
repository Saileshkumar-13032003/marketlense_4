// random walk simulation for price
export function randomWalk(prev) {
  const change = (Math.random() - 0.5) * 2; // -1 to +1
  return +(prev + change).toFixed(2);
}

// generates candles
export function generateCandle(prevCandle) {
  const open = prevCandle.close;
  const close = randomWalk(open);
  const high = Math.max(open, close) + Math.random();
  const low = Math.min(open, close) - Math.random();

  return {
    time: Date.now() / 1000,
    open,
    high: +high.toFixed(2),
    low: +low.toFixed(2),
    close,
  };
}
