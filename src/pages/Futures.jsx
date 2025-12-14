import React from "react";
import Sidebar from "../components/Sidebar";

const futuresContracts = ["ES1!", "NQ1!", "YM1!", "CL1!", "GC1!"]; // S&P, Nasdaq, Dow, Crude Oil, Gold

export default function Futures() {
  return (
    <div className="flex bg-primary min-h-screen text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-5">Futures</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-accent rounded-xl text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left">Contract</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Change</th>
                <th className="p-3 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {futuresContracts.map((c) => {
                const isUp = Math.random() > 0.5;
                return (
                  <tr
                    key={c}
                    className="border-b border-gray-700 hover:bg-secondary"
                  >
                    <td className="p-3">{c}</td>
                    <td className="p-3 text-right">
                      {(Math.random() * 5000).toFixed(2)}
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
