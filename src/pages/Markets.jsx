import React from "react";
import Sidebar from "../components/Sidebar";

export default function Markets() {
  return (
    <div className="flex bg-primary min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-5">Markets Overview</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["AAPL", "BTCUSDT", "ETHUSDT", "EURUSD"].map((sym) => (
            <div key={sym} className="bg-accent p-4 rounded-xl">
              <h2 className="text-white font-bold">{sym}</h2>
              <p className="text-green">
                Price: ${(Math.random() * 10000).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
