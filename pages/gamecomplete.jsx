import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Sparkles, Home } from 'lucide-react';

export default function GameComplete() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(games => games[0]),
    enabled: !!gameId,
  });

  const { data: players } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
  });

  if (!game || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white overflow-hidden">
      {/* Animated confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-[#ff6b9d] rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-2 h-2 bg-[#d4af37] rounded-full animate-ping delay-200" />
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-[#ff6b9d] rounded-full animate-ping delay-500" />
        <Sparkles className="absolute top-32 right-20 w-8 h-8 text-[#d4af37] animate-pulse" />
        <Sparkles className="absolute bottom-32 left-32 w-6 h-6 text-[#ff6b9d] animate-pulse delay-300" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        {/* Winner Announcement */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Trophy className="w-24 h-24 text-[#d4af37] mx-auto mb-4 animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#ff6b9d] via-[#d4af37] to-[#ff6b9d] bg-clip-text text-transparent">
            Game Complete!
          </h1>
          <p className="text-2xl text-gray-300 mb-8">All levels conquered! 🎉</p>
        </div>

        {/* Winner Card */}
        <Card className="bg-gradient-to-br from-[#d4af37]/30 to-[#ff6b9d]/30 backdrop-blur-xl border-3 border-[#d4af37] p-12 mb-8 shadow-2xl shadow-[#d4af37]/20">
          <div className="text-center">
            <Crown className="w-16 h-16 text-[#d4af37] mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-4">👑 Winner 👑</h2>
            <p className="text-6xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent mb-4">
              {winner.name}
            </p>
            <div className="inline-block px-8 py-4 bg-white/10 rounded-full">
              <p className="text-4xl font-bold text-white">{winner.score} points</p>
            </div>
          </div>
        </Card>

        {/* Final Standings */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 mb-8">
          <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-[#d4af37]" />
            Final Standings
          </h3>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-6 rounded-xl transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#ff6b9d]/20 border-2 border-[#d4af37]' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-2 border-amber-700' :
                  'bg-white/5 border-2 border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl ${
                    index === 0 ? 'bg-[#d4af37]' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-700' :
                    'bg-white/10'
                  } text-white shadow-lg`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{player.name}</p>
                    {index === 0 && <p className="text-sm text-[#d4af37]">Game Champion</p>}
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
                  {player.score}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Thank You Message */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 mb-8 text-center">
          <p className="text-xl text-gray-300 leading-relaxed">
            Thanks for playing! We hope you had an amazing time. 
            <br />
            Remember: respect, safety, and consent always come first. 💕
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate(createPageUrl('Home'))}
            size="lg"
            className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-12 py-6 text-xl rounded-full shadow-2xl"
          >
            <Home className="w-6 h-6 mr-3" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}