import React, { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, Clock, RefreshCw, Fingerprint, Eye, EyeOff, Search, Zap, ArrowUpRight, Lightbulb, GitCompare, BadgeCheck } from 'lucide-react';

const PasswordAnalysis = ({ data }) => {
  // State definitions
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [title, setTitle] = useState('');
  const [showImprovedDetails, setShowImprovedDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Loading and animation effects
  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 1000);
    const animationTimer = setTimeout(() => setAnimationComplete(true), 2000);
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

  // Memoized password data extraction
  const passwordData = useMemo(() => {
    if (!data) return null;
    if (data.error) return null;
    const original = data.original_analysis || {};
    return {
      password: original.password,
      score: original.score || 0,
      strength_category: original.strength_category || 'Unknown',
      features: original.features || {},
      time_to_crack: original.time_to_crack || {},
      isPwned: data?.hibp?.pwned_count > 0,
      pwnedCount: data?.hibp?.pwned_count || 0,
      suggestions: data.suggestions || [],
      improvedPassword: {
        password: data.improved_password,
        score: data?.improved_analysis?.xgb_analysis?.score,
        strength_category: data?.improved_analysis?.xgb_analysis?.strength_category,
        time_to_crack: data?.improved_analysis?.xgb_analysis?.time_to_crack,
        features: data?.improved_analysis?.xgb_analysis?.features,
      },
      sequence: data.sequence || [],
    };
  }, [data]);

  // Helper functions for styling
  const getScoreColor = (score) => {
    if (score <= 25) return 'bg-red-500';
    if (score <= 50) return 'bg-orange-500';
    if (score <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreTextColor = (score) => {
    if (score <= 25) return 'text-red-500';
    if (score <= 50) return 'text-orange-500';
    if (score <= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Matrix effect for background animation
  const matrixEffect = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {Array(5).fill().map((_, i) => (
        <div
          key={i}
          className="absolute top-0 flex flex-col"
          style={{
            animation: `matrixDrop ${Math.random() * 5 + 3}s linear infinite`,
            left: `${Math.random() * 100}%`,
          }}
        >
          {Array(5).fill().map((_, j) => (
            <span
              key={j}
              className="text-green-700 text-xs"
              style={{ animation: `flicker ${Math.random() * 2 + 0.5}s infinite` }}
            >
              {String.fromCharCode(33 + Math.floor(Math.random() * 50))}
            </span>
          ))}
        </div>
      ))}
    </div>
  ), []);

  // Render functions
  const renderSequence = (sequence) => (
    <div className="bg-gray-900 p-3 rounded-md border border-gray-700 mb-4">
      <h2 className="text-lg mb-2 border-b border-green-800 pb-1 flex items-center">
        <Search className="mr-2 h-4 w-4" /> Pattern Analysis
      </h2>
      {sequence?.map((item, index) => (
        <div key={index} className="mb-3 last:mb-0">
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <Zap className="text-yellow-500 mr-2 h-4 w-4" />
              <span className="text-base capitalize">{item.pattern} Pattern</span>
            </div>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded mt-1">
              Position {item.i} → {item.j}
            </span>
          </div>
          <div className="bg-black bg-opacity-50 p-2 rounded border border-gray-800 text-sm">
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
            <div className="mt-2 mb-1 text-xs text-gray-400">Character position:</div>
            <div className="flex mb-2 overflow-x-auto">
              {passwordData.password?.split('').map((char, charIndex) => (
                <div
                  key={charIndex}
                  className={`flex-1 p-1 text-center border text-xs ${
                    charIndex >= item.i && charIndex <= item.j
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-300'
                      : 'border-gray-700 text-gray-500'
                  }`}
                >
                  {char}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-300">
              {item.pattern === 'bruteforce' && <p>This section can only be cracked by brute force.</p>}
              {item.pattern === 'dictionary' && <p>This section matches a common word or phrase.</p>}
              {item.pattern === 'sequence' && <p>This section follows a predictable sequence.</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderImprovedPassword = () => {
    if (!passwordData?.improvedPassword?.password) return null;

    return (
      <div className="bg-gray-900 p-3 rounded-md border border-purple-900 mb-4 transition-all duration-500">
        <h2 className="text-lg mb-2 border-b border-purple-800 pb-1 flex items-center justify-between">
          <div className="flex items-center">
            <ArrowUpRight className="mr-2 text-purple-400 h-4 w-4" />
            <span className="text-purple-300">Improved Password</span>
          </div>
          <button
            onClick={() => setShowImprovedDetails(!showImprovedDetails)}
            className="text-purple-400 hover:text-purple-300 text-xs py-2 px-3"
          >
            {showImprovedDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </h2>
        <div className="bg-black bg-opacity-40 p-2 rounded border border-purple-900 text-sm">
          <div className="flex flex-col mb-2">
            <span>Password:</span>
            <div className="flex items-center mt-1">
              <code className="bg-purple-900 bg-opacity-40 px-2 py-1 rounded text-purple-300 text-xs">
                {showPassword ? passwordData.improvedPassword.password : '•'.repeat(passwordData.improvedPassword.password.length)}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-purple-400 hover:text-purple-300 p-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <span>Strength Score:</span>
            <span className={getScoreTextColor(passwordData.improvedPassword.score)}>
              {passwordData.improvedPassword.score}/100 ({passwordData.improvedPassword.strength_category})
            </span>
          </div>
        </div>
        {showImprovedDetails && (
          <div className="mt-3 bg-black bg-opacity-40 p-2 rounded border border-purple-900 text-sm">
            <h3 className="text-base mb-2 flex items-center text-purple-400">
              <Clock className="mr-2 h-4 w-4" /> Time to Crack
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {passwordData.improvedPassword.time_to_crack &&
                Object.entries(passwordData.improvedPassword.time_to_crack).map(([algorithm, time]) => (
                  <div key={algorithm} className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</span>
                      <span className="text-purple-300">{time}</span>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="mt-3 bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded flex items-center w-full justify-center text-sm"
            >
              <GitCompare className="mr-2 h-4 w-4" />
              {showComparison ? 'Hide Comparison' : 'Compare with Original'}
            </button>
            {showComparison && (
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <h4 className="text-xs text-purple-400 mb-2">Original Password</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span>{passwordData.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strength:</span>
                      <span>{passwordData.strength_category}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-purple-400 mb-2">Improved Password</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span>{passwordData.improvedPassword.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strength:</span>
                      <span>{passwordData.improvedPassword.strength_category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!passwordData.suggestions || passwordData.suggestions.length === 0) return null;

    return (
      <div className="mb-4 bg-gray-900 p-3 rounded-md border border-blue-900">
        <h2 className="text-lg mb-2 border-b border-blue-800 pb-1 flex items-center">
          <Lightbulb className="mr-2 text-yellow-400 h-4 w-4" /> Password Improvement Suggestions
        </h2>
        <div className="space-y-2">
          {passwordData.suggestions.map((suggestion, index) => (
            <div key={index} className="bg-black bg-opacity-40 p-2 rounded border border-blue-800 flex items-start">
              <BadgeCheck className="text-blue-400 mr-2 mt-1 flex-shrink-0 h-4 w-4" />
              <p className="text-blue-200 text-xs">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPasswordComposition = () => {
    if (!passwordData?.features) return null;

    const features = passwordData.features;
    return (
      <div className="mb-4 bg-gray-900 bg-opacity-60 p-3 rounded-md border border-gray-800">
        <h3 className="text-base mb-3 flex items-center">
          <span className="text-green-400">Password Composition</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Length</span>
              <span className="text-green-400">{features.length}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.min((features.length / 20) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Entropy</span>
              <span className="text-blue-400">{features.entropy.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.min((features.entropy / 5) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Uppercase</span>
              <span className="text-purple-400">{features.upper}</span>
            </div>
          </div>
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Lowercase</span>
              <span className="text-purple-400">{features.lower}</span>
            </div>
          </div>
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Digits</span>
              <span className="text-yellow-400">{features.digits}</span>
            </div>
          </div>
          <div className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
            <div className="flex justify-between mb-1 text-xs">
              <span>Special</span>
              <span className="text-yellow-400">{features.special}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Error display
  if (data?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-red-900 text-white p-4 rounded-lg shadow-lg font-mono border border-red-800">
          <h2 className="text-lg mb-3 flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Error
          </h2>
          <p className="text-sm">{data.error}</p>
          {data.details && <p className="mt-2 text-xs opacity-75">{data.details}</p>}
        </div>
      </div>
    );
  }

  if (!passwordData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-gray-900 text-white p-4 rounded-lg shadow-lg font-mono border border-gray-800">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-black text-green-500 p-4 rounded-lg shadow-lg font-mono border border-green-900 relative">
        <div className="relative z-10">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 rounded-lg">
              <div className="text-center">
                <RefreshCw className="animate-spin h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="text-green-500 text-base">Analyzing password security...</div>
              </div>
            </div>
          )}
          <h1 className="text-xl mb-4 flex items-center">
            <Fingerprint className="mr-2 h-4 w-4" />
            <span>{title}</span>
            {title === fullTitle ? null : <span className="animate-pulse">▌</span>}
          </h1>
          <div className="mb-4 bg-black bg-opacity-60 p-3 rounded-md border border-green-900">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shield className="mr-2 text-yellow-500 h-4 w-4" />
                <span className="text-base">Password:</span>
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-green-400 hover:text-green-300 p-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 font-bold text-lg tracking-wider">
              {showPassword ? passwordData?.password : '•'.repeat(passwordData?.password?.length || 0)}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Security Score: {passwordData?.score}/100</span>
              <span className={getScoreTextColor(passwordData?.score)}>{passwordData?.strength_category}</span>
            </div>
            <div className="h-3 w-full bg-gray-800 rounded overflow-hidden">
              <div
                className={`h-full ${getScoreColor(passwordData?.score)} transition-all duration-1000 ease-out`}
                style={{ width: animationComplete ? `${passwordData?.score}%` : '0%' }}
              />
            </div>
          </div>
          {passwordData.isPwned && (
            <div className="mb-4 bg-red-900 bg-opacity-30 border border-red-800 p-3 rounded flex items-start animate-pulse">
              <AlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0 h-4 w-4" />
              <div>
                <h3 className="text-red-400 font-bold text-sm">Password Breach Alert!</h3>
                <p className="text-red-300 text-xs">Appears in {passwordData.pwnedCount?.toLocaleString()} breaches.</p>
              </div>
            </div>
          )}
          {renderSuggestions()}
          {renderImprovedPassword()}
          {renderSequence(passwordData.sequence)}
          {renderPasswordComposition()}
          <div className="mb-4">
            <h2 className="text-lg mb-2 border-b border-green-800 pb-1 flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Time to Crack
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {passwordData.time_to_crack &&
                Object.entries(passwordData.time_to_crack).map(([algorithm, time]) => (
                  <div key={algorithm} className="bg-black bg-opacity-40 p-2 rounded border border-gray-800">
                    <div className="flex justify-between mb-2 text-xs">
                      <span>{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</span>
                      <span className="text-red-400">{time}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-1500 ease-out rounded"
                        style={{ width: animationComplete ? '100%' : '0%', transitionDelay: '500ms' }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {matrixEffect}
      </div>
      <style jsx>{`
        @keyframes matrixDrop {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes flicker {
          0%,
          19.999%,
          22%,
          62.999%,
          64%,
          64.999%,
          70%,
          100% {
            opacity: 0.99;
          }
          20%,
          21.999%,
          63%,
          63.999%,
          65%,
          69.999% {
            opacity: 0.4;
          }
        }
        @media (max-width: 640px) {
          .text-xs {
            font-size: 0.65rem;
          }
          .text-sm {
            font-size: 0.8rem;
          }
          .text-base {
            font-size: 0.9rem;
          }
          .text-lg {
            font-size: 1.1rem;
          }
          .text-xl {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PasswordAnalysis;