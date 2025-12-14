import React from "react";
import Sidebar from "../components/Sidebar";

const indicesData = [
  { name: "Dow Jones", symbol: "DJI" },
  { name: "S&P 500", symbol: "SPX" },
  { name: "Nasdaq", symbol: "IXIC" },
  { name: "NYSE", symbol: "NYA" },
  { name: "Russell 2000", symbol: "RUT" },
];

export default function Indices() {
  return (
    <div className="flex bg-primary min-h-screen text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-5">Major Indices</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-accent rounded-xl text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Change %</th>
              </tr>
            </thead>
            <tbody>
              {indicesData.map((idx) => {
                const isUp = Math.random() > 0.5;
                return (
                  <tr
                    key={idx.symbol}
                    className="border-b border-gray-700 hover:bg-secondary"
                  >
                    <td className="p-3">{idx.name}</td>
                    <td className="p-3 text-right">
                      {(Math.random() * 40000).toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-right ${
                        isUp ? "text-green" : "text-red"
                      }`}
                    >
                      {isUp ? "▲" : "▼"}
                      {(Math.random() * 2).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
