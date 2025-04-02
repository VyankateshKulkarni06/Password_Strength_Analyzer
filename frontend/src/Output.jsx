import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Check, X, Clock, RefreshCw, Fingerprint, Eye, EyeOff } from 'lucide-react';

const PasswordStrengthVisualizer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Example password data
  const passwordData = {
    password: "abcd@123",
    guesses: 1010000,
    guesses_log10: 6.004321373782642,
    score: 2,
    strength_category: "Medium",
    features: {
      length: 8,
      entropy: 3.5,
      upper: 0,
      lower: 4,
      digits: 3,
      special: 1,
      repeats: 0,
      sequential: 1
    },
    time_to_crack: {
      online_throttling_100_per_hour: '1 year',
      online_no_throttling_10_per_second: '1 day',
      offline_slow_hashing_1e4_per_second: '2 minutes',
      offline_fast_hashing_1e10_per_second: 'less than a second'
    },
    isPwned: true,
    pwnedCount: 5163,
    feedback: {
      warning: 'Sequences like abc or 6543 are easy to guess',
      suggestions: [
        'Add another word or two. Uncommon words are better.',
        'Avoid sequences'
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Set animation complete after longer delay
    setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);
  }, []);

  // Function to get score color
  const getScoreColor = (score) => {
    const colors = {
      0: 'bg-red-500',
      1: 'bg-orange-500',
      2: 'bg-yellow-500',
      3: 'bg-green-500',
      4: 'bg-emerald-600'
    };
    return colors[score] || 'bg-gray-500';
  };
  
  // Function to get feature bar width and color
  const getFeatureBarStyle = (value, max, type) => {
    const percentage = Math.min((value / max) * 100, 100);
    let color = 'bg-blue-500';
    
    if (type === 'sequential' || type === 'repeats') {
      // For negative features, red is bad (high value)
      color = value > 0 ? 'bg-red-500' : 'bg-green-500';
    } else {
      // For positive features, green is good (high value)
      if (percentage < 30) color = 'bg-red-500';
      else if (percentage < 60) color = 'bg-yellow-500';
      else color = 'bg-green-500';
    }
    
    return {
      width: animationComplete ? `${percentage}%` : '0%',
      className: `h-full ${color} transition-all duration-1000 ease-out rounded`
    };
  };

  // Terminal-like effect for the title
  const [title, setTitle] = useState('');
  const fullTitle = '> Password Security Analysis';
  
  useEffect(() => {
    if (isLoading) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setTitle(fullTitle.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    // Added flex container to center the card with black background
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-3xl bg-black text-green-500 p-6 rounded-lg shadow-lg font-mono border border-green-900 relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <RefreshCw className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
              <div className="text-green-500 text-lg">Analyzing password security...</div>
            </div>
          </div>
        )}
        
        <h1 className="text-2xl mb-6 flex items-center">
          <Fingerprint className="mr-2" />
          <span className="typing-cursor">{title}</span>
          {title === fullTitle ? null : <span className="animate-pulse">▌</span>}
        </h1>
        
        {/* Password display section */}
        <div className="mb-6 bg-black bg-opacity-60 p-4 rounded-md border border-green-900">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="mr-2 text-yellow-500" />
              <span className="text-lg">Password:</span>
            </div>
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="text-green-400 hover:text-green-300 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-2 font-bold text-xl tracking-wider">
            {showPassword ? passwordData.password : '••••••••'}
          </div>
        </div>
        
        {/* Overall score */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Security Score: {passwordData.score}/4</span>
            <span className="text-yellow-400">{passwordData.strength_category}</span>
          </div>
          <div className="h-4 w-full bg-gray-800 rounded overflow-hidden">
            <div className={`h-full ${getScoreColor(passwordData.score)} transition-all duration-1000 ease-out`} 
                 style={{ width: animationComplete ? `${(passwordData.score / 4) * 100}%` : '0%' }}></div>
          </div>
        </div>
        
        {/* Pwned warning */}
        {passwordData.isPwned && (
          <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-800 p-4 rounded flex items-start animate-pulse">
            <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-bold">Password Breach Alert!</h3>
              <p className="text-red-300">This password appears in {passwordData.pwnedCount.toLocaleString()} known data breaches. It should be changed immediately.</p>
            </div>
          </div>
        )}
        
        {/* Password features */}
        <div className="mb-6">
          <h2 className="text-xl mb-3 border-b border-green-800 pb-1">Password Composition</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Length</span>
                <span>{passwordData.features.length}/16</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.length, 16).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.length, 16).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Entropy</span>
                <span>{passwordData.features.entropy}/5</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.entropy, 5).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.entropy, 5).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uppercase</span>
                <span>{passwordData.features.upper}/2</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.upper, 2).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.upper, 2).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Lowercase</span>
                <span>{passwordData.features.lower}/5</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.lower, 5).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.lower, 5).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Digits</span>
                <span>{passwordData.features.digits}/3</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.digits, 3).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.digits, 3).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Special Chars</span>
                <span>{passwordData.features.special}/2</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.special, 2).className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.special, 2).width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sequential</span>
                <span className={passwordData.features.sequential > 0 ? "text-red-400" : "text-green-400"}>
                  {passwordData.features.sequential > 0 ? "Detected" : "None"}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.sequential, 1, 'sequential').className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.sequential, 1, 'sequential').width }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Repeated Chars</span>
                <span className={passwordData.features.repeats > 1 ? "text-red-400" : "text-green-400"}>
                  {passwordData.features.repeats}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                <div className={getFeatureBarStyle(passwordData.features.repeats, 3, 'repeats').className} 
                     style={{ width: getFeatureBarStyle(passwordData.features.repeats, 3, 'repeats').width }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time to crack */}
        <div className="mb-6">
          <h2 className="text-xl mb-3 border-b border-green-800 pb-1 flex items-center">
            <Clock className="mr-2" /> Time to Crack
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(passwordData.time_to_crack).map(([scenario, time]) => {
              // Choose color based on time
              let color = "bg-green-500";
              if (time.includes("second") || time.includes("minute")) {
                color = "bg-red-500";
              } else if (time.includes("day") || time.includes("hour")) {
                color = "bg-yellow-500";
              }
              
              // Format scenario name
              const formatScenario = (str) => {
                return str
                  .replace(/_/g, ' ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              };
              
              return (
                <div key={scenario} className="bg-black bg-opacity-40 p-3 rounded border border-gray-800">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{formatScenario(scenario)}</span>
                    <span className={time.includes("second") || time.includes("minute") ? "text-red-400" : 
                                    time.includes("hour") || time.includes("day") ? "text-yellow-400" : "text-green-400"}>
                      {time}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                    <div 
                      className={`h-full ${color} transition-all duration-1500 ease-out rounded`} 
                      style={{ 
                        width: animationComplete ? '100%' : '0%',
                        transitionDelay: '500ms'
                      }}>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Feedback and suggestions */}
        <div className="bg-gray-900 bg-opacity-60 p-4 rounded border border-gray-700">
          <h2 className="text-xl mb-3 flex items-center text-yellow-400">
            <AlertTriangle className="mr-2" /> Security Warnings
          </h2>
          
          {passwordData.feedback.warning && (
            <div className="mb-3 flex items-start">
              <X className="text-red-500 mr-2 mt-1 flex-shrink-0" />
              <p>{passwordData.feedback.warning}</p>
            </div>
          )}
          
          <h3 className="text-lg mb-2 text-blue-400 flex items-center">
            <Check className="mr-2" /> Suggestions
          </h3>
          <ul className="list-disc pl-8 space-y-1">
            {passwordData.feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-blue-300">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Matrix-like effect in background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 z-0">
          <div className="matrix-code">
            {Array(20).fill().map((_, i) => (
              <div key={i} className="matrix-line" style={{ 
                animationDuration: `${Math.random() * 5 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                left: `${Math.random() * 100}%`
              }}>
                {Array(20).fill().map((_, j) => (
                  <span key={j} className="text-green-700" style={{ 
                    animationDuration: `${Math.random() * 2 + 0.5}s` 
                  }}>
                    {String.fromCharCode(33 + Math.floor(Math.random() * 50))}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Add custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes matrixDrop {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
          }
          
          @keyframes flicker {
            0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
              opacity: 0.99;
            }
            20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
              opacity: 0.4;
            }
          }
          
          .matrix-code {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .matrix-line {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            animation: matrixDrop linear infinite;
          }
          
          .matrix-line span {
            font-size: 14px;
            animation: flicker infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PasswordStrengthVisualizer;