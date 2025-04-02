import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Shield, AlertTriangle, Check, X, Clock, RefreshCw, Fingerprint, Eye, EyeOff, Search, Zap } from 'lucide-react';

const defaultData = {
  zxcvbn_output: {
    password: "ExamplePassword123!",
    sequence: [
      { pattern: "dictionary", i: 0, j: 6, token: "Example", guesses: 50000, guesses_log10: 4.7 },
      { pattern: "dictionary", i: 7, j: 13, token: "Password", guesses: 30000, guesses_log10: 4.5 },
      { pattern: "sequence", i: 14, j: 16, token: "123", guesses: 100, guesses_log10: 2.0 },
      { pattern: "bruteforce", i: 17, j: 17, token: "!", guesses: 10, guesses_log10: 1.0 }
    ],
    feedback: {
      warning: "This is a commonly used password",
      suggestions: ["Add more special characters", "Use a longer password", "Avoid common patterns"]
    }
  },
  analyzer_output: {
    score: 65,
    strength_category: "Medium",
    features: { length: 12, entropy: 3, upper: 1, lower: 10, digits: 3, special: 1, sequential: 1, repeats: 0, proximity: 0 },
    time_to_crack: { online: "3 days", offline: "2 hours", bcrypt: "3 years", sha256: "1 month" }
  },
  pwned_output: { pwned: false, count: 0 }
};

