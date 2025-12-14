import { create } from "zustand";

export const useMarketStore = create((set, get) => ({
  // ------------------------------------
  // SYMBOL LIST
  // ------------------------------------
  symbols: [
    "AAPL",
    "GOOG",
    "MSFT",
    "TSLA",
    "BTCUSDT",
    "ETHUSDT",
    "EURUSD",
    "USDJPY",
  ],

  // ------------------------------------
  // FAVORITES SUPPORT ⭐
  // ------------------------------------
  favorites: [],

  toggleFavorite: (symbol) =>
    set((state) => {
      const isFav = state.favorites.includes(symbol);
      return {
        favorites: isFav
          ? state.favorites.filter((s) => s !== symbol)
          : [...state.favorites, symbol],
      };
    }),

  // ------------------------------------
  // LAST KNOWN PRICES (new)
  // ------------------------------------
  lastKnown: {
    AAPL: 150,
    GOOG: 2800,
    MSFT: 300,
    TSLA: 700,
    BTCUSDT: 30000,
    ETHUSDT: 2000,
    EURUSD: 1.1,
    USDJPY: 150,
  },

  // ------------------------------------
  // ADD SYMBOL (updated)
  // ------------------------------------
  addSymbol: (sym) =>
    set((state) => {
      const s = sym.toUpperCase();

      // avoid duplicates
      if (state.symbols.includes(s)) return state;

      // load last known price if exists, else default
      const basePrice = state.lastKnown[s] ?? 100;

      return {
        symbols: [...state.symbols, s],

        prices: {
          ...state.prices,
          [s]: basePrice,
        },

        pricesHistory: {
          ...state.pricesHistory,
          [s]: Array(30).fill(basePrice),
        },
      };
    }),

  // ------------------------------------
  // REMOVE SYMBOL (unchanged; lastKnown not deleted)
  // ------------------------------------
  removeSymbol: (symbol) =>
    set((state) => {
      return {
        symbols: state.symbols.filter((s) => s !== symbol),
        favorites: state.favorites.filter((s) => s !== symbol),

        prices: Object.fromEntries(
          Object.entries(state.prices).filter(([k]) => k !== symbol)
        ),

        pricesHistory: Object.fromEntries(
          Object.entries(state.pricesHistory).filter(([k]) => k !== symbol)
        ),
      };
    }),

  // ------------------------------------
  // PRICES
  // ------------------------------------
  prices: {
    AAPL: 150,
    GOOG: 2800,
    MSFT: 300,
    TSLA: 700,
    BTCUSDT: 30000,
    ETHUSDT: 2000,
    EURUSD: 1.1,
    USDJPY: 150,
  },

  // ------------------------------------
  // PRICE HISTORY
  // ------------------------------------
  pricesHistory: {},

  // ------------------------------------
  // INITIALIZE HISTORY
  // ------------------------------------
  initHistory: () => {
    const state = get();
    const history = {};
    state.symbols.forEach((sym) => {
      history[sym] = Array(30).fill(state.prices[sym]);
    });
    set({ pricesHistory: history });
  },

  // ------------------------------------
  // UPDATE PRICES + HISTORY (updated)
  // ------------------------------------
  updatePrices: () => {
    const state = get();
    const newPrices = { ...state.prices };
    const newHistory = { ...state.pricesHistory };
    const lastKnown = { ...state.lastKnown };

    Object.keys(newPrices).forEach((sym) => {
      // random walk
      newPrices[sym] = +(
        newPrices[sym] *
        (1 + (Math.random() - 0.5) / 100)
      ).toFixed(2);

      // history bucket
      if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
      else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];

      // ⬅️ always update lastKnown
      lastKnown[sym] = newPrices[sym];
    });

    set({ prices: newPrices, pricesHistory: newHistory, lastKnown });
  },

  // ------------------------------------
  // PORTFOLIO
  // ------------------------------------
  portfolio: {},

  // TRADE LOG
  trades: {},

  // ------------------------------------
  // BUY
  // ------------------------------------
  buy: (symbol, qty) => {
    if (!qty || qty <= 0) return;

    const state = get();
    const price = state.prices[symbol];

    const port = { ...state.portfolio };
    port[symbol] = (port[symbol] || 0) + qty;

    const tlist = state.trades[symbol] || [];
    tlist.push({
      side: "buy",
      qty,
      price,
      index: (state.pricesHistory[symbol] || []).length - 1,
      timestamp: Date.now(),
    });

    set({
      portfolio: port,
      trades: { ...state.trades, [symbol]: tlist },
    });
  },

  // ------------------------------------
  // SELL
  // ------------------------------------
  sell: (symbol, qty) => {
    if (!qty || qty <= 0) return;

    const state = get();
    const price = state.prices[symbol];
    const port = { ...state.portfolio };

    if (!port[symbol] || port[symbol] < qty) {
      console.log(`Not enough ${symbol} to sell`);
      return;
    }

    port[symbol] -= qty;

    const tlist = state.trades[symbol] || [];
    tlist.push({
      side: "sell",
      qty,
      price,
      index: (state.pricesHistory[symbol] || []).length - 1,
      timestamp: Date.now(),
    });

    set({
      portfolio: port,
      trades: { ...state.trades, [symbol]: tlist },
    });
  },
}));

// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   // ------------------------------------
//   // SYMBOL LIST
//   // ------------------------------------
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],

//   // ------------------------------------
//   // FAVORITES SUPPORT ⭐
//   // ------------------------------------
//   favorites: [],

//   toggleFavorite: (symbol) =>
//     set((state) => {
//       const isFav = state.favorites.includes(symbol);
//       return {
//         favorites: isFav
//           ? state.favorites.filter((s) => s !== symbol)
//           : [...state.favorites, symbol],
//       };
//     }),

//   // ------------------------------------
//   // ADD SYMBOL
//   // ------------------------------------
//   addSymbol: (sym) =>
//     set((state) => {
//       const s = sym.toUpperCase();

//       if (state.symbols.includes(s)) return state;

//       return {
//         symbols: [...state.symbols, s],

//         prices: {
//           ...state.prices,
//           [s]: 100,
//         },

//         pricesHistory: {
//           ...state.pricesHistory,
//           [s]: Array(30).fill(100),
//         },
//       };
//     }),

//   // ------------------------------------
//   // REMOVE SYMBOL
//   // ------------------------------------
//   removeSymbol: (symbol) =>
//     set((state) => {
//       return {
//         symbols: state.symbols.filter((s) => s !== symbol),
//         favorites: state.favorites.filter((s) => s !== symbol),

//         prices: Object.fromEntries(
//           Object.entries(state.prices).filter(([k]) => k !== symbol)
//         ),

//         pricesHistory: Object.fromEntries(
//           Object.entries(state.pricesHistory).filter(([k]) => k !== symbol)
//         ),
//       };
//     }),

//   // ------------------------------------
//   // PRICES
//   // ------------------------------------
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },

//   // ------------------------------------
//   // PRICE HISTORY
//   // ------------------------------------
//   pricesHistory: {},

//   // ------------------------------------
//   // INITIALIZE HISTORY
//   // ------------------------------------
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // ------------------------------------
//   // UPDATE PRICES + HISTORY
//   // ------------------------------------
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((sym) => {
//       newPrices[sym] = +(
//         newPrices[sym] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
//       else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },

//   // ------------------------------------
//   // PORTFOLIO
//   // ------------------------------------
//   portfolio: {},

//   // TRADE LOG
//   trades: {},

//   // ------------------------------------
//   // BUY
//   // ------------------------------------
//   buy: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];

//     const port = { ...state.portfolio };
//     port[symbol] = (port[symbol] || 0) + qty;

//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "buy",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });
//   },

//   // ------------------------------------
//   // SELL
//   // ------------------------------------
//   sell: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];
//     const port = { ...state.portfolio };

//     if (!port[symbol] || port[symbol] < qty) {
//       console.log(`Not enough ${symbol} to sell`);
//       return;
//     }

//     port[symbol] -= qty;

//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "sell",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });
//   },
// }));

// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   // Symbols
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],

//   // ➕ ADD SYMBOL SUPPORT (THIS WAS MISSING)
//   addSymbol: (sym) =>
//     set((state) => {
//       const s = sym.toUpperCase();

//       // Avoid duplicates
//       if (state.symbols.includes(s)) return state;

//       return {
//         symbols: [...state.symbols, s],
//         prices: {
//           ...state.prices,
//           [s]: 100, // default price
//         },
//         pricesHistory: {
//           ...state.pricesHistory,
//           [s]: Array(30).fill(100), // default sparkline
//         },
//       };
//     }),

//   // Current prices
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },

