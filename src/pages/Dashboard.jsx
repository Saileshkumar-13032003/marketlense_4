// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// const popularSymbols = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "NASDAQ", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
//   { name: "Apple", symbol: "AAPL" },
//   { name: "Bitcoin", symbol: "BTCUSDT" },
//   { name: "Ethereum", symbol: "ETHUSDT" },
//   { name: "Tesla", symbol: "TSLA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);

//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   const handleCardClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//   };

//   return (
//     <div className="bg-[#0d1117] min-h-screen text-white px-6 py-6">
//       {/* ---------------------- HEADER ---------------------- */}
//       <div className="flex justify-between items-center mb-8">
//         <motion.h1
//           className="text-4xl font-bold bg-linear-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           Market Dashboard
//         </motion.h1>

//         {/* 🔍 SEARCH */}
//         <form onSubmit={handleSearchSubmit} className="relative w-72">
//           <motion.input
//             type="text"
//             value={search}
//             onChange={handleSearchChange}
//             placeholder="Search symbol..."
//             className="p-3 rounded-xl bg-[#161b22] border border-white/10 w-full outline-none
//                        focus:ring-2 focus:ring-green-500 transition-all"
//             initial={{ width: "0%" }}
//             animate={{ width: "100%" }}
//             transition={{ duration: 0.4 }}
//           />

//           {/* Suggestions */}
//           {suggestions.length > 0 && (
//             <ul className="absolute top-full left-0 right-0 bg-[#1e2632] mt-1 rounded-xl border border-white/10 shadow-xl max-h-56 overflow-y-auto z-50">
//               {suggestions.map((s) => (
//                 <li
//                   key={s}
//                   className="p-2 cursor-pointer hover:bg-[#2b3445] transition"
//                   onClick={() => handleSuggestionClick(s)}
//                 >
//                   {s}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </form>
//       </div>

//       {/* ---------------------- TRENDING MARQUEE ---------------------- */}
//       <motion.div
//         className="flex gap-10 overflow-hidden py-4 border-y border-white/10 mb-10"
//         animate={{ x: ["0%", "-50%"] }}
//         transition={{
//           repeat: Infinity,
//           duration: 20,
//           ease: "linear",
//         }}
//       >
//         {popularSymbols.concat(popularSymbols).map((item, index) => {
//           const isUp = Math.random() > 0.5;
//           return (
//             <div key={index} className="flex items-center gap-2">
//               <p className="font-semibold">{item.symbol}</p>
//               <p className={isUp ? "text-green-400" : "text-red-400"}>
//                 {isUp ? "▲" : "▼"}
//                 {(Math.random() * 2).toFixed(2)}%
//               </p>
//             </div>
//           );
//         })}
//       </motion.div>

//       {/* ---------------------- POPULAR MARKET CARDS ---------------------- */}
//       <h2 className="text-2xl font-semibold mb-4">Popular Markets</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {popularSymbols.map((item) => {
//           const isUp = Math.random() > 0.5;
//           const price = (Math.random() * 40000).toFixed(2);
//           const percent = (Math.random() * 2).toFixed(2);

//           return (
//             <motion.div
//               key={item.symbol}
//               onClick={() => handleCardClick(item.symbol)}
//               className="p-5 rounded-2xl bg-linear-to-br from-[#151a24] to-[#1c2432]
//                          border border-white/10 shadow-lg cursor-pointer
//                          hover:border-green-500/40 hover:shadow-green-500/20
//                          transition-all backdrop-blur-xl"
//               whileHover={{ scale: 1.05, y: -4 }}
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <h3 className="text-lg font-bold mb-1">{item.name}</h3>
//               <p className="text-sm text-gray-400">{item.symbol}</p>

//               <div className="mt-4">
//                 <p className="text-2xl font-bold">{price}</p>
//                 <p
//                   className={`mt-1 text-sm ${
//                     isUp ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   {isUp ? "▲" : "▼"} {percent}%
//                 </p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { allSymbols } from "../store/allSymbols";