const Output = () => {
  const location = useLocation(); // Get the location object
  const data = location.state?.data || defaultData; // Use passed data or fallback to defaultData

  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [title, setTitle] = useState('');

  const passwordData = useMemo(() => ({
    password: data.zxcvbn_output?.password || defaultData.zxcvbn_output.password,
    score: data.analyzer_output?.score || defaultData.analyzer_output.score,
    strength_category: data.analyzer_output?.strength_category || defaultData.analyzer_output.strength_category,
    features: data.analyzer_output?.features || defaultData.analyzer_output.features,
    time_to_crack: data.analyzer_output?.time_to_crack || defaultData.analyzer_output.time_to_crack,
    sequence: data.zxcvbn_output?.sequence || defaultData.zxcvbn_output.sequence,
    isPwned: data.pwned_output?.pwned || defaultData.pwned_output.pwned,
    pwnedCount: data.pwned_output?.count || defaultData.pwned_output.count,
    feedback: data.zxcvbn_output?.feedback || defaultData.zxcvbn_output.feedback
  }), [data]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 1000);
    const animationTimer = setTimeout(() => setAnimationComplete(true), 2500);
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(animationTimer);
    };
  }, []);

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

  const getScoreColor = (score) => {
    if (score <= 25) return 'bg-red-500';
    if (score <= 50) return 'bg-orange-500';
    if (score <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getFeatureBarStyle = (value, max, type) => {
    const percentage = Math.min((value / max) * 100, 100);
    let color = 'bg-blue-500';
    if (type === 'sequential' || type === 'repeats' || type === 'proximity') {
      color = value > 0 ? 'bg-red-500' : 'bg-green-500';
    } else {
      if (percentage < 30) color = 'bg-red-500';
      else if (percentage < 60) color = 'bg-yellow-500';
      else color = 'bg-green-500';
    }
    return {
      width: animationComplete ? `${percentage}%` : '0%',
      className: `h-full ${color} transition-all duration-1000 ease-out rounded`
    };
  };

  const matrixEffect = useMemo(() => (
    <div className="matrix-code">
      {Array(10).fill().map((_, i) => (
        <div key={i} className="matrix-line" style={{ 
          animationDuration: `${Math.random() * 5 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
          left: `${Math.random() * 100}%`
        }}>
          {Array(10).fill().map((_, j) => (
            <span key={j} className="text-green-700" style={{ 
              animationDuration: `${Math.random() * 2 + 0.5}s` 
            }}>
              {String.fromCharCode(33 + Math.floor(Math.random() * 50))}
            </span>
          ))}
        </div>
      ))}
    </div>
  ), []);

  const renderSequence = (sequence) => (
    <div className="bg-gray-900 p-4 rounded-md border border-gray-700 mb-6">
      <h2 className="text-xl mb-3 border-b border-green-800 pb-1 flex items-center">
        <Search className="mr-2" /> Pattern Analysis
      </h2>
      {sequence.map((item, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Zap className="text-yellow-500 mr-2" />
              <span className="text-lg capitalize">{item.pattern} Pattern</span>
            </div>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">
              Position {item.i} → {item.j}
            </span>
          </div>
          <div className="bg-black bg-opacity-50 p-3 rounded border border-gray-800">
            <div className="flex justify-between mb-2">
              <span>Token:</span>
              <code className="bg-gray-900 px-2 py-1 rounded text-green-400">{item.token}</code>
            </div>
            <div className="flex justify-between mb-2">
              <span>Guesses required:</span>
              <span className="text-yellow-400">{item.guesses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Complexity (log10):</span>
              <span>{item.guesses_log10.toFixed(2)}</span>
            </div>
            <div className="mt-3 mb-1 text-xs text-gray-400">Character position:</div>
            <div className="flex mb-2">
              {passwordData.password.split('').map((char, charIndex) => (
                <div 
                  key={charIndex} 
                  className={`flex-1 p-2 text-center border ${
                    charIndex >= item.i && charIndex <= item.j 
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-300' 
                      : 'border-gray-700 text-gray-500'
                  }`}
                >
                  {char}
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-300">
              {item.pattern === 'bruteforce' && <p>This section can only be cracked by brute force.</p>}
              {item.pattern === 'dictionary' && <p>This section matches a common word or phrase.</p>}
              {item.pattern === 'sequence' && <p>This section follows a predictable sequence.</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-3xl bg-black text-green-500 p-6 rounded-lg shadow-lg font-mono border border-green-900 relative">
        <div className="relative z-10">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 rounded-lg">
              <div className="text-center">
                <RefreshCw className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-green-500 text-lg">Analyzing password security...</div>
              </div>
            </div>
          )}
          
          <h1 className="text-2xl mb-6 flex items-center">
            <Fingerprint className="mr-2" />
            <span>{title}</span>
            {title === fullTitle ? null : <span className="animate-pulse">▌</span>}
          </h1>
          
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
              {showPassword ? passwordData.password : '•'.repeat(passwordData.password.length)}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Security Score: {passwordData.score}/100</span>
              <span className="text-red-400">{passwordData.strength_category}</span>
            </div>
            <div className="h-4 w-full bg-gray-800 rounded overflow-hidden">
              <div className={`h-full ${getScoreColor(passwordData.score)} transition-all duration-1000 ease-out`} 
                   style={{ width: animationComplete ? `${passwordData.score}%` : '0%' }}></div>
            </div>
          </div>
          
          {passwordData.isPwned && (
            <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-800 p-4 rounded flex items-start animate-pulse">
              <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-bold">Password Breach Alert!</h3>
                <p className="text-red-300">Appears in {passwordData.pwnedCount.toLocaleString()} breaches.</p>
              </div>
            </div>
          )}
          
          {renderSequence(passwordData.sequence)}
          
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
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl mb-3 border-b border-green-800 pb-1 flex items-center">
              <Clock className="mr-2" /> Time to Crack
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(passwordData.time_to_crack).map(([algorithm, time]) => (
                <div key={algorithm} className="bg-black bg-opacity-40 p-3 rounded border border-gray-800">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</span>
                    <span className="text-red-400">{time}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1500 ease-out rounded" 
                      style={{ width: animationComplete ? '100%' : '0%', transitionDelay: '500ms' }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
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
                <li key={index} className="text-blue-300">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 z-0">
          {matrixEffect}
        </div>

        <style>{`
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
          
          @keyframes matrixDrop {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          
          @keyframes flicker {
            0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 0.99; }
            20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Output;