import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  // 🛑 REMOVED: The immediate setTimeout redirect to /login
  // The user must now check their email first.
  // useEffect(() => {
  //   setTimeout(() => {
  //     window.location.href = "/login";
  //   }, 2000);
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#151a24] p-10 rounded-xl shadow-xl w-[400px] text-center"
      >
        <motion.div
          className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6 }}
        >
          {/* Changed icon to a mail icon or similar to indicate email action */}
          <span className="text-white text-4xl">📧</span>
        </motion.div>

        <h1 className="text-white text-2xl font-bold">
          Verification Email Sent
        </h1>
        <p className="text-gray-400 mt-2">
          A link has been sent to your email. Please click the link to verify
          your account and enable login.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  );
}

// import React, { useEffect } from "react";
// import { motion } from "framer-motion";

// export default function RegistrationSuccess() {
//   useEffect(() => {
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
//       <motion.div
//         initial={{ scale: 0.7, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-[#151a24] p-10 rounded-xl shadow-xl w-[400px] text-center"
//       >
//         <motion.div
//           className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
//           initial={{ scale: 0 }}
//           animate={{ scale: [0, 1.2, 1] }}
//           transition={{ duration: 0.6 }}
//         >
//           <span className="text-white text-4xl">✔</span>
//         </motion.div>

//         <h1 className="text-white text-2xl font-bold">
//           Registration Successful
//         </h1>
//         <p className="text-gray-400 mt-2">Redirecting to login...</p>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useEffect } from "react";
// import { motion } from "framer-motion";

// export default function RegistrationSuccess() {
//   useEffect(() => {
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
//       <motion.div
//         initial={{ scale: 0.7, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-[#151a24] p-10 rounded-xl shadow-xl w-[400px] text-center"
//       >
//         <motion.div
//           className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
//           initial={{ scale: 0 }}
//           animate={{ scale: [0, 1.2, 1] }}
//           transition={{ duration: 0.6 }}
//         >
//           <span className="text-white text-4xl">✔</span>
//         </motion.div>

//         <h1 className="text-white text-2xl font-bold">
//           Registration Successful
//         </h1>
//         <p className="text-gray-400 mt-2">Redirecting to login...</p>
//       </motion.div>
//     </div>
//   );
// }
