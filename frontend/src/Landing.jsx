import React, { useState, useCallback, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "./App.css";
import handleClick from '../functional_logic/handle_click';

const Landing = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = async () => {
    const data = await handleClick(password);
    if (data) {
      navigate("/output", { state: { data } });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Matrix animation effect
  const [matrixColumns, setMatrixColumns] = useState([]);

  useEffect(() => {
    const numColumns = Math.floor(window.innerWidth / 20); // Adjust spacing between columns
    const columns = [];
    
    // Function to generate random character
    const getRandomChar = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
      return characters.charAt(Math.floor(Math.random() * characters.length));
    };
    
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        chars: Array(Math.floor(Math.random() * 20 + 10)).fill(0).map(() => getRandomChar()),
        y: Math.random() * -1000,
        speed: Math.random() * 2 + 1
      });
    }
    
    setMatrixColumns(columns);
    
    const updateMatrix = () => {
      setMatrixColumns(prevColumns => prevColumns.map(column => ({
        ...column,
        y: column.y >= window.innerHeight ? -100 : column.y + column.speed,
        chars: Math.random() > 0.98 ? column.chars.map(() => getRandomChar()) : column.chars
      })));
    };

    const animationInterval = setInterval(updateMatrix, 50);

    const handleResize = () => {
      const newNumColumns = Math.floor(window.innerWidth / 20);
      if (newNumColumns !== columns.length) {
        setMatrixColumns(prevColumns => {
          if (newNumColumns > prevColumns.length) {
            return [...prevColumns, ...Array(newNumColumns - prevColumns.length).fill(0).map(() => ({
              chars: Array(Math.floor(Math.random() * 20 + 10)).fill(0).map(() => getRandomChar()),
              y: Math.random() * -1000,
              speed: Math.random() * 2 + 1
            }))];
          }
          return prevColumns.slice(0, newNumColumns);
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(animationInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix Background */}
      <div className="fixed inset-0 pointer-events-none">
        {matrixColumns.map((column, i) => (
          <div
            key={i}
            className="absolute text-green-500 text-opacity-75 select-none font-mono"
            style={{
              left: `${(i * 20)}px`,
              top: 0,
              transform: `translateY(${column.y}px)`,
              fontSize: '14px',
              lineHeight: '1',
              textShadow: '0 0 5px #0f0',
              writingMode: 'vertical-rl'
            }}
          >
            {column.chars.join('')}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md p-8 rounded-lg border border-green-500 border-opacity-30 bg-black bg-opacity-90 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Password Strength Analyser</h2>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
                onKeyPress={handleKeyPress}
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
            type="submit"
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-black font-medium transition-colors duration-300"
          >
            Analyse Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;