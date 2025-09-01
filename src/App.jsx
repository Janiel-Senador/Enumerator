import React, { useState, useEffect, useCallback } from 'react';

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

// Floating particles component for interactive background
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: hiraganaData[Math.floor(Math.random() * hiraganaData.length)].hiragana,
      speed: 0.1 + Math.random() * 0.2,
      direction: Math.random() * Math.PI * 2
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction) * particle.speed + 100) % 100,
        y: (particle.y + Math.sin(particle.direction) * particle.speed + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-4xl text-purple-200/20 font-bold transition-all duration-1000"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {particle.char}
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

  // Generate new random character (no repeats)
  const generateNewCharacter = useCallback(() => {
    // Check if all characters have been used
    if (usedCharacters.length >= hiraganaData.length) {
      // Game completed
      setGameCompleted(true);
      setIsActive(false);
      setFinalScore(score);
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
    if (isActive && timeLeft > 0 && gameStarted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      handleSubmit(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, gameStarted]);

  // Handle answer submission
  const handleSubmit = (timeUp = false) => {
    if (!currentCharacter) return;

    const isCorrect = userInput.toLowerCase().trim() === currentCharacter.romaji;
    
    if (timeUp) {
      setFeedback(`⏰ Time's up! The answer was "${currentCharacter.romaji}"`);
      setStreak(0);
    } else if (isCorrect) {
      setFeedback('🎉 Correct!');
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setFeedback(`❌ Incorrect. The answer was "${currentCharacter.romaji}"`);
      setStreak(0);
    }

    setTimeout(() => {
      generateNewCharacter();
    }, 1500);
  };

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
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };



  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
              ひらがな Enumerator
            </h1>
            <p className="text-lg sm:text-xl text-purple-200">
              Test your hiragana knowledge!
            </p>
          </div>

          {/* Game Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
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
                    className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base min-h-[44px]"
                  >
                    Start Game
                  </button>
                ) : (
                  <button
                    onClick={stopGame}
                    className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base min-h-[44px]"
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
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20">
              {/* Timer */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-block bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <span className="text-lg sm:text-2xl font-bold text-white">
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Character Display */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-block bg-white/20 rounded-3xl p-6 sm:p-8 border-2 border-white/30">
                  <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg">
                    {currentCharacter.hiragana}
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && handleSubmit()}
                    placeholder="Enter romaji..."
                    className="w-full max-w-md mx-auto bg-white/20 text-white text-lg sm:text-xl px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-400/50 placeholder-white/60 text-center min-h-[44px]"
                    autoFocus
                    disabled={!isActive}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => handleSubmit()}
                    disabled={!userInput.trim() || !isActive}
                    className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 min-h-[44px] min-w-[100px]"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="text-center mt-4 sm:mt-6">
                  <div className="inline-block bg-white/20 rounded-xl px-4 sm:px-6 py-3">
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {feedback}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Game Completed Screen */}
          {gameCompleted && (
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎉</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                Game Complete!
              </h2>
              <div className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-4 sm:mb-6">
                You've practiced all {hiraganaData.length} hiragana characters!
              </div>
              
              {/* Final Stats */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
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
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[44px]"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Welcome Screen */}
          {!gameStarted && !gameCompleted && (
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎌</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
                Welcome to Hiragana Practice!
              </h2>
              <p className="text-base sm:text-lg text-purple-200 mb-4 sm:mb-6">
                Test your knowledge of all {hiraganaData.length} hiragana characters. Each character will appear exactly once!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 sm:mb-6">
                {hiraganaData.slice(0, 8).map((char, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
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
          <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">How to Play:</h3>
            <ul className="text-sm sm:text-base text-purple-200 space-y-2">
              <li>• A hiragana character will appear on screen</li>
              <li>• Type the romanized version (e.g., か → ka)</li>
              <li>• Submit your answer before time runs out</li>
              <li>• Complete all {hiraganaData.length} characters to finish the game!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive click effects */}
      <style jsx>{`
        .container {
          cursor: pointer;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default HiraganaEnumerator;