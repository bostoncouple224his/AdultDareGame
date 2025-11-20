import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, X, RefreshCw, Volume2 } from 'lucide-react';

export default function ChallengeCard({ challenge, onComplete, onReject, onSkip, isActive = true }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-2 border-[#ff6b9d]/30 p-8 shadow-2xl">
      {/* Challenge Header */}
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-2 bg-[#d4af37]/20 rounded-full mb-4">
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-wide">
            {challenge.is_active ? 'Active Challenge' : 'Passive Challenge'}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {challenge.challenger_name}'s Turn
        </h2>
        <p className="text-gray-400">
          with {challenge.opponents?.join(', ')}
        </p>
      </div>

      {/* Dare Text */}
      <div className="bg-white/5 rounded-2xl p-6 mb-6 min-h-[150px] flex items-center justify-center">
        <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
          {challenge.dare_text}
        </p>
      </div>

      {/* Timer Section */}
      {isActive && (
        <div className="flex justify-center gap-3 mb-6">
          <Button
            onClick={() => startTimer(30)}
            disabled={isTimerRunning}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Clock className="w-4 h-4 mr-2" />
            30 sec
          </Button>
          <Button
            onClick={() => startTimer(60)}
            disabled={isTimerRunning}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Clock className="w-4 h-4 mr-2" />
            60 sec
          </Button>
          {isTimerRunning && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ff6b9d]/20 rounded-lg">
              <Volume2 className="w-5 h-5 text-[#ff6b9d] animate-pulse" />
              <span className="text-2xl font-bold text-white">{timeLeft}s</span>
            </div>
          )}
        </div>
      )}

      {/* Points Display */}
      <div className="text-center mb-6">
        <p className="text-gray-400 mb-2">Points for this challenge</p>
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#ff6b9d]/20 to-[#d4af37]/20 rounded-full">
          <span className="text-3xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            {challenge.points} points
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 font-semibold"
        >
          <Check className="w-5 h-5 mr-2" />
          Accepted & Done
        </Button>
        <Button
          onClick={onReject}
          size="lg"
          className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 py-6 font-semibold"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Change Challenge
        </Button>
      </div>
    </Card>
  );
}