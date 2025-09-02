import React, { useState, useEffect, useCallback, useRef } from 'react';

// Hiragana characters with their romanized equivalents
const hiraganaData = [
  { hiragana: 'あ', romaji: 'a' }, { hiragana: 'い', romaji: 'i' }, { hiragana: 'う', romaji: 'u' }, 
  { hiragana: 'え', romaji: 'e' }, { hiragana: 'お', romaji: 'o' },
  { hiragana: 'か', romaji: 'ka' }, { hiragana: 'き', romaji: 'ki' }, { hiragana: 'く', romaji: 'ku' }, 
  { hiragana: 'け', romaji: 'ke' }, { hiragana: 'こ', romaji: 'ko' },
  { hiragana: 'さ', romaji: 'sa' }, { hiragana: 'し', romaji: 'shi' }, { hiragana: 'す', romaji: 'su' }, 
  { hiragana: 'せ', romaji: 'se' }, { hiragana: 'そ', romaji: 'so' },
  { hiragana: 'た', romaji: 'ta' }, { hiragana: 'ち', romaji: 'chi' }, { hiragana: 'つ', romaji: 'tsu' }, 
  { hiragana: 'て', romaji: 'te' }, { hiragana: 'と', romaji: 'to' },
  { hiragana: 'な', romaji: 'na' }, { hiragana: 'に', romaji: 'ni' }, { hiragana: 'ぬ', romaji: 'nu' }, 
  { hiragana: 'ね', romaji: 'ne' }, { hiragana: 'の', romaji: 'no' },
  { hiragana: 'は', romaji: 'ha' }, { hiragana: 'ひ', romaji: 'hi' }, { hiragana: 'ふ', romaji: 'fu' }, 
  { hiragana: 'へ', romaji: 'he' }, { hiragana: 'ほ', romaji: 'ho' },
  { hiragana: 'ま', romaji: 'ma' }, { hiragana: 'み', romaji: 'mi' }, { hiragana: 'む', romaji: 'mu' }, 
  { hiragana: 'め', romaji: 'me' }, { hiragana: 'も', romaji: 'mo' },
  { hiragana: 'や', romaji: 'ya' }, { hiragana: 'ゆ', romaji: 'yu' }, { hiragana: 'よ', romaji: 'yo' },
  { hiragana: 'ら', romaji: 'ra' }, { hiragana: 'り', romaji: 'ri' }, { hiragana: 'る', romaji: 'ru' }, 
  { hiragana: 'れ', romaji: 're' }, { hiragana: 'ろ', romaji: 'ro' },
  { hiragana: 'わ', romaji: 'wa' }, { hiragana: 'を', romaji: 'wo' }, { hiragana: 'ん', romaji: 'n' }
];

// Japanese Interactive Background Component
const JapaneseInteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });
  const [sakura, setSakura] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [time, setTime] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef(null);

  // Initialize sakura petals
  useEffect(() => {
    const initialSakura = [];
    for (let i = 0; i < 60; i++) {
      initialSakura.push({
        id: i,
        x: Math.random() * 1200,
        y: Math.random() * 800 - 200,
        size: Math.random() * 10 + 3,
        rotation: Math.random() * 360,
        speed: Math.random() * 0.4 + 0.1,
        sway: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    setSakura(initialSakura);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 1);
      
      setSakura(prev => prev.map(petal => {
        let newX = petal.x + Math.sin(time * 0.008 + petal.id) * petal.sway;
        let newY = petal.y + petal.speed;
        let newRotation = petal.rotation + 0.8;
        
        // Reset position when off screen
        if (newY > 700) {
          newY = -50;
          newX = Math.random() * 1200;
        }
        
        // Mouse interaction - petals avoid cursor gently
        const distance = Math.sqrt((newX - mousePos.x) ** 2 + (newY - mousePos.y) ** 2);
        if (distance < 60) {
          const angle = Math.atan2(newY - mousePos.y, newX - mousePos.x);
          newX += Math.cos(angle) * 1.5;
          newY += Math.sin(angle) * 1.5;
        }
        
        return {
          ...petal,
          x: newX,
          y: newY,
          rotation: newRotation,
        };
      }));

      // Update ripples
      setRipples(prev => prev.filter(ripple => ripple.age < 50).map(ripple => ({
        ...ripple,
        age: ripple.age + 1,
        size: ripple.size + 6,
        opacity: Math.max(0, 0.6 - ripple.age / 50),
      })));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [mousePos, time]);

  // Mouse tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Click handler for ripple effects
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    setRipples(prev => [...prev, {
      id: Date.now(),
      x: clickX,
      y: clickY,
      size: 0,
      age: 0,
      opacity: 0.6,
    }]);
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        background: `linear-gradient(135deg, 
          #0f0f23 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #0f3460 75%, 
          #533483 100%
        )`,
        pointerEvents: 'none',
      }}
    >
      {/* Animated mountain silhouette */}
      <div className="absolute bottom-0 w-full opacity-15">
        <svg viewBox="0 0 1200 300" className="w-full h-80">
          <path
            d="M0,300 L0,200 Q200,50 400,120 Q600,20 800,90 Q1000,40 1200,110 L1200,300 Z"
            fill="url(#mountainGrad)"
          />
          <defs>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d1b69" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#1a0b3d" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating moon */}
      <div 
        className="absolute rounded-full opacity-60"
        style={{
          top: '8%',
          right: '15%',
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle at 30% 30%, 
            #ffeaa7, 
            #fdcb6e, 
            #e17055
          )`,
          boxShadow: '0 0 60px rgba(255, 234, 167, 0.3)',
          transform: `translateY(${Math.sin(time * 0.015) * 8}px)`,
        }}
      />

      {/* Bamboo stems */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`bamboo-${i}`}
          className="absolute opacity-8"
          style={{
            left: `${15 + i * 18}%`,
            bottom: '0',
            width: '3px',
            height: `${250 + Math.sin(time * 0.008 + i) * 40}px`,
            background: `linear-gradient(to top, 
              #27ae60, 
              #2ecc71, 
              #58d68d
            )`,
            transform: `rotate(${Math.sin(time * 0.004 + i) * 2}deg)`,
            transformOrigin: 'bottom center',
          }}
        />
      ))}

      {/* Floating kanji characters (more subtle) */}
      {['美', '愛', '和', '心', '夢', '桜', '月', '星'].map((char, i) => (
        <div
          key={`kanji-${i}`}
          className="absolute text-2xl font-bold opacity-3 pointer-events-none select-none"
          style={{
            left: `${15 + i * 12}%`,
            top: `${25 + Math.sin(time * 0.006 + i) * 25}%`,
            color: '#74b9ff',
            transform: `rotate(${Math.sin(time * 0.008 + i) * 10}deg) scale(${1 + Math.sin(time * 0.01 + i) * 0.15})`,
            fontFamily: 'serif',
          }}
        >
          {char}
        </div>
      ))}

      {/* Sakura petals */}
      {sakura.map((petal) => (
        <div
          key={petal.id}
          className="absolute pointer-events-none"
          style={{
            left: petal.x,
            top: petal.y,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(ellipse 70% 100% at 50% 0%, 
                #ff7675, 
                #fd79a8, 
                transparent 70%
              )`,
              clipPath: 'polygon(50% 0%, 80% 35%, 100% 70%, 50% 100%, 0% 70%, 20% 35%)',
            }}
          />
        </div>
      ))}

      {/* Water ripples on click */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full border-2"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderColor: `rgba(116, 185, 255, ${ripple.opacity})`,
            background: `radial-gradient(circle, 
              rgba(116, 185, 255, ${ripple.opacity * 0.1}) 0%, 
              transparent 70%
            )`,
          }}
        />
      ))}

      {/* Mouse cursor glow */}
      <div
        className="absolute pointer-events-none rounded-full mix-blend-screen"
        style={{
          left: mousePos.x - 30,
          top: mousePos.y - 30,
          width: '60px',
          height: '60px',
          background: `radial-gradient(circle,
            rgba(116, 185, 255, 0.2),
            rgba(255, 118, 117, 0.1),
            transparent
          )`,
          filter: 'blur(8px)',
          transform: `scale(${isClicked ? 1.3 : 1})`,
          transition: 'transform 0.15s ease',
        }}
      />

      {/* Floating lanterns (more subtle) */}
      {[...Array(2)].map((_, i) => (
        <div
          key={`lantern-${i}`}
          className="absolute opacity-40"
          style={{
            left: `${75 + i * 8}%`,
            top: `${35 + Math.sin(time * 0.008 + i * 2) * 15}%`,
            transform: `scale(${0.7 + Math.sin(time * 0.015 + i) * 0.15})`,
          }}
        >
          {/* Lantern body */}
          <div
            className="w-10 h-14 rounded-lg relative"
            style={{
              background: `linear-gradient(45deg, 
                #fd79a8, 
                #fdcb6e, 
                #ff7675
              )`,
              boxShadow: '0 0 15px rgba(253, 121, 168, 0.3)',
            }}
          >
            {/* Lantern glow */}
            <div
              className="absolute inset-1 rounded-lg opacity-70"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 40%, 
                  rgba(255, 255, 255, 0.6), 
                  transparent 70%
                )`,
              }}
            />
            {/* Lantern string */}
            <div
              className="absolute w-0.5 h-6 bg-gray-600 opacity-30"
              style={{
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const HiraganaEnumerator = () => {
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [usedCharacters, setUsedCharacters] = useState([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [gameMode, setGameMode] = useState('jpToEn'); // 'jpToEn' or 'enToJp'
  const [isJapaneseInput, setIsJapaneseInput] = useState(false);

  // Generate new random character (no repeats)
  const generateNewCharacter = useCallback(() => {
    // Check if all characters have been used
    if (usedCharacters.length >= hiraganaData.length) {
      // Game completed
      setGameCompleted(true);
      setIsActive(false);
      setFinalScore(score);
      setCooldownActive(false);
      setIsSubmitting(false);
      return;
    }

    // Find unused characters
    const unusedCharacters = hiraganaData.filter(char => 
      !usedCharacters.some(used => used.hiragana === char.hiragana)
    );
    
    // Select random unused character
    const randomIndex = Math.floor(Math.random() * unusedCharacters.length);
    const selectedCharacter = unusedCharacters[randomIndex];
    
    setCurrentCharacter(selectedCharacter);
    setUsedCharacters(prev => [...prev, selectedCharacter]);
    setCurrentQuestionNumber(prev => prev + 1);
    setUserInput('');
    setFeedback('');
    setTimeLeft(timeLimit);
  }, [usedCharacters, timeLimit, score]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0 && gameStarted && !cooldownActive) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted && !cooldownActive) {
      handleSubmit(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, gameStarted, cooldownActive]);

  // Detect Japanese input method
  const detectJapaneseInput = useCallback((input) => {
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(input);
    setIsJapaneseInput(hasJapanese);
    return hasJapanese;
  }, []);

  // Handle answer submission with cooldown protection
  const handleSubmit = useCallback((timeUp = false) => {
    // Prevent multiple submissions
    if (!currentCharacter || isSubmitting || cooldownActive) return;
    
    // Prevent submission if input is empty and it's not a timeout
    if (!timeUp && !userInput.trim()) return;

    setIsSubmitting(true);
    setCooldownActive(true);

    let isCorrect = false;
    
    if (gameMode === 'jpToEn') {
      // Japanese to English mode
      isCorrect = userInput.toLowerCase().trim() === currentCharacter.romaji;
    } else {
      // English to Japanese mode
      isCorrect = userInput.trim() === currentCharacter.hiragana;
    }
    
    if (timeUp) {
      const correctAnswer = gameMode === 'jpToEn' ? currentCharacter.romaji : currentCharacter.hiragana;
      setFeedback(`⏰ Time's up! The answer was "${correctAnswer}"`);
      setStreak(0);
    } else if (isCorrect) {
      setFeedback('🎉 Correct!');
      setScore(prevScore => prevScore + 1);
      setStreak(prevStreak => prevStreak + 1);
    } else {
      const correctAnswer = gameMode === 'jpToEn' ? currentCharacter.romaji : currentCharacter.hiragana;
      setFeedback(`❌ Incorrect. The answer was "${correctAnswer}"`);
      setStreak(0);
    }

    // Show feedback for 1.5 seconds, then move to next question
    setTimeout(() => {
      setIsSubmitting(false);
      generateNewCharacter();
      
      // Additional 1 second cooldown after new question loads
      setTimeout(() => {
        setCooldownActive(false);
      }, 1000);
    }, 1500);
  }, [currentCharacter, userInput, isSubmitting, cooldownActive, gameMode]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setIsActive(true);
    setScore(0);
    setStreak(0);
    setUsedCharacters([]);
    setCurrentQuestionNumber(0);
    setGameCompleted(false);
    setFinalScore(0);
    setIsSubmitting(false);
    setCooldownActive(false);
    generateNewCharacter();
  };

  // Stop game
  const stopGame = () => {
    setGameStarted(false);
    setIsActive(false);
    setCurrentCharacter(null);
    setFeedback('');
    setUsedCharacters([]);
    setCurrentQuestionNumber(0);
    setGameCompleted(false);
    setIsSubmitting(false);
    setCooldownActive(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (!cooldownActive && !isSubmitting) {
      const value = e.target.value;
      setUserInput(value);
      
      // Detect Japanese input for English to Japanese mode
      if (gameMode === 'enToJp') {
        detectJapaneseInput(value);
      }
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden">
      <JapaneseInteractiveBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-8" style={{ pointerEvents: 'auto' }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
              ひらがな Enumerator
            </h1>
            <p className="text-lg sm:text-xl text-purple-200">
              {gameMode === 'jpToEn' ? 'Japanese to English' : 'English to Japanese'}
            </p>
          </div>

          {/* Game Mode Selection & Controls */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/30 shadow-2xl">
            {/* Game Mode Selector */}
            {!gameStarted && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 pb-4 border-b border-white/20">
                <label className="text-white font-medium text-sm sm:text-base">Game Mode:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGameMode('jpToEn')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 min-h-[44px] ${
                      gameMode === 'jpToEn' 
                        ? 'bg-purple-500 text-white shadow-lg' 
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    🇯🇵 → 🇬🇧 Japanese to English
                  </button>
                  <button
                    onClick={() => setGameMode('enToJp')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 min-h-[44px] ${
                      gameMode === 'enToJp' 
                        ? 'bg-purple-500 text-white shadow-lg' 
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    🇬🇧 → 🇯🇵 English to Japanese
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <label className="text-white font-medium text-sm sm:text-base">Time Limit:</label>
                <select 
                  value={timeLimit} 
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  disabled={gameStarted}
                  className="bg-white/20 text-white px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base min-h-[44px]"
                >
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                {!gameStarted ? (
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    Start Game
                  </button>
                ) : (
                  <button
                    onClick={stopGame}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    Stop Game
                  </button>
                )}
              </div>
            </div>

            {/* Score and Stats */}
            <div className="flex flex-col sm:flex-row justify-between text-white gap-2 sm:gap-0">
              <div className="text-sm sm:text-lg text-center sm:text-left">
                <span className="font-bold">Score: </span>
                <span className="text-yellow-300">{score}</span>
              </div>
              <div className="text-sm sm:text-lg text-center">
                <span className="font-bold">Streak: </span>
                <span className="text-orange-300">{streak}</span>
              </div>
              {gameStarted && (
                <div className="text-sm sm:text-lg text-center sm:text-right">
                  <span className="font-bold">Progress: </span>
                  <span className="text-blue-300">{currentQuestionNumber}/{hiraganaData.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Area */}
          {gameStarted && !gameCompleted && currentCharacter && (
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/30 shadow-2xl">
              {/* Timer / Feedback Area */}
              <div className="text-center mb-4 sm:mb-6">
                {feedback ? (
                  // Show feedback in place of timer
                  <div className="inline-block bg-white/25 rounded-full px-4 sm:px-6 py-3 shadow-lg">
                    <span className="text-lg sm:text-2xl font-bold text-white">
                      {feedback}
                    </span>
                  </div>
                ) : (
                  // Show timer when no feedback
                  <>
                    <div className="inline-block bg-white/25 rounded-full px-3 sm:px-4 py-2 shadow-lg">
                      <span className={`text-lg sm:text-2xl font-bold transition-colors duration-200 ${
                        cooldownActive ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {cooldownActive ? '⏸️' : '⏱️'} {timeLeft}s
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          cooldownActive 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                            : 'bg-gradient-to-r from-green-400 to-yellow-400'
                        }`}
                        style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>

              {/* Character Display */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-block bg-white/25 rounded-3xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl">
                  <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg">
                    {gameMode === 'jpToEn' ? currentCharacter.hiragana : currentCharacter.romaji}
                  </div>
                </div>
                {/* Mode indicator */}
                <div className="mt-4 text-sm sm:text-base text-purple-200">
                  {gameMode === 'jpToEn' 
                    ? 'Type the romanized version' 
                    : 'Type the hiragana character'
                  }
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !cooldownActive && !isSubmitting && userInput.trim()) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder={
                      cooldownActive 
                        ? "Please wait..." 
                        : gameMode === 'jpToEn' 
                          ? "Enter romaji (e.g., ka)..." 
                          : "Enter hiragana (e.g., か)..."
                    }
                    className={`w-full max-w-md mx-auto text-white text-lg sm:text-xl px-4 sm:px-6 py-3 sm:py-4 rounded-xl border focus:outline-none focus:ring-4 text-center min-h-[44px] transition-all duration-200 shadow-lg ${
                      cooldownActive || isSubmitting
                        ? 'bg-gray-600/40 border-gray-500/50 cursor-not-allowed placeholder-gray-400'
                        : 'bg-white/25 border-white/40 focus:ring-purple-400/50 placeholder-white/60'
                    }`}
                    autoFocus
                    disabled={!isActive || cooldownActive || isSubmitting}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    lang={gameMode === 'enToJp' ? 'ja' : 'en'}
                    inputMode={gameMode === 'enToJp' ? 'text' : 'text'}
                  />
                  
                  {/* Japanese Input Indicator */}
                  {gameMode === 'enToJp' && (
                    <div className="mt-2 text-xs sm:text-sm text-center">
                      {isJapaneseInput ? (
                        <span className="text-green-300">✅ Japanese input detected</span>
                      ) : (
                        <div className="text-yellow-300">
                          <span>💡 Switch to Japanese keyboard (JP/あ) to type hiragana</span>
                          <div className="text-xs mt-1 text-purple-200">
                            Windows: Win+Space | Mac: Ctrl+Space | Mobile: Globe/🌐 key
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => handleSubmit()}
                    disabled={!userInput.trim() || !isActive || cooldownActive || isSubmitting}
                    className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg min-h-[44px] min-w-[100px]`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : cooldownActive ? (
                      'Wait...'
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Completed Screen */}
          {gameCompleted && (
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/30 text-center shadow-2xl">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎉</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                Game Complete!
              </h2>
              <div className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-4 sm:mb-6">
                You've practiced all {hiraganaData.length} hiragana characters!
              </div>
              
              {/* Final Stats */}
              <div className="bg-white/15 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-300">{finalScore}</div>
                    <div className="text-sm sm:text-base text-purple-200">Correct Answers</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-300">
                      {Math.round((finalScore / hiraganaData.length) * 100)}%
                    </div>
                    <div className="text-sm sm:text-base text-purple-200">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-300">
                      {Math.max(...usedCharacters.map((_, index) => 
                        index < finalScore ? streak : 0
                      ), streak)}
                    </div>
                    <div className="text-sm sm:text-base text-purple-200">Best Streak</div>
                  </div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="text-sm sm:text-base lg:text-lg text-white mb-4 sm:mb-6 px-2">
                {finalScore === hiraganaData.length ? (
                  <span className="text-green-300 font-bold">🌟 Perfect Score! You're a hiragana master! 🌟</span>
                ) : finalScore >= hiraganaData.length * 0.8 ? (
                  <span className="text-blue-300 font-bold">🎯 Excellent work! You're doing great! 🎯</span>
                ) : finalScore >= hiraganaData.length * 0.6 ? (
                  <span className="text-yellow-300 font-bold">👍 Good job! Keep practicing! 👍</span>
                ) : (
                  <span className="text-purple-300 font-bold">💪 Nice try! Practice makes perfect! 💪</span>
                )}
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[44px]"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Welcome Screen */}
          {!gameStarted && !gameCompleted && (
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/30 text-center shadow-2xl">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎌</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
                Welcome to Hiragana Practice!
              </h2>
              <p className="text-base sm:text-lg text-purple-200 mb-4 sm:mb-6">
                Test your knowledge of all {hiraganaData.length} hiragana characters in both directions! Each character will appear exactly once.
              </p>
              <div className="bg-white/15 rounded-xl p-4 mb-4 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white/15 rounded-lg shadow-md">
                    <div className="text-2xl mb-2">🇯🇵 → 🇬🇧</div>
                    <div className="text-sm text-purple-200">See hiragana, type romaji</div>
                    <div className="text-xs text-purple-300 mt-1">Example: か → ka</div>
                  </div>
                  <div className="p-3 bg-white/15 rounded-lg shadow-md">
                    <div className="text-2xl mb-2">🇬🇧 → 🇯🇵</div>
                    <div className="text-sm text-purple-200">See romaji, type hiragana</div>
                    <div className="text-xs text-purple-300 mt-1">Example: ka → か</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 sm:mb-6">
                {hiraganaData.slice(0, 8).map((char, index) => (
                  <div key={index} className="bg-white/15 rounded-lg p-2 sm:p-3 text-center shadow-md">
                    <div className="text-xl sm:text-2xl font-bold text-white">{char.hiragana}</div>
                    <div className="text-xs sm:text-sm text-purple-200">{char.romaji}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-purple-200">
                Choose your time limit above and click "Start Game" to begin!
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 sm:mt-8 bg-white/15 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/30 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">How to Play:</h3>
            <ul className="text-sm sm:text-base text-purple-200 space-y-2">
              <li>• Choose your game mode: Japanese to English or English to Japanese</li>
              <li>• A character or romaji will appear on screen</li>
              <li>• Type the correct answer before time runs out</li>
              <li>• For English → Japanese mode, switch to Japanese keyboard input</li>
              <li>• Complete all {hiraganaData.length} characters to finish the game!</li>
            </ul>
          </div>
          
          {/* Background interaction note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-purple-300 opacity-60">
              Move your mouse around and click to interact with the background ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiraganaEnumerator;
