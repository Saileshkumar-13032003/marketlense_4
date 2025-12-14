import { createChart } from "lightweight-charts";
import { useMarketStore } from "../store/market-store";
import { useEffect, useRef } from "react";

export default function Chart() {
  const candles = useMarketStore((s) => s.candles);
  const ref = useRef();

  useEffect(() => {
    const chart = createChart(ref.current, {
      layout: { background: { color: "#000000" }, textColor: "white" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
    });
    const series = chart.addCandlestickSeries();

    series.setData(candles);

    const id = setInterval(() => {
      const last = candles[candles.length - 1];
      series.update(last);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <div ref={ref} className="h-full w-full" />;
}

// import { useEffect, useRef } from "react";
// import { createChart } from "lightweight-charts";
// import { useMarketStore } from "../store/market-store";
// import { useParams } from "react-router-dom";

// export default function ChartPage() {
//   const chartRef = useRef();
//   const { symbol } = useParams(); // e.g. BTCUSDT
//   const symbols = useMarketStore((s) => s.symbols);
//   const sym = symbols.find((x) => x.id === (symbol || "BTCUSDT")) || symbols[0];

//   useEffect(() => {
//     if (!chartRef.current || !sym) return;

//     const chart = createChart(chartRef.current, {
//       width: chartRef.current.clientWidth,
//       height: 400,
//       layout: {
//         backgroundColor: "#0f1113",
//         textColor: "#ddd",
//       },
//       grid: {
//         vertLines: { color: "#222" },
//         horzLines: { color: "#222" },
//       },
//     });

//     const series = chart.addLineSeries({
//       color: "#00e676",
//       lineWidth: 2,
//     });

//     // convert history to timeseries (use index as time)
//     const data = sym.history.map((value, idx) => ({ time: idx, value }));
//     series.setData(data);

//     function onResize() {
//       chart.applyOptions({ width: chartRef.current.clientWidth });
//     }
//     window.addEventListener("resize", onResize);

//     // update series every tick
//     const unsub = useMarketStore.subscribe(
//       (s) => s.lastTick,
//       () => {
//         const newSym = useMarketStore
//           .getState()
//           .symbols.find((x) => x.id === sym.id);
//         if (newSym) {
//           const newData = newSym.history.map((v, idx) => ({
//             time: idx,
//             value: v,
//           }));
//           series.setData(newData);
//         }
//       }
//     );

//     return () => {
//       unsub();
//       window.removeEventListener("resize", onResize);
//       chart.remove();
//     };
//   }, [sym?.id]);

//   return (
//     <div className="min-h-screen bg-[#0b0b0d] text-white p-6">
//       <div className="bg-[#0f1113] p-4 rounded border border-gray-800">
//         <div className="mb-3 flex justify-between items-center">
//           <div>
//             <div className="text-xs text-gray-400">Interactive Chart</div>
//             <div className="text-lg font-bold">{sym?.id}</div>
//           </div>
//           <div className="font-mono text-2xl">
//             {sym?.price?.toLocaleString()}
//           </div>
//         </div>

//         <div ref={chartRef} style={{ width: "100%" }} />
//       </div>
//     </div>
//   );
// }