//   // Historical prices for sparklines
//   pricesHistory: {},

//   // Portfolio: how many units owned
//   portfolio: {},

//   // Trade history for chart markers
//   trades: {},

//   // Initialize price history (fill last 30 points)
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // Update prices & history every second
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((sym) => {
//       // Random walk simulation
//       newPrices[sym] = +(
//         newPrices[sym] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       // Update history
//       if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
//       else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },

//   // BUY function
//   buy: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];

//     // Update portfolio
//     const port = { ...state.portfolio };
//     port[symbol] = (port[symbol] || 0) + qty;

//     // Log trade
//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "buy",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });

//     console.log(`Bought ${qty} of ${symbol} @ ${price}`);
//   },

//   // SELL function
//   sell: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];
//     const port = { ...state.portfolio };

//     // Validate portfolio
//     if (!port[symbol] || port[symbol] < qty) {
//       console.log(`Not enough ${symbol} to sell`);
//       return;
//     }

//     port[symbol] -= qty;

//     // Log trade
//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "sell",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });

//     console.log(`Sold ${qty} of ${symbol} @ ${price}`);
//   },
// }));

// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   // Symbols
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],

//   // Current prices
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },

//   // Historical prices for sparklines
//   pricesHistory: {},

//   // Portfolio: how many units owned
//   portfolio: {},

//   // Trade history for chart markers
//   trades: {}, // <-- ✅ ADDED

//   // Initialize price history (fill last 30 points)
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // Update prices & history every second
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((sym) => {
//       // Random walk simulation
//       newPrices[sym] = +(
//         newPrices[sym] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       // Update history
//       if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
//       else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },

//   // BUY function
//   buy: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];

//     // Update portfolio
//     const port = { ...state.portfolio };
//     port[symbol] = (port[symbol] || 0) + qty;

//     // Log trade
//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "buy",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });

//     console.log(`Bought ${qty} of ${symbol} @ ${price}`);
//   },

//   // SELL function
//   sell: (symbol, qty) => {
//     if (!qty || qty <= 0) return;

//     const state = get();
//     const price = state.prices[symbol];
//     const port = { ...state.portfolio };

//     // Validate portfolio
//     if (!port[symbol] || port[symbol] < qty) {
//       console.log(`Not enough ${symbol} to sell`);
//       return;
//     }

//     port[symbol] -= qty;

//     // Log trade
//     const tlist = state.trades[symbol] || [];
//     tlist.push({
//       side: "sell",
//       qty,
//       price,
//       index: (state.pricesHistory[symbol] || []).length - 1,
//       timestamp: Date.now(),
//     });

//     set({
//       portfolio: port,
//       trades: { ...state.trades, [symbol]: tlist },
//     });

//     console.log(`Sold ${qty} of ${symbol} @ ${price}`);
//   },
// }));

// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   // Symbols
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],

//   // Current prices
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },

//   // Historical prices for sparklines
//   pricesHistory: {}, // { symbol: [last30Prices] }

//   // Portfolio: how many units owned
//   portfolio: {},

