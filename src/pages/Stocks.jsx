import React from "react";
import Sidebar from "../components/Sidebar";

const stockSymbols = ["AAPL", "GOOG", "MSFT", "TSLA", "AMZN"];

export default function Stocks() {
  return (
    <div className="flex bg-primary min-h-screen text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-5">Stocks</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-accent rounded-xl text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Change</th>
                <th className="p-3 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockSymbols.map((sym) => {
                const isUp = Math.random() > 0.5;
                return (
                  <tr
                    key={sym}
                    className="border-b border-gray-700 hover:bg-secondary"
                  >
                    <td className="p-3">{sym}</td>
                    <td className="p-3 text-right">
                      ${(Math.random() * 1000).toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-right ${
                        isUp ? "text-green" : "text-red"
                      }`}
                    >
                      {isUp ? "▲" : "▼"}
                      {(Math.random() * 5).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right">
                      {(Math.random() * 1000000).toFixed(0)}
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
