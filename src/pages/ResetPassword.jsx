import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// The base path for your backend API (ensure this matches your server port)
const BASE_API_URL = "http://localhost:5000/api/auth";

export default function ResetPassword() {
  // 1. Get the token from the URL parameter (e.g., /reset-password/a1b2c3d4e5...)
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resetToken) {
      setError(
        "Missing reset token in the URL. Please use the link from your email."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 2. AXIOS CALL to the Backend Reset Password Endpoint
      // The token is appended to the URL as a path parameter.
      const RESET_API = `${BASE_API_URL}/reset-password/${resetToken}`;

      await axios.post(RESET_API, {
        newPassword: password, // Send the new password to the server
      });

      // 3. Success: Show message and redirect to login
      setSuccess("Password successfully reset! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      // 4. Error handling
      setLoading(false);
      // The backend should return the error message for invalid/expired tokens
      const errMsg =
        err.response?.data?.msg ||
        "Password reset failed. Please check your token.";
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative overflow-hidden">
      {/* Background Animation (optional) */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ x: [-50, 50, -50] }}
        transition={{ duration: 12, repeat: Infinity }}
      >
        <img
          src="/market-lines.svg"
          className="w-full h-full object-cover"
          alt="Background pattern"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#151a24] p-10 rounded-xl shadow-xl w-[400px] relative z-10"
      >
        <h1 className="text-white text-2xl font-bold mb-2 text-center">
          Set New Password
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Enter your new password below.
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mb-4 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* New Password Input */}
          <div>
            <label className="text-gray-300 text-sm">New Password</label>
            <div className="flex items-center bg-[#1e2533] rounded-lg mt-1">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white p-3 outline-none"
              />
              <button
                type="button"
                className="px-3 text-gray-300"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-gray-300 text-sm">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1e2533] text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mt-2"
            disabled={loading || success}
          >
            {loading ? "Updating..." : success ? "Success!" : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
