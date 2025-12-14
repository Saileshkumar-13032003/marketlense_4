// C:\Users\Sakthi M\Desktop\New Project\marketlense\src\components\Sidebar.jsx

import React from "react"; // 🔑 Keep only this single line
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Indices", path: "/indices" },
    { name: "Stocks", path: "/stocks" },
    { name: "Crypto", path: "/crypto" },
    { name: "Forex", path: "/forex" },
    { name: "Futures", path: "/futures" },
    { name: "Charts", path: "/chart/AAPL" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="w-60 bg-secondary min-h-screen p-5 flex flex-col justify-between">
      {/* Top */}
      <div className="flex flex-col gap-6">
        <h1 className="text-white font-bold text-xl">Market Tracker</h1>

        <p className="text-gray-300 text-sm">
          Logged in as: <span className="font-bold">{username}</span>
        </p>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-white p-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-accent font-bold"
                  : "hover:bg-accent"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menu = [
//     { name: "Dashboard", path: "/" },
//     { name: "Indices", path: "/indices" },
//     { name: "Stocks", path: "/stocks" },
//     { name: "Crypto", path: "/crypto" },
//     { name: "Forex", path: "/forex" },
//     { name: "Futures", path: "/futures" },
//     { name: "Charts", path: "/chart/AAPL" },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("loggedIn");
//     navigate("/login");
//   };

//   return (
//     <div className="w-60 bg-secondary min-h-screen p-5 flex flex-col gap-6">
//       <h1 className="text-white font-bold text-xl">Market Tracker</h1>

//       <nav className="flex flex-col gap-2 flex-1">
//         {menu.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`text-white p-2 rounded-lg transition ${
//               location.pathname === item.path
//                 ? "bg-accent font-bold"
//                 : "hover:bg-accent"
//             }`}
//           >
//             {item.name}
//           </Link>
//         ))}
//       </nav>

//       {/* Logout Button */}
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 hover:bg-red-600 p-2 rounded text-white font-bold"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const username = localStorage.getItem("username");

//   const menu = [
//     { name: "Dashboard", path: "/" },
//     { name: "Indices", path: "/indices" },
//     { name: "Stocks", path: "/stocks" },
//     { name: "Crypto", path: "/crypto" },
//     { name: "Forex", path: "/forex" },
//     { name: "Futures", path: "/futures" },
//     { name: "Charts", path: "/chart/AAPL" },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("loggedIn");
//     localStorage.removeItem("username");
//     navigate("/login");
//   };

//   return (
//     <div className="w-60 bg-secondary min-h-screen p-5 flex flex-col justify-between">
//       {/* Top */}
//       <div className="flex flex-col gap-6">
//         <h1 className="text-white font-bold text-xl">Market Tracker</h1>

//         <p className="text-gray-300 text-sm">
//           Logged in as: <span className="font-bold">{username}</span>
//         </p>

//         <nav className="flex flex-col gap-2">
//           {menu.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`text-white p-2 rounded-lg transition ${
//                 location.pathname === item.path
//                   ? "bg-accent font-bold"
//                   : "hover:bg-accent"
//               }`}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Bottom */}
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }
