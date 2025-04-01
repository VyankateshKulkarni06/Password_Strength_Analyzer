import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">🔒</span>
          </div>
          <h2 className="text-2xl font-semibold mt-4">Secure Access</h2>
          <p className="text-gray-400 text-sm">Establish your credentials for the hackathon</p>
        </div>

        <div className="mt-6">
          <label className="block text-gray-300 text-sm font-semibold">Username</label>
          <input
            type="text"
            placeholder="Enter your handle"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-semibold">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 focus:outline-none focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="absolute right-2 top-2 text-gray-400" onClick={togglePassword}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use a combination of uppercase, lowercase, numbers, and special characters.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-semibold">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1 focus:outline-none focus:border-green-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-green-600 p-2 rounded mt-6 hover:bg-green-700 transition">
          Initialize Access
        </button>
      </div>
    </div>
  );
};

export default LoginPage;