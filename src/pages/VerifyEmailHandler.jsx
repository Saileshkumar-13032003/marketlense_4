// frontend/src/pages/VerifyEmailHandler.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function VerifyEmailHandler() {
  const [message, setMessage] = useState("Verifying your email address...");
  const [isSuccess, setIsSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const { verificationToken } = useParams(); // ⬅️ Reads the token from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!verificationToken) {
        setMessage("Verification link is invalid.");
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      try {
        // 🛑 API CALL TO BACKEND
        const response = await axios.get(
          `/api/auth/verify-email/${verificationToken}`
        );

        // Success
        setMessage(
          response.data.msg ||
            "Email verification successful! You can now log in."
        );
        setIsSuccess(true);
        setLoading(false);

        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        // Failure (e.g., token expired, invalid)
        const errorMessage =
          error.response?.data?.msg ||
          "Verification failed. The link may be expired.";
        setMessage(errorMessage);
        setIsSuccess(false);
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [verificationToken, navigate]);

  // Determine colors and icons based on status
  const icon = isSuccess === true ? "✅" : isSuccess === false ? "❌" : "⏳";
  const color =
    isSuccess === true
      ? "text-green-500"
      : isSuccess === false
      ? "text-red-500"
      : "text-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#151a24] p-10 rounded-xl shadow-2xl text-center w-full max-w-md"
      >
        <motion.span
          className={`text-5xl mb-4 inline-block ${color}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            type: "spring",
            stiffness: 50,
          }}
        >
          {icon}
        </motion.span>

        <h1 className="text-white text-2xl font-bold mt-4">
          {loading
            ? "Processing..."
            : isSuccess
            ? "Verification Complete"
            : "Verification Failed"}
        </h1>

        <p className="text-gray-400 mt-3 mb-6">{message}</p>

        {loading && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        )}

        {!loading && !isSuccess && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        )}
      </motion.div>
    </div>
  );
}
