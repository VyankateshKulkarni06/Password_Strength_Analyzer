import React, { useState, useCallback } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "./App.css";
import handleClick from '../functional_logic/handle_click';

const Landing = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(""); // Renamed to 'password'

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = async () => {
    const data = await handleClick(password); // Pass the entered password
    if (data) {
      navigate("/output", { state: { data } }); // Pass data to Output
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              className="absolute text-green-500 opacity-30 text-sm animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 90}deg)`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {Math.round(Math.random())}
            </div>
          ))}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-green-500 opacity-10 animate-pulse-line"
                style={{
                  height: '1px',
                  width: `${Math.random() * 200 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 180}deg)`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
    
        <div className="w-full max-w-md p-8 rounded-lg border border-green-500 border-opacity-30 bg-black bg-opacity-80 relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Password Strength Analyser</h2>
          </div>
          
          <form className="space-y-6">
            <div className="sr-only">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                autoComplete="username" 
              />
            </div>
            
            <div>
              <label className="block text-white text-sm mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full py-2 pl-10 pr-10 bg-black border border-green-500 border-opacity-30 rounded text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-black font-medium transition-colors duration-300"
              onClick={handleSubmit}
            >
              Analyse Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Landing;