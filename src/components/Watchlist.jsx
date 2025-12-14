import React, { useState } from "react";
import { useMarketStore } from "../store/marketStore";
import { motion } from "framer-motion";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function Watchlist({ onSelectSymbol }) {
  const symbols = useMarketStore((s) => s.symbols);
  const prices = useMarketStore((s) => s.prices);
  const pricesHistory = useMarketStore((s) => s.pricesHistory);

  const addSymbol = useMarketStore((s) => s.addSymbol);
  const removeSymbol = useMarketStore((s) => s.removeSymbol);

  const favorites = useMarketStore((s) => s.favorites);
  const toggleFavorite = useMarketStore((s) => s.toggleFavorite);

  const [showInput, setShowInput] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [search, setSearch] = useState("");

  // Filter symbols by search text
  const filtered = symbols.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newSymbol.trim()) return;

    addSymbol(newSymbol.toUpperCase());
    setNewSymbol("");
    setShowInput(false);
  };

  return (
    <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-xl">Watchlist</h2>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="bg-green-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-green-400"
        >
          + Add
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 rounded-md w-full bg-gray-800 text-white outline-none border border-gray-600"
      />

      {/* Add Symbol Input Box */}
      {showInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter symbol (e.g. AAPL)"
            className="px-2 py-2 rounded-md w-full bg-gray-800 text-white outline-none border border-gray-600"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 px-4 py-2 rounded-md text-white"
          >
            Add
          </button>
        </div>
      )}

      {/* SYMBOL LIST */}
      {filtered.map((sym) => {
        const history = pricesHistory[sym] || [];
        const lastPrice = history.length
          ? history[history.length - 1]
          : prices[sym] || 100;

        const prevPrice =
          history.length > 1 ? history[history.length - 2] : lastPrice;

        const isUp = lastPrice >= prevPrice;
        const change = prevPrice
          ? ((lastPrice - prevPrice) / prevPrice) * 100
          : 0;

        const isFav = favorites.includes(sym);

        return (
          <motion.div
            key={sym}
            className="flex justify-between items-center p-3 rounded-lg cursor-pointer
                       hover:bg-secondary transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* LEFT SIDE */}
            <div
              className="flex flex-col gap-1 w-full"
              onClick={() => onSelectSymbol(sym)}
            >
              {/* Symbol + Favorite */}
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{sym}</span>

                {/* Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(sym);
                  }}
                  className="text-yellow-400 text-xl"
                >
                  {isFav ? "★" : "☆"}
                </button>
              </div>

              {/* Sparkline chart */}
              <Sparklines data={history.slice(-40)} width={140} height={35}>
                <SparklinesLine
                  color={isUp ? "#00ff00" : "#ff4d4d"}
                  style={{ strokeWidth: 2 }}
                />
              </Sparklines>

              <span
                className={`text-sm ${
                  isUp ? "text-green-400" : "text-red-400"
                }`}
              >
                {isUp ? "+" : "-"}
                {change.toFixed(2)}%
              </span>
            </div>

            {/* PRICE + REMOVE BUTTON */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-white font-mono text-lg">
                ${lastPrice.toFixed(2)}
              </span>

              <button
                onClick={() => removeSymbol(sym)}
                className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 text-sm rounded-md"
              >
                Remove
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// import React, { useState } from "react";
// import { useMarketStore } from "../store/marketStore";
// import { motion } from "framer-motion";
// import { Sparklines, SparklinesLine } from "react-sparklines";

// export default function Watchlist({ onSelectSymbol }) {
//   const symbols = useMarketStore((s) => s.symbols);
//   const prices = useMarketStore((s) => s.prices);
//   const pricesHistory = useMarketStore((s) => s.pricesHistory);

//   const addSymbol = useMarketStore((s) => s.addSymbol);
//   const removeSymbol = useMarketStore((s) => s.removeSymbol);

//   const favorites = useMarketStore((s) => s.favorites);
//   const toggleFavorite = useMarketStore((s) => s.toggleFavorite);

//   const [showInput, setShowInput] = useState(false);
//   const [newSymbol, setNewSymbol] = useState("");
//   const [search, setSearch] = useState("");

//   // Filter symbols by search
//   const filtered = symbols.filter((s) =>
//     s.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = () => {
//     if (!newSymbol.trim()) return;

//     addSymbol(newSymbol.toUpperCase());
//     setNewSymbol("");
//     setShowInput(false);
//   };

//   return (
//     <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-lg">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-white font-bold text-xl">Watchlist</h2>

//         {/* ADD BUTTON */}
//         <button
//           onClick={() => setShowInput(!showInput)}
//           className="bg-green-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-green-400"
//         >
//           + Add
//         </button>
//       </div>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="px-3 py-2 rounded-md w-full text-black outline-none"
//       />

//       {/* Add Input */}
//       {showInput && (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newSymbol}
//             onChange={(e) => setNewSymbol(e.target.value)}
//             placeholder="Enter symbol (e.g. AAPL)"
//             className="px-2 py-1 rounded-md w-full text-black outline-none"
//           />
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 px-3 py-1 rounded-md text-white"
//           >
//             Add
//           </button>
//         </div>
//       )}

//       {/* SYMBOL LIST */}
//       {filtered.map((sym) => {
//         const history = pricesHistory[sym] || [];
//         const lastPrice = history.length
//           ? history[history.length - 1]
//           : prices[sym] || 100;

//         const prevPrice =
//           history.length > 1 ? history[history.length - 2] : lastPrice;

//         const isUp = lastPrice >= prevPrice;
//         const change = prevPrice
//           ? ((lastPrice - prevPrice) / prevPrice) * 100
//           : 0;

//         const isFav = favorites.includes(sym);

//         return (
//           <motion.div
//             key={sym}
//             className="flex justify-between items-center p-3 rounded-lg cursor-pointer
//                        hover:bg-secondary transition-transform hover:scale-105"
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//           >
//             {/* LEFT SIDE */}
//             <div
//               className="flex flex-col gap-1 w-full"
//               onClick={() => onSelectSymbol(sym)}
//             >
//               {/* Symbol + Favorite */}
//               <div className="flex justify-between items-center">
//                 <span className="text-white font-bold">{sym}</span>

//                 {/* Star Button (No library required) */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavorite(sym);
//                   }}
//                   className="text-yellow-400 text-lg"
//                 >
//                   {isFav ? "★" : "☆"}
//                 </button>
//               </div>

//               {/* Sparkline */}
//               <Sparklines data={history.slice(-40)} width={140} height={35}>
//                 <SparklinesLine
//                   color={isUp ? "#00ff00" : "#ff4d4d"}
//                   style={{ strokeWidth: 2 }}
//                 />
//               </Sparklines>

//               <span
//                 className={`text-sm ${
//                   isUp ? "text-green-400" : "text-red-400"
//                 }`}
//               >
//                 {isUp ? "+" : "-"}
//                 {change.toFixed(2)}%
//               </span>
//             </div>

//             {/* PRICE + REMOVE BUTTON */}
//             <div className="flex flex-col items-end gap-2">
//               <span className="text-white font-mono text-lg">
//                 ${lastPrice.toFixed(2)}
//               </span>

//               {/* Remove Button */}
//               <button
//                 onClick={() => removeSymbol(sym)}
//                 className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 text-sm rounded-md"
//               >
//                 Remove
//               </button>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

// // Full Watchlist component with:
// // ✔ Add symbol
// // ✔ Remove symbol
// // ✔ Reorder via drag & drop (DndKit)
// // ✔ Searchable dropdown
// // ✔ Favorite/star support

// import React, { useState, useRef, useEffect } from "react";
// import { useMarketStore } from "../store/marketStore";
// import { motion } from "framer-motion";
// import { Sparklines, SparklinesLine } from "react-sparklines";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SortableItem from "./SortableItem";
// import { Star } from "lucide-react";

// export default function Watchlist({ onSelectSymbol }) {
//   const symbols = useMarketStore((s) => s.symbols);
//   const prices = useMarketStore((s) => s.prices);
//   const pricesHistory = useMarketStore((s) => s.pricesHistory);
//   const addSymbol = useMarketStore((s) => s.addSymbol);
//   const removeSymbol = useMarketStore((s) => s.removeSymbol);
//   const reorderSymbols = useMarketStore((s) => s.reorderSymbols);
//   const favorites = useMarketStore((s) => s.favorites);
//   const toggleFavorite = useMarketStore((s) => s.toggleFavorite);

//   const [showInput, setShowInput] = useState(false);
//   const [newSymbol, setNewSymbol] = useState("");
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (showInput && inputRef.current) inputRef.current.focus();
//   }, [showInput]);

//   const filteredSymbols = symbols.filter((s) =>
//     s.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = () => {
//     const sym = newSymbol.trim().toUpperCase();
//     if (!sym) return;

//     if (symbols.includes(sym)) {
//       setError("Symbol already exists!");
//       return;
//     }

//     addSymbol(sym);
//     setNewSymbol("");
//     setError("");
//     setShowInput(false);
//   };

//   const onDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     const oldIndex = symbols.indexOf(active.id);
//     const newIndex = symbols.indexOf(over.id);

//     reorderSymbols(arrayMove(symbols, oldIndex, newIndex));
//   };

//   return (
//     <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-md">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-white font-bold text-xl">Watchlist</h2>

//         <button
//           onClick={() => setShowInput(!showInput)}
//           className="bg-green-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-green-400"
//         >
//           + Add
//         </button>
//       </div>

//       {/* SEARCH */}
//       <input
//         type="text"
//         placeholder="Search symbol..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="px-3 py-2 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
//       />

//       {/* INPUT FIELD */}
//       {showInput && (
//         <div className="flex flex-col gap-2">
//           <div className="flex gap-2">
//             <input
//               ref={inputRef}
//               type="text"
//               value={newSymbol}
//               onChange={(e) => {
//                 setNewSymbol(e.target.value.toUpperCase());
//                 setError("");
//               }}
//               placeholder="Enter symbol (e.g. AAPL)"
//               className="px-3 py-2 rounded-md w-full bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
//               onKeyDown={(e) => e.key === "Enter" && handleAdd()}
//             />

//             <button
//               onClick={handleAdd}
//               className="bg-blue-500 px-4 py-2 rounded-md text-white"
//             >
//               Add
//             </button>
//           </div>

//           {error && <div className="text-red-400 text-sm">{error}</div>}
//         </div>
//       )}

//       {/* REORDERABLE LIST */}
//       <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//         <SortableContext items={symbols} strategy={verticalListSortingStrategy}>
//           {filteredSymbols.map((sym) => {
//             const history = pricesHistory[sym] || [];

//             const lastPrice = history.length
//               ? history[history.length - 1]
//               : prices[sym] || 100;

//             const prevPrice =
//               history.length > 1 ? history[history.length - 2] : lastPrice;

//             const isUp = lastPrice >= prevPrice;
//             const changePercent =
//               prevPrice === 0 ? 0 : ((lastPrice - prevPrice) / prevPrice) * 100;

//             return (
//               <SortableItem key={sym} id={sym}>
//                 <motion.div
//                   className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-secondary transition-transform hover:scale-105"
//                   onClick={() => onSelectSymbol(sym)}
//                 >
//                   <div className="flex flex-col gap-1">
//                     <div className="flex items-center gap-2">
//                       <span className="text-white font-bold">{sym}</span>

//                       {/* FAVORITE */}
//                       <Star
//                         size={18}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleFavorite(sym);
//                         }}
//                         className={
//                           favorites.includes(sym)
//                             ? "text-yellow-400 fill-yellow-400"
//                             : "text-gray-400"
//                         }
//                       />
//                     </div>

//                     <Sparklines
//                       data={history.slice(-40)}
//                       width={140}
//                       height={35}
//                     >
//                       <SparklinesLine
//                         color={isUp ? "#00ff00" : "#ff4d4d"}
//                         style={{ strokeWidth: 2 }}
//                       />
//                     </Sparklines>

//                     <span
//                       className={`text-sm ${isUp ? "text-green" : "text-red"}`}
//                     >
//                       {isUp ? "+" : "-"}
//                       {changePercent.toFixed(2)}%
//                     </span>
//                   </div>

//                   {/* PRICE + REMOVE */}
//                   <div className="flex items-center gap-4">
//                     <span className="text-white font-mono text-lg">
//                       ${lastPrice.toFixed(2)}
//                     </span>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeSymbol(sym);
//                       }}
//                       className="text-red-400 hover:text-red-200"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </motion.div>
//               </SortableItem>
//             );
//           })}
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";
// import { useMarketStore } from "../store/marketStore";
// import { motion } from "framer-motion";
// import { Sparklines, SparklinesLine } from "react-sparklines";

// export default function Watchlist({ onSelectSymbol }) {
//   const symbols = useMarketStore((s) => s.symbols);
//   const prices = useMarketStore((s) => s.prices);
//   const pricesHistory = useMarketStore((s) => s.pricesHistory);
//   const addSymbol = useMarketStore((s) => s.addSymbol);

//   const [showInput, setShowInput] = useState(false);
//   const [newSymbol, setNewSymbol] = useState("");
//   const [error, setError] = useState("");

//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (showInput && inputRef.current) inputRef.current.focus();
//   }, [showInput]);

//   const handleAdd = () => {
//     const sym = newSymbol.trim().toUpperCase();
//     if (!sym) return;

//     // Prevent duplicates
//     if (symbols.includes(sym)) {
//       setError("Symbol already exists!");
//       return;
//     }

//     addSymbol(sym);
//     setNewSymbol("");
//     setError("");
//     setShowInput(false);
//   };

//   return (
//     <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-md">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-white font-bold text-xl">Watchlist</h2>

//         {/* ADD BUTTON */}
//         <button
//           onClick={() => setShowInput(!showInput)}
//           className="bg-green-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-green-400"
//         >
//           + Add
//         </button>
//       </div>

//       {/* INPUT FIELD */}
//       {showInput && (
//         <div className="flex flex-col gap-2">
//           <div className="flex gap-2">
//             <input
//               ref={inputRef}
//               type="text"
//               value={newSymbol}
//               onChange={(e) => {
//                 setNewSymbol(e.target.value.toUpperCase());
//                 setError("");
//               }}
//               placeholder="Enter symbol (e.g. AAPL)"
//               className="px-3 py-2 rounded-md w-full bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
//               onKeyDown={(e) => e.key === "Enter" && handleAdd()}
//             />

//             <button
//               onClick={handleAdd}
//               className="bg-blue-500 px-4 py-2 rounded-md text-white"
//             >
//               Add
//             </button>
//           </div>

//           {error && <div className="text-red-400 text-sm">{error}</div>}
//         </div>
//       )}

//       {/* SYMBOL LIST */}
//       {symbols.map((sym) => {
//         const history = pricesHistory[sym] || [];

//         const lastPrice = history.length
//           ? history[history.length - 1]
//           : prices[sym] || 100;

//         const prevPrice =
//           history.length > 1 ? history[history.length - 2] : lastPrice;

//         const isUp = lastPrice >= prevPrice;

//         const changePercent =
//           prevPrice === 0 ? 0 : ((lastPrice - prevPrice) / prevPrice) * 100;

//         return (
//           <motion.div
//             key={sym}
//             className="flex justify-between items-center p-3 rounded-lg cursor-pointer
//                        hover:bg-secondary transition-transform hover:scale-105"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => onSelectSymbol(sym)}
//           >
//             <div className="flex flex-col gap-1">
//               <span className="text-white font-bold">{sym}</span>

//               <Sparklines data={history.slice(-40)} width={140} height={35}>
//                 <SparklinesLine
//                   color={isUp ? "#00ff00" : "#ff4d4d"}
//                   style={{ strokeWidth: 2 }}
//                 />
//               </Sparklines>

//               <span className={`text-sm ${isUp ? "text-green" : "text-red"}`}>
//                 {isUp ? "+" : "-"}
//                 {changePercent.toFixed(2)}%
//               </span>
//             </div>

//             <span className="text-white font-mono text-lg">
//               ${lastPrice.toFixed(2)}
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useMarketStore } from "../store/marketStore";
// import { motion } from "framer-motion";
// import { Sparklines, SparklinesLine } from "react-sparklines";

// export default function Watchlist({ onSelectSymbol }) {
//   const symbols = useMarketStore((s) => s.symbols);
//   const prices = useMarketStore((s) => s.prices);
//   const pricesHistory = useMarketStore((s) => s.pricesHistory);
//   const addSymbol = useMarketStore((s) => s.addSymbol);

//   const [showInput, setShowInput] = useState(false);
//   const [newSymbol, setNewSymbol] = useState("");

//   const handleAdd = () => {
//     if (!newSymbol.trim()) return;

//     addSymbol(newSymbol.toUpperCase());
//     setNewSymbol("");
//     setShowInput(false);
//   };

//   return (
//     <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-md">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-white font-bold text-xl">Watchlist</h2>

//         {/* ADD BUTTON */}
//         <button
//           onClick={() => setShowInput(!showInput)}
//           className="bg-green-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-green-400"
//         >
//           + Add
//         </button>
//       </div>

//       {/* INPUT FIELD */}
//       {showInput && (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newSymbol}
//             onChange={(e) => setNewSymbol(e.target.value)}
//             placeholder="Enter symbol (e.g. AAPL)"
//             className="px-2 py-1 rounded-md w-full text-black outline-none"
//           />
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 px-3 py-1 rounded-md text-white"
//           >
//             Add
//           </button>
//         </div>
//       )}

//       {/* ITEMS */}
//       {symbols.map((sym) => {
//         const history = pricesHistory[sym] || [];

//         const lastPrice = history.length
//           ? history[history.length - 1]
//           : prices[sym] || 100;

//         const prevPrice =
//           history.length > 1 ? history[history.length - 2] : lastPrice;

//         const isUp = lastPrice >= prevPrice;

//         const changePercent =
//           prevPrice === 0 ? 0 : ((lastPrice - prevPrice) / prevPrice) * 100;

//         return (
//           <motion.div
//             key={sym}
//             className="flex justify-between items-center p-3 rounded-lg cursor-pointer
//                        hover:bg-secondary transition-transform hover:scale-105"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => onSelectSymbol(sym)}
//           >
//             <div className="flex flex-col gap-1">
//               <span className="text-white font-bold">{sym}</span>

//               {/* SPARKLINE */}
//               <Sparklines data={history.slice(-40)} width={140} height={35}>
//                 <SparklinesLine
//                   color={isUp ? "#00ff00" : "#ff4d4d"}
//                   style={{ strokeWidth: 2 }}
//                 />
//               </Sparklines>

//               {/* CHANGE */}
//               <span className={`text-sm ${isUp ? "text-green" : "text-red"}`}>
//                 {isUp ? "+" : "-"}
//                 {changePercent.toFixed(2)}%
//               </span>
//             </div>

//             {/* PRICE */}
//             <span className="text-white font-mono text-lg">
//               ${lastPrice.toFixed(2)}
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

// import React from "react";
// import { useMarketStore } from "../store/marketStore";
// import { motion } from "framer-motion";
// import { Sparklines, SparklinesLine } from "react-sparklines";

// export default function Watchlist({ onSelectSymbol }) {
//   const symbols = useMarketStore((s) => s.symbols);
//   const prices = useMarketStore((s) => s.prices);
//   const pricesHistory = useMarketStore((s) => s.pricesHistory);

//   return (
//     <div className="bg-accent p-5 rounded-xl flex flex-col gap-4 shadow-md">
//       <h2 className="text-white font-bold text-xl mb-2">Watchlist</h2>

//       {symbols.map((sym) => {
//         const history = pricesHistory[sym] || [];

//         // fallback to last price if history not enough
//         const lastPrice = history.length
//           ? history[history.length - 1]
//           : prices[sym] || 100;
//         const prevPrice =
//           history.length > 1 ? history[history.length - 2] : lastPrice;

//         const isUp = lastPrice >= prevPrice;
//         const changePercent = ((lastPrice - prevPrice) / prevPrice) * 100;

//         return (
//           <motion.div
//             key={sym}
//             className="flex justify-between items-center p-3 rounded-lg cursor-pointer
//                        hover:bg-secondary transition-transform transform hover:scale-105"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => onSelectSymbol(sym)}
//           >
//             {/* LEFT */}
//             <div className="flex flex-col gap-1">
//               <span className="text-white font-bold">{sym}</span>

//               {/* Sparkline synchronized with history */}
//               <Sparklines data={history.slice(-40)} width={140} height={35}>
//                 <SparklinesLine
//                   color={isUp ? "#00ff00" : "#ff4d4d"}
//                   style={{ strokeWidth: 2 }}
//                 />
//               </Sparklines>

//               <span className={`text-sm ${isUp ? "text-green" : "text-red"}`}>
//                 {isUp ? "+" : "-"}
//                 {changePercent.toFixed(2)}%
//               </span>
//             </div>

//             {/* PRICE */}
//             <span className="text-white font-mono text-lg">
//               ${lastPrice.toFixed(2)}
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }
