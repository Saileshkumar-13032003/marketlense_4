import React from "react";
import { motion } from "framer-motion";

export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#151a24] p-8 rounded-xl w-[350px] text-center"
      >
        <h1 className="text-white text-xl font-bold mb-3">Logout</h1>
        <p className="text-gray-400 mb-6">Are you sure you want to logout?</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// import React from "react";
// import { motion } from "framer-motion";

// export default function LogoutModal({ open, onClose, onConfirm }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <motion.div
//         initial={{ scale: 0.7, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-[#151a24] p-8 rounded-xl w-[350px] text-center"
//       >
//         <h1 className="text-white text-xl font-bold mb-3">Logout</h1>
//         <p className="text-gray-400 mb-6">Are you sure you want to logout?</p>

//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
//           >
//             Logout
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