const popularSymbols = [
  { name: "Dow Jones", symbol: "DJI" },
  { name: "S&P 500", symbol: "SPX" },
  { name: "NASDAQ", symbol: "IXIC" },
  { name: "NYSE", symbol: "NYA" },
  { name: "AAPL", symbol: "AAPL" },
  { name: "BTCUSDT", symbol: "BTCUSDT" },
  { name: "ETHUSDT", symbol: "ETHUSDT" },
  { name: "TSLA", symbol: "TSLA" },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearch(value);

    if (value.length > 0) {
      const filtered = allSymbols.filter((s) => s.startsWith(value));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/chart/${search}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (symbol) => {
    navigate(`/chart/${symbol}`);
    setSearch("");
    setSuggestions([]);
  };

  const handleCardClick = (symbol) => {
    navigate(`/chart/${symbol}`);
  };

  return (
    <div className="flex bg-primary min-h-screen text-white">
      {/* IMPORTANT: Sidebar removed here */}

      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Dashboard
          </motion.h1>

          <form onSubmit={handleSearchSubmit} className="relative w-60">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search symbol..."
              className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
            />

            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    className="p-2 cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* Popular Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popularSymbols.map((item) => {
            const isUp = Math.random() > 0.5;
            return (
              <motion.div
                key={item.symbol}
                onClick={() => handleCardClick(item.symbol)}
                className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:scale-105"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p
                  className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
                >
                  {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {(Math.random() * 2).toFixed(2)}%
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// const popularSymbols = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "NASDAQ", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
//   { name: "AAPL", symbol: "AAPL" },
//   { name: "BTCUSDT", symbol: "BTCUSDT" },
//   { name: "ETHUSDT", symbol: "ETHUSDT" },
//   { name: "TSLA", symbol: "TSLA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);
//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   const handleCardClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />

//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4 relative">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           <form onSubmit={handleSearchSubmit} className="relative w-60">
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearchChange}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
//             />

//             {suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s}
//                     className="p-2 cursor-pointer hover:bg-secondary/80"
//                     onClick={() => handleSuggestionClick(s)}
//                   >
//                     {s}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </form>
//         </div>

//         {/* Popular Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {popularSymbols.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 onClick={() => handleCardClick(item.symbol)}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// const popularSymbols = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "NASDAQ", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
//   { name: "AAPL", symbol: "AAPL" },
//   { name: "BTCUSDT", symbol: "BTCUSDT" },
//   { name: "ETHUSDT", symbol: "ETHUSDT" },
//   { name: "TSLA", symbol: "TSLA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);
//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   const handleCardClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />

//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4 relative">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           <form onSubmit={handleSearchSubmit} className="relative w-60">
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearchChange}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
//             />

//             {suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s}
//                     className="p-2 cursor-pointer hover:bg-secondary/80"
//                     onClick={() => handleSuggestionClick(s)}
//                   >
//                     {s}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </form>
//         </div>

//         {/* Popular Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {popularSymbols.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 onClick={() => handleCardClick(item.symbol)}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* 🔥 Full Watchlist here */}
//         <Watchlist />

//         {/* Placeholder */}
//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// const popularSymbols = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "NASDAQ", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
//   { name: "AAPL", symbol: "AAPL" },
//   { name: "BTCUSDT", symbol: "BTCUSDT" },
//   { name: "ETHUSDT", symbol: "ETHUSDT" },
//   { name: "TSLA", symbol: "TSLA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);
//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   const handleCardClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />

//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4 relative">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           <form onSubmit={handleSearchSubmit} className="relative w-60">
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearchChange}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
//             />
//             {suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s}
//                     className="p-2 cursor-pointer hover:bg-secondary/80"
//                     onClick={() => handleSuggestionClick(s)}
//                   >
//                     {s}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </form>
//         </div>

//         {/* Popular Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {popularSymbols.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 onClick={() => handleCardClick(item.symbol)}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* 🔹 Compact Watchlist here */}
//         <Watchlist compact />

//         {/* Placeholder */}
//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// const popularSymbols = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "NASDAQ", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
//   { name: "AAPL", symbol: "AAPL" },
//   { name: "BTCUSDT", symbol: "BTCUSDT" },
//   { name: "ETHUSDT", symbol: "ETHUSDT" },
//   { name: "TSLA", symbol: "TSLA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);
//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   const handleCardClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />
//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Header + Search */}
//         <div className="flex justify-between items-center mb-4 relative">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           {/* Search Form */}
//           <form onSubmit={handleSearchSubmit} className="relative w-60">
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearchChange}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
//             />
//             {suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s}
//                     className="p-2 cursor-pointer hover:bg-secondary/80"
//                     onClick={() => handleSuggestionClick(s)}
//                   >
//                     {s}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <button type="submit" className="hidden">
//               Go
//             </button>
//           </form>
//         </div>

//         {/* Popular Symbols Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {popularSymbols.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 onClick={() => handleCardClick(item.symbol)}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Watchlist */}
//         <Watchlist />

//         {/* Chart Terminal Placeholder */}
//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";
// import { allSymbols } from "../store/allSymbols";

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setSearch(value);
//     if (value.length > 0) {
//       const filtered = allSymbols.filter((s) => s.startsWith(value));
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search}`);
//       setSearch("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (symbol) => {
//     navigate(`/chart/${symbol}`);
//     setSearch("");
//     setSuggestions([]);
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />
//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Header + Search */}
//         <div className="flex justify-between items-center mb-4 relative">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           {/* Search Form */}
//           <form onSubmit={handleSearchSubmit} className="relative w-60">
//             <input
//               type="text"
//               value={search}
//               onChange={handleSearchChange}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white w-full outline-none focus:ring-2 focus:ring-accent"
//             />
//             {suggestions.length > 0 && (
//               <ul className="absolute top-full left-0 right-0 bg-accent mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s}
//                     className="p-2 cursor-pointer hover:bg-secondary/80"
//                     onClick={() => handleSuggestionClick(s)}
//                   >
//                     {s}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <button type="submit" className="hidden">
//               Go
//             </button>
//           </form>
//         </div>

//         {/* Top Indices */}
//         {/* ... same as previous Dashboard code ... */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {["DJI", "SPX", "IXIC", "NYA"].map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         <Watchlist />

//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";

// const indices = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "Nasdaq", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
// ];

// export default function Dashboard() {
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/chart/${search.toUpperCase()}`);
//       setSearch("");
//     }
//   };

//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />
//       <div className="flex-1 p-6 flex flex-col gap-6">
//         {/* Dashboard Header */}
//         <div className="flex justify-between items-center mb-4">
//           <motion.h1
//             className="text-3xl font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             Dashboard
//           </motion.h1>

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="flex gap-2">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search symbol..."
//               className="p-2 rounded-lg bg-secondary text-white outline-none focus:ring-2 focus:ring-accent"
//             />
//             <button
//               type="submit"
//               className="bg-green px-4 rounded-lg hover:bg-green/80 transition"
//             >
//               Go
//             </button>
//           </form>
//         </div>

//         {/* Top Indices */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {indices.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         <Watchlist />

//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Watchlist from "../components/Watchlist";
// import { motion } from "framer-motion";

// const indices = [
//   { name: "Dow Jones", symbol: "DJI" },
//   { name: "S&P 500", symbol: "SPX" },
//   { name: "Nasdaq", symbol: "IXIC" },
//   { name: "NYSE", symbol: "NYA" },
// ];

// export default function Dashboard() {
//   return (
//     <div className="flex bg-primary min-h-screen text-white">
//       <Sidebar />
//       <div className="flex-1 p-6 flex flex-col gap-6">
//         <motion.h1
//           className="text-3xl font-bold mb-4"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           Dashboard
//         </motion.h1>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {indices.map((item) => {
//             const isUp = Math.random() > 0.5;
//             return (
//               <motion.div
//                 key={item.symbol}
//                 className="bg-accent p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-bold text-lg">{item.name}</h3>
//                 <p
//                   className={`mt-2 text-xl ${isUp ? "text-green" : "text-red"}`}
//                 >
//                   {(Math.random() * 40000).toFixed(2)} {isUp ? "▲" : "▼"}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {(Math.random() * 2).toFixed(2)}%
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>

//         <Watchlist />

//         <motion.div
//           className="bg-accent h-96 rounded-xl shadow-md flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-gray-400">Chart Terminal (simulated)</p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
