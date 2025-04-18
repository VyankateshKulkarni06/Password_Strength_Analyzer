import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "./App.css";
import handleClick from '../functional_logic/handle_click';

const Landing = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showTagline, setShowTagline] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0);
  
  // Control sequential animation with smoother transitions
  useEffect(() => {
    // Show tagline after a short delay
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 800);

    // Show card after tagline animation completes with a smoother transition
    const cardShowTimer = setTimeout(() => {
      setShowCard(true);
    }, 2800);
    
    // Gradually increase card opacity for a smoother appearance
    const opacityTimers = [];
    if (showCard) {
      for (let i = 1; i <= 10; i++) {
        const timer = setTimeout(() => {
          setCardOpacity(i / 10);
        }, i * 50); // Increase opacity over 500ms
        opacityTimers.push(timer);
      }
    }
    

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(cardShowTimer);
      opacityTimers.forEach(timer => clearTimeout(timer));
    };
  }, [showCard]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = async () => {
    const data = await handleClick(password);
    console.log("data",data);
    localStorage.setItem("password",data);
    if (data) {
      navigate("/output", { state: { data } });
    }
  };

  // Generate matrix-like characters: now includes alphabets, numbers and special characters
  const generateMatrixChar = () => {
    const charTypes = [
      // Numbers (0-9)
      () => String.fromCharCode(48 + Math.floor(Math.random() * 10)),
      // Lowercase letters (a-z)
      () => String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      // Uppercase letters (A-Z)
      () => String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      // Special characters
      () => "!@#$%^&*()_+-=[]{}|;:,./<>?".charAt(Math.floor(Math.random() * 29))
    ];
    
    const randomType = Math.floor(Math.random() * charTypes.length);
    return charTypes[randomType]();
  };

  // Memoize animation keyframes so they don't re-render on state changes
  const animationKeyframes = useMemo(() => `
    @keyframes matrixRain {
      0% {
        transform: translateY(-20px);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(100vh);
        opacity: 0;
      }
    }

    @keyframes floatSlow {
      0%, 100% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(10px, 15px);
      }
      50% {
        transform: translate(-5px, 20px);
      }
      75% {
        transform: translate(-15px, 5px);
      }
    }

    @keyframes floatRotate {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.1;
      }
      25% {
        transform: translate(10px, -15px) rotate(90deg);
        opacity: 0.3;
      }
      50% {
        transform: translate(20px, 10px) rotate(180deg);
        opacity: 0.2;
      }
      75% {
        transform: translate(-5px, 15px) rotate(270deg);
        opacity: 0.25;
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
        opacity: 0.1;
      }
    }

    @keyframes pulseSlow {
      0%, 100% {
        opacity: 0.05;
      }
      50% {
        opacity: 0.2;
      }
    }

    @keyframes pulseBorder {
      0%, 100% {
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
      }
      50% {
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
      }
    }

    @keyframes moveLeftToRight {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes moveRightToLeft {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateX(-100%);
        opacity: 0;
      }
    }

    @keyframes moveTopToBottom {
      0% {
        transform: translateY(-100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(100%);
        opacity: 0;
      }
    }

    @keyframes moveBottomToTop {
      0% {
        transform: translateY(100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(-100%);
        opacity: 0;
      }
    }

    @keyframes moveDiagonalDownRight {
      0% {
        transform: translate(-100%, -100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translate(100%, 100%);
        opacity: 0;
      }
    }

    @keyframes moveDiagonalUpRight {
      0% {
        transform: translate(-100%, 100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translate(100%, -100%);
        opacity: 0;
      }
    }

    @keyframes moveDiagonalDownLeft {
      0% {
        transform: translate(100%, -100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translate(-100%, 100%);
        opacity: 0;
      }
    }

    @keyframes moveDiagonalUpLeft {
      0% {
        transform: translate(100%, 100%);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translate(-100%, -100%);
        opacity: 0;
      }
    }
    
    /* New animations for tagline and card */
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink {
      0%, 100% { border-right-color: transparent; }
      50% { border-right-color: rgba(16, 185, 129, 0.8); }
    }
    
    @keyframes glowText {
      0%, 100% {
        text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
      }
      50% {
        text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.4);
      }
    }
    
    @keyframes scanLine {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }
    
    /* Improved smooth transitions */
    @keyframes fadeInScale {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes floatIn {
      0% {
        transform: translateY(20px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes blurIn {
      0% {
        filter: blur(10px);
        opacity: 0;
      }
      100% {
        filter: blur(0);
        opacity: 1;
      }
    }
  `, []);

  // Generate random moving lines
  const generateRandomLines = () => {
    // Different types of line animations
    const lineAnimations = [
      'moveLeftToRight',
      'moveRightToLeft',
      'moveTopToBottom',
      'moveBottomToTop',
      'moveDiagonalDownRight',
      'moveDiagonalUpRight',
      'moveDiagonalDownLeft',
      'moveDiagonalUpLeft'
    ];
    
    // Generate 35 random lines with varied lengths/widths
    return Array.from({ length: 35 }).map((_, i) => {
      const isHorizontal = Math.random() > 0.5;
      const animationType = lineAnimations[Math.floor(Math.random() * lineAnimations.length)];
      const duration = Math.random() * 10 + 5; // Between 5 and 15 seconds
      const delay = Math.random() * 10; // Random delay up to 10 seconds
      const thickness = Math.random() * 1.5 + 0.5; // Line thickness between 0.5px and 2px
      
      // Instead of full width/height, use random size between 5% and 30% of the screen
      const size = Math.random() * 25 + 5; // Between 5% and 30% of screen dimension
      
      // Random position
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;

      return (
        <div 
          key={`line-${i}`}
          className="absolute bg-green-500"
          style={{ 
            width: isHorizontal ? `${size}%` : `${thickness}px`,
            height: isHorizontal ? `${thickness}px` : `${size}%`,
            opacity: 0.1 + Math.random() * 0.3,
            left: `${xPos}%`,
            top: `${yPos}%`,
            animation: `${animationType} ${duration}s linear infinite`,
            animationDelay: `${delay}s`
          }}
        />
      );
    });
  };

  // Memoize the background elements so they don't re-render on state changes
  const backgroundElements = useMemo(() => {
    return (
      <>
        {/* Matrix characters rain effect - now with mixed characters */}
        {Array.from({ length: 250 }).map((_, i) => {
          const character = generateMatrixChar();
          return (
            <div 
              key={`matrix-${i}`}
              className="absolute text-green-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                opacity: 0.1 + Math.random() * 0.6,
                fontSize: `${Math.random() * 14 + 8}px`,
                animation: `matrixRain ${Math.random() * 8 + 3}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {character}
            </div>
          );
        })}

        {/* Glowing orbs */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={`orb-${i}`}
            className="absolute rounded-full bg-green-500 blur-xl"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.03 + Math.random() * 0.06,
              animation: `floatSlow ${Math.random() * 20 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Random moving lines in various directions - now with shorter lengths */}
        {generateRandomLines()}
      </>
    );
  }, []);

  return (
    <div>
      {/* Inject animation keyframes */}
      <style>{animationKeyframes}</style>

      <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-opacity-90 relative overflow-hidden">
        {/* Enhanced animated background - using memoized elements */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundElements}
        </div>
        
        {/* Moving scan line effect */}
        <div 
          className="absolute w-full h-8 bg-gradient-to-b from-green-500 to-transparent opacity-10"
          style={{
            animation: 'scanLine 4s linear infinite'
          }}
        />
        
        {/* Animated tagline section */}
        {showTagline && (
          <div 
            className="text-center mb-8 z-10 overflow-hidden"
            style={{
              animation: 'fadeInUp 1.2s ease forwards'
            }}
          >
            <h1 
              className="text-4xl md:text-5xl font-bold text-green-500 mb-4"
              style={{
                animation: 'glowText 3s ease-in-out infinite'
              }}
            >
              <span className="inline-block" style={{ animationDelay: '0.1s' }}>B</span>
              <span className="inline-block" style={{ animationDelay: '0.2s' }}>r</span>
              <span className="inline-block" style={{ animationDelay: '0.3s' }}>u</span>
              <span className="inline-block" style={{ animationDelay: '0.4s' }}>t</span>
              <span className="inline-block" style={{ animationDelay: '0.5s' }}>e</span>
              <span className="inline-block" style={{ animationDelay: '0.6s' }}></span>
              <span className="inline-block" style={{ animationDelay: '0.7s' }}>P</span>
              <span className="inline-block" style={{ animationDelay: '0.8s' }}>a</span>
              <span className="inline-block" style={{ animationDelay: '0.9s' }}>r</span>
              <span className="inline-block" style={{ animationDelay: '1.0s' }}>s</span>
              <span className="inline-block" style={{ animationDelay: '1.1s' }}>e</span>

            </h1>
            <div 
              className="mx-auto max-w-2xl"
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                borderRight: '3px solid rgba(16, 185, 129, 0.8)',
                animation: 'typewriter 2s steps(40, end) forwards, blink 0.8s infinite'
              }}
            >
              <p className="text-lg md:text-xl text-green-300 opacity-80">
                How strong is your digital defense? Find out now.
              </p>
            </div>
          </div>
        )}
    
        {/* Form container with smoother transition - controlled opacity and transformations */}
        {showCard && (
          <div className="w-full max-w-md relative z-10">
            {/* Semi-transparent background glow effect that appears before the card */}
            <div 
              className="absolute inset-0 bg-green-500 rounded-lg blur-xl"
              style={{ 
                opacity: cardOpacity * 0.15,
                transform: `scale(${1 + ((1 - cardOpacity) * 0.2)})`,
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }}
            ></div>
            
            {/* Card with smoother animation */}
            <div 
              className="p-8 rounded-lg border border-green-500 border-opacity-30 bg-black bg-opacity-80 relative"
              style={{
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
                opacity: cardOpacity,
                transform: `translateY(${20 - (cardOpacity * 20)}px) scale(${0.95 + (cardOpacity * 0.05)})`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                filter: `blur(${(1 - cardOpacity) * 10}px)`,
                animation: cardOpacity === 1 ? 'pulseBorder 3s ease-in-out infinite 0.8s' : 'none'
              }}
            >
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4"
                  style={{
                    opacity: cardOpacity,
                    transform: `scale(${0.9 + (cardOpacity * 0.1)})`,
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {/* Clear, solid security shield icon - no animations */}
                  <svg 
                    className="w-10 h-10 text-green-500" 
                    viewBox="0 0 24 24"
                    style={{
                      opacity: 1,
                      transition: 'opacity 0.5s ease-out'
                    }}
                  >
                    <path 
                      fill="currentColor" 
                      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                    />
                  </svg>
                </div>
                <h2 
                  className="text-2xl font-bold text-white mb-1"
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${10 - (cardOpacity * 10)}px)`,
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    transitionDelay: '0.1s'
                  }}
                >
                  Password Strength Analyzer
                </h2>
                <p 
                  className="text-green-400 text-sm mb-4"
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${10 - (cardOpacity * 10)}px)`,
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    transitionDelay: '0.2s'
                  }}
                >
                  Advanced security analysis for your passwords
                </p>
              </div>
              
              <form 
                className="space-y-6"
                style={{
                  opacity: cardOpacity,
                  transition: 'opacity 0.8s ease-out',
                  transitionDelay: '0.3s'
                }}
              >
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
                  <div className="relative group">
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
                      className="w-full py-2 pl-10 pr-10 bg-black border border-green-500 border-opacity-30 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 group-hover:border-green-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500 hover:text-green-400 transition-colors duration-300"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                  <p className="text-green-400 text-xs mt-2 opacity-80">Enter any password to test its security strength</p>
                </div>
                
                <button 
                  type="button"
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-black font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  onClick={handleSubmit}
                >
                  Analyze Password
                </button>
                
                <div className="text-center text-xs text-green-300 opacity-60 pt-2">
                  Your password remains secure and is never stored
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;