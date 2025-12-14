import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Watchlist from "./Watchlist";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Area,
  Scatter,
} from "recharts";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useMarketStore } from "../store/marketStore";

// ----------------------- helpers -----------------------
const calcSMA = (data, period) => {
  if (!data || data.length === 0) return [];
  const sma = new Array(data.length).fill(null);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) sum -= data[i - period].close;
    if (i >= period - 1) sma[i] = sum / period;
  }
  return sma;
};

const calcEMA = (data, period) => {
  if (!data || data.length === 0) return [];
  const ema = new Array(data.length).fill(null);
  const k = 2 / (period + 1);
  let prevEma = null;
  for (let i = 0; i < data.length; i++) {
    const close = data[i].close;
    if (i === period - 1) {
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((s, d) => s + d.close, 0);
      prevEma = sum / period;
      ema[i] = prevEma;
    } else if (i >= period) {
      prevEma = close * k + prevEma * (1 - k);
      ema[i] = prevEma;
    }
  }
  return ema;
};

const calcMACD = (data, fast = 12, slow = 26, signal = 9) => {
  // returns object { macd, signalLine, histogram } with arrays same length as data
  const emaFast = calcEMA(data, fast);
  const emaSlow = calcEMA(data, slow);
  const macd = data.map((_, i) => {
    if (emaFast[i] == null || emaSlow[i] == null) return null;
    return emaFast[i] - emaSlow[i];
  });

  const signalLine = [];
  let prev = null;
  const k = 2 / (signal + 1);
  for (let i = 0; i < macd.length; i++) {
    const m = macd[i];
    if (m == null) signalLine.push(null);
    else if (prev == null) {
      const slice = macd
        .slice(Math.max(0, i - signal + 1), i + 1)
        .filter((v) => v != null);
      if (slice.length < signal) signalLine.push(null);
      else {
        const sma = slice.reduce((s, v) => s + v, 0) / slice.length;
        prev = sma;
        signalLine.push(prev);
      }
    } else {
      prev = m * k + prev * (1 - k);
      signalLine.push(prev);
    }
  }

  const histogram = macd.map((m, i) =>
    m != null && signalLine[i] != null ? m - signalLine[i] : null
  );

  return { macd, signalLine, histogram };
};

// ----------------------- ChartTerminal -----------------------
export default function ChartTerminal() {
  const { symbol: paramSymbol } = useParams();
  const navigate = useNavigate();

  const symbols = useMarketStore((s) => s.symbols);
  const updatePrices = useMarketStore((s) => s.updatePrices);

  // Buy/Sell functions & portfolio
  const buy = useMarketStore((s) => s.buy);
  const sell = useMarketStore((s) => s.sell);
  const portfolio = useMarketStore((s) => s.portfolio);

  const defaultSymbol = paramSymbol || (symbols && symbols[0]) || "BTCUSDT";
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // indicator toggles
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showEMA10, setShowEMA10] = useState(false);
  const [showEMA20, setShowEMA20] = useState(false);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showSpark, setShowSpark] = useState(true);
  const [showMACD, setShowMACD] = useState(true);
  const [candlesMode, setCandlesMode] = useState(false);

  // Buy/Sell quantity
  const [quantity, setQuantity] = useState("");

  // ------------------ trade markers ------------------
  // store markers { time: string, price: number, type: "BUY"|"SELL" }
  const [tradeMarkers, setTradeMarkers] = useState(() => []);

  // history
  const [history, setHistory] = useState(() => {
    const p = useMarketStore.getState().prices?.[defaultSymbol] ?? 100;
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    return Array.from({ length: 30 }).map(() => ({
      time: now,
      open: p,
      high: p,
      low: p,
      close: p,
      volume: Math.floor(Math.random() * 100000),
    }));
  });

  // ------------------- effects -------------------
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
      const current = useMarketStore.getState().prices?.[symbol] ?? 100;

      setHistory((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          open: +(current + (Math.random() - 0.5) * 1.5).toFixed(2),
          high: +(current + Math.random() * 2).toFixed(2),
          low: +(current - Math.random() * 2).toFixed(2),
          close: +current,
          volume: Math.floor(Math.random() * 400000) + 100,
        };
        return [...prev, newPoint].slice(-200);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [symbol, updatePrices]);

  // url param -> symbol
  useEffect(() => {
    if (paramSymbol && paramSymbol !== symbol) setSymbol(paramSymbol);
  }, [paramSymbol]);

  // ------------------- handlers -------------------
  const onSearchChange = (e) => {
    const v = e.target.value.toUpperCase();
    setSearch(v);
    setSuggestions(v ? symbols.filter((s) => s.startsWith(v)) : []);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim().toUpperCase();
    if (!q) return;
    if (symbols.includes(q)) selectSymbol(q);
  };

  const selectSymbol = (s) => {
    const p = useMarketStore.getState().prices?.[s] ?? 100;
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    const initial = Array.from({ length: 30 }).map(() => ({
      time: now,
      open: p,
      high: p,
      low: p,
      close: p,
      volume: Math.floor(Math.random() * 100000),
    }));
    setSymbol(s);
    setHistory(initial);
    navigate(`/chart/${s}`, { replace: true });
    setSearch("");
    setSuggestions([]);
    // reset markers for new symbol (optional)
    setTradeMarkers([]);
  };

  const handleBuy = () => {
    const q = Number(quantity);
    if (!q || q <= 0) return alert("Enter a valid quantity");
    buy(symbol, q);

    // add marker at latest price/time
    const last = history[history.length - 1];
    const price =
      last?.close ?? useMarketStore.getState().prices?.[symbol] ?? 0;
    const time =
      last?.time ?? new Date().toLocaleTimeString("en-US", { hour12: false });
    setTradeMarkers((prev) => [...prev, { time, price, type: "BUY" }]);

    setQuantity("");
  };

  const handleSell = () => {
    const q = Number(quantity);
    if (!q || q <= 0) return alert("Enter a valid quantity");
    sell(symbol, q);

    // add marker at latest price/time
    const last = history[history.length - 1];
    const price =
      last?.close ?? useMarketStore.getState().prices?.[symbol] ?? 0;
    const time =
      last?.time ?? new Date().toLocaleTimeString("en-US", { hour12: false });
    setTradeMarkers((prev) => [...prev, { time, price, type: "SELL" }]);

    setQuantity("");
  };

  // ------------------- derived data -------------------
  const closes = useMemo(() => history.map((d) => d.close), [history]);
  const sma20Values = useMemo(
    () => (showSMA20 ? calcSMA(history, 20) : []),
    [history, showSMA20]
  );
  const sma50Values = useMemo(
    () => (showSMA50 ? calcSMA(history, 50) : []),
    [history, showSMA50]
  );
  const ema10Values = useMemo(
    () => (showEMA10 ? calcEMA(history, 10) : []),
    [history, showEMA10]
  );
  const ema20Values = useMemo(
    () => (showEMA20 ? calcEMA(history, 20) : []),
    [history, showEMA20]
  );
  const ema50Values = useMemo(
    () => (showEMA50 ? calcEMA(history, 50) : []),
    [history, showEMA50]
  );

  // make macdObj robust to empty history
  const macdObj = useMemo(() => {
    try {
      return showMACD
        ? calcMACD(history)
        : { macd: [], signalLine: [], histogram: [] };
    } catch (e) {
      // fail safe
      return { macd: [], signalLine: [], histogram: [] };
    }
  }, [history, showMACD]);

  const sparkData = closes.slice(-40);
  const last = sparkData[sparkData.length - 1] ?? 0;
  const prev = sparkData[sparkData.length - 2] ?? last;
  const sparkUp = last >= prev;

  const upColor = "rgba(0,255,127,0.9)";
  const downColor = "rgba(255,82,82,0.9)";
  const priceLineColor = "#00eaff";
  const smaColor20 = "#ffaa00";
  const smaColor50 = "#ff66aa";
  const emaColor10 = "#9bd1ff";
  const emaColor20 = "#60d394";
  const emaColor50 = "#f4d35e";
  const macdColor = "#60a5fa";
  const macdSignalColor = "#f6c85f";

  const macdData = history.map((d, i) => ({
    time: d.time,
    macd: macdObj?.macd?.[i] ?? null,
    signal: macdObj?.signalLine?.[i] ?? null,
    hist: macdObj?.histogram?.[i] ?? null,
  }));

  const tooltipFormatter = (value, name) => [value, name];

  const exportCSV = (historyArr, filename = "history.csv") => {
    const rows = [["time", "open", "high", "low", "close", "volume"]];
    historyArr.forEach((p) =>
      rows.push([p.time, p.open, p.high, p.low, p.close, p.volume])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onExport = () => exportCSV(history, `${symbol}_history.csv`);

  // ------------------- custom scatter renderer for markers -------------------
  const renderMarker = (props) => {
    const { cx, cy, payload } = props;
    // draw a circle and tiny label
    const color = payload.type === "BUY" ? "#00ff99" : "#ff6b6b";
    const label = payload.type;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          stroke={color}
          strokeWidth={2}
          fill="transparent"
        />
        <text x={cx + 8} y={cy - 8} fill={color} fontSize={11} fontWeight="700">
          {label}
        </text>
      </g>
    );
  };

  // transform tradeMarkers to chart points (they must have same 'time' strings as XAxis ticks)
  // note: tradeMarkers are kept ephemeral in memory only for current symbol
  const markersForChart = tradeMarkers.map((m) => ({
    time: m.time,
    price: m.price,
    type: m.type,
  }));

  // ------------------- JSX -------------------
  return (
    <div className="flex bg-[#0d1117] min-h-screen text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* search + controls */}
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={onSearchSubmit} className="relative w-64">
            <input
              value={search}
              onChange={onSearchChange}
              placeholder="Search symbol..."
              className="p-2 bg-[#0b0f14] rounded-lg w-full text-white outline-none focus:ring-2 focus:ring-[#00ff99]"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-[#0b0f14] mt-1 rounded-lg shadow z-50 max-h-56 overflow-auto">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    className="p-2 cursor-pointer hover:bg-[#111827]"
                    onClick={() => selectSymbol(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={onExport}
              className="bg-[#0b0f14] border border-[#222] rounded px-3 py-1 text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* CHART CARD */}
          <div className="flex-1 bg-[#0b0f14] rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">{symbol} Chart</h2>
              <div className="text-sm text-[#9aa4af]">
                Last: <span className="font-mono">{last.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              {/* indicator checkboxes */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showSMA20}
                  onChange={() => setShowSMA20((v) => !v)}
                />{" "}
                SMA20
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showSMA50}
                  onChange={() => setShowSMA50((v) => !v)}
                />{" "}
                SMA50
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showEMA10}
                  onChange={() => setShowEMA10((v) => !v)}
                />{" "}
                EMA10
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showEMA20}
                  onChange={() => setShowEMA20((v) => !v)}
                />{" "}
                EMA20
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showEMA50}
                  onChange={() => setShowEMA50((v) => !v)}
                />{" "}
                EMA50
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showVolume}
                  onChange={() => setShowVolume((v) => !v)}
                />{" "}
                Volume
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={candlesMode}
                  onChange={() => setCandlesMode((v) => !v)}
                />{" "}
                Candles
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showMACD}
                  onChange={() => setShowMACD((v) => !v)}
                />{" "}
                MACD
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showSpark}
                  onChange={() => setShowSpark((v) => !v)}
                />{" "}
                Sparkline
              </label>
            </div>

            {/* main chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={history}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#9aa4af" minTickGap={25} />
                  <YAxis stroke="#9aa4af" />
                  <Tooltip
                    formatter={tooltipFormatter}
                    contentStyle={{
                      background: "#0b0f14",
                      border: "1px solid #222",
                    }}
                  />

                  {/* Price */}
                  {candlesMode ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="high"
                        stroke="none"
                        fill="rgba(255,255,255,0.02)"
                      />
                      <Line
                        dataKey="close"
                        stroke={priceLineColor}
                        dot={false}
                      />
                      <Bar
                        dataKey={(d) => Math.abs(d.close - d.open)}
                        barSize={8}
                      >
                        {history.map((entry, idx) => (
                          <Cell
                            key={`c-${idx}`}
                            fill={
                              entry.close >= entry.open ? upColor : downColor
                            }
                          />
                        ))}
                      </Bar>
                    </>
                  ) : (
                    <Line
                      dataKey="close"
                      stroke={priceLineColor}
                      dot={false}
                      strokeWidth={1.6}
                    />
                  )}

                  {/* SMA / EMA lines */}
                  {showSMA20 && (
                    <Line
                      dataKey="sma20"
                      stroke={smaColor20}
                      dot={false}
                      isAnimationActive={false}
                      data={history.map((d, i) => ({
                        ...d,
                        sma20: sma20Values[i],
                      }))}
                    />
                  )}
                  {showSMA50 && (
                    <Line
                      dataKey="sma50"
                      stroke={smaColor50}
                      dot={false}
                      isAnimationActive={false}
                      data={history.map((d, i) => ({
                        ...d,
                        sma50: sma50Values[i],
                      }))}
                    />
                  )}
                  {showEMA10 && (
                    <Line
                      dataKey="ema10"
                      stroke={emaColor10}
                      dot={false}
                      isAnimationActive={false}
                      data={history.map((d, i) => ({
                        ...d,
                        ema10: ema10Values[i],
                      }))}
                    />
                  )}
                  {showEMA20 && (
                    <Line
                      dataKey="ema20"
                      stroke={emaColor20}
                      dot={false}
                      isAnimationActive={false}
                      data={history.map((d, i) => ({
                        ...d,
                        ema20: ema20Values[i],
                      }))}
                    />
                  )}
                  {showEMA50 && (
                    <Line
                      dataKey="ema50"
                      stroke={emaColor50}
                      dot={false}
                      isAnimationActive={false}
                      data={history.map((d, i) => ({
                        ...d,
                        ema50: ema50Values[i],
                      }))}
                    />
                  )}

                  {/* volume */}
                  {showVolume && (
                    <Bar dataKey="volume" barSize={12}>
                      {history.map((entry, idx) => (
                        <Cell
                          key={`vol-${idx}`}
                          fill={entry.close >= entry.open ? upColor : downColor}
                        />
                      ))}
                    </Bar>
                  )}

                  {/* TRADE MARKERS (Scatter) */}
                  {markersForChart.length > 0 && (
                    <Scatter
                      data={markersForChart}
                      dataKey="price"
                      shape={renderMarker}
                      legendType="none"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* sparkline */}
            {showSpark && (
              <div className="mt-4 mb-4">
                <Sparklines data={sparkData} height={48}>
                  <SparklinesLine
                    color={sparkUp ? "#00ff99" : "#ff6b6b"}
                    style={{ strokeWidth: 2 }}
                  />
                </Sparklines>
              </div>
            )}

            {/* Buy/Sell panel */}
            <div className="grid grid-cols-3 gap-6 mt-2">
              <div>
                <h3 className="font-bold mb-2">Market Info</h3>
                <p className="text-sm text-[#cbd5e1]">
                  Price: <span className="font-mono">{last?.toFixed(2)}</span>
                </p>
                <p
                  className={`text-sm ${
                    sparkUp ? "text-[#00ff99]" : "text-[#ff6b6b]"
                  }`}
                >
                  {sparkUp ? "▲" : "▼"}{" "}
                  {(((last - prev) / (prev || last)) * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-[#9aa4af]">
                  Volume: {history.at(-1)?.volume ?? "-"}
                </p>
              </div>

              {/* BUY/SELL */}
              <div>
                <h3 className="font-bold mb-2">Buy / Sell</h3>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 bg-[#0d1117] rounded mb-2 outline-none text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleBuy}
                    className="flex-1 bg-[#00ff99] text-black p-2 rounded"
                  >
                    Buy
                  </button>
                  <button
                    onClick={handleSell}
                    className="flex-1 bg-[#ff6b6b] text-black p-2 rounded"
                  >
                    Sell
                  </button>
                </div>

                {/* Portfolio */}
                <div className="mt-2 text-sm text-[#cbd5e1]">
                  Portfolio: {portfolio[symbol] || 0} units
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Analysis</h3>
                <p className="text-sm text-[#9aa4af]">
                  SMA20/SMA50 & EMA lines live. MACD momentum below.
                </p>
              </div>
            </div>
          </div>

          {/* Watchlist */}
          <div className="w-72">
            <Watchlist onSelectSymbol={selectSymbol} />
          </div>
        </div>

        {/* MACD panel */}
        {showMACD && (
          <div className="bg-[#0b0f14] rounded-xl p-4 mt-2 shadow-md">
            <h4 className="font-bold mb-2">MACD (12,26,9)</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={macdData}>
                  <XAxis dataKey="time" stroke="#9aa4af" minTickGap={30} />
                  <YAxis stroke="#9aa4af" />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0f14",
                      border: "1px solid #222",
                    }}
                  />
                  <Line dataKey="macd" stroke={macdColor} dot={false} />
                  <Line dataKey="signal" stroke={macdSignalColor} dot={false} />
                  <Bar dataKey="hist" barSize={8}>
                    {macdData.map((d, i) => {
                      const h = d.hist;
                      const color =
                        h == null ? "#555" : h >= 0 ? upColor : downColor;
                      return <Cell key={`macd-${i}`} fill={color} />;
                    })}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