//   // Initialize price history (fill last 30 points)
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // Update prices & history every second
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((sym) => {
//       // Random walk simulation
//       newPrices[sym] = +(
//         newPrices[sym] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       // Update history
//       if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
//       else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },

//   // BUY function
//   buy: (symbol, qty) => {
//     if (!qty || qty <= 0) return;
//     const port = { ...get().portfolio };
//     port[symbol] = (port[symbol] || 0) + qty;
//     set({ portfolio: port });
//     console.log(`Bought ${qty} of ${symbol}`, port);
//   },

//   // SELL function
//   sell: (symbol, qty) => {
//     if (!qty || qty <= 0) return;
//     const port = { ...get().portfolio };
//     if (!port[symbol] || port[symbol] < qty) {
//       console.log(`Not enough ${symbol} to sell`);
//       return;
//     }
//     port[symbol] -= qty;
//     set({ portfolio: port });
//     console.log(`Sold ${qty} of ${symbol}`, port);
//   },
// }));

// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },
//   pricesHistory: {}, // will store last 30 prices per symbol

//   // Initialize price history
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // Update prices and history
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((k) => {
//       newPrices[k] = +(
//         newPrices[k] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);
//       if (!newHistory[k]) newHistory[k] = Array(30).fill(newPrices[k]);
//       else newHistory[k] = [...newHistory[k].slice(1), newPrices[k]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },
// }));

// export const useMarketStore = create((set, get) => ({
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],
//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },
//   pricesHistory: {}, // last 30 prices
//   holdings: {}, // { symbol: { qty, avgPrice } }

//   // Initialize price history
//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   // Update prices and history
//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     Object.keys(newPrices).forEach((k) => {
//       newPrices[k] = +(
//         newPrices[k] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       if (!newHistory[k]) newHistory[k] = Array(30).fill(newPrices[k]);
//       else newHistory[k] = [...newHistory[k].slice(1), newPrices[k]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },

//   // Buy a symbol
//   buy: (symbol, qty) => {
//     const state = get();
//     const currentQty = state.holdings[symbol]?.qty || 0;
//     const avgPrice = state.holdings[symbol]?.avgPrice || 0;
//     const latestPrice = state.prices[symbol] || 0;

//     const newQty = currentQty + qty;
//     const newAvg = (avgPrice * currentQty + latestPrice * qty) / newQty;

//     set({
//       holdings: {
//         ...state.holdings,
//         [symbol]: { qty: newQty, avgPrice: newAvg },
//       },
//     });
//   },

//   // Sell a symbol
//   sell: (symbol, qty) => {
//     const state = get();
//     const currentQty = state.holdings[symbol]?.qty || 0;
//     const avgPrice = state.holdings[symbol]?.avgPrice || 0;
//     const newQty = Math.max(0, currentQty - qty);

//     set({
//       holdings: { ...state.holdings, [symbol]: { qty: newQty, avgPrice } },
//     });
//   },
// }));
// import { create } from "zustand";

// export const useMarketStore = create((set, get) => ({
//   symbols: [
//     "AAPL",
//     "GOOG",
//     "MSFT",
//     "TSLA",
//     "BTCUSDT",
//     "ETHUSDT",
//     "EURUSD",
//     "USDJPY",
//   ],

//   prices: {
//     AAPL: 150,
//     GOOG: 2800,
//     MSFT: 300,
//     TSLA: 700,
//     BTCUSDT: 30000,
//     ETHUSDT: 2000,
//     EURUSD: 1.1,
//     USDJPY: 150,
//   },

//   pricesHistory: {}, // last 30 prices per symbol

//   initHistory: () => {
//     const state = get();
//     const history = {};
//     state.symbols.forEach((sym) => {
//       history[sym] = Array(30).fill(state.prices[sym]);
//     });
//     set({ pricesHistory: history });
//   },

//   updatePrices: () => {
//     const state = get();
//     const newPrices = { ...state.prices };
//     const newHistory = { ...state.pricesHistory };

//     state.symbols.forEach((sym) => {
//       newPrices[sym] = +(
//         newPrices[sym] *
//         (1 + (Math.random() - 0.5) / 100)
//       ).toFixed(2);

//       if (!newHistory[sym]) newHistory[sym] = Array(30).fill(newPrices[sym]);
//       else newHistory[sym] = [...newHistory[sym].slice(1), newPrices[sym]];
//     });

//     set({ prices: newPrices, pricesHistory: newHistory });
//   },
// }));
