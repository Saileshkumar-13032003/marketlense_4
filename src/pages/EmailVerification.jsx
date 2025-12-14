import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function EmailVerification() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#151a24] p-10 rounded-xl shadow-xl text-center w-[400px]"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <img src="/mail-icon.svg" className="w-20 mx-auto mb-4 opacity-90" />
        </motion.div>

        <h1 className="text-white text-xl font-bold">Check Your Email</h1>
        <p className="text-gray-400 mt-2">
          We’ve sent a verification link. Redirecting shortly...
        </p>
      </motion.div>
    </div>
  );
}

// import React, { useEffect } from "react";
// import { motion } from "framer-motion";

// export default function EmailVerification() {
//   useEffect(() => {
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.6 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-[#151a24] p-10 rounded-xl shadow-xl text-center w-[400px]"
//       >
//         <motion.div
//           animate={{ rotate: [0, 5, -5, 0] }}
//           transition={{ repeat: Infinity, duration: 3 }}
//         >
//           <img src="/mail-icon.svg" className="w-20 mx-auto mb-4 opacity-90" />
//         </motion.div>

//         <h1 className="text-white text-xl font-bold">Check Your Email</h1>
//         <p className="text-gray-400 mt-2">
//           We've sent a verification link. You’ll be redirected shortly.
//         </p>
//       </motion.div>
//     </div>
//   );
// }
