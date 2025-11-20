import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, ArrowRight, RotateCcw, Crown } from 'lucide-react';

export default function LevelComplete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const updateGameMutation = useMutation({
    mutationFn: (updates) => base44.entities.Game.update(gameId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
    },
  });

  if (!game || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leader = sortedPlayers[0];

  const levelName = game.current_level === 'icebreaker' ? 'Icebreaker' :
                   game.current_level === 'level1' ? 'Foreplay' :
                   game.current_level === 'level2' ? 'Warm up' :
                   game.current_level === 'level3' ? 'Hot & Kinky' :
                   'Extreme';

  const handlePlayAgain = () => {
    updateGameMutation.mutate({
      current_round: 1
    });
    navigate(createPageUrl('GamePlay') + `?gameId=${gameId}`);
  };

  const handleNextLevel = () => {
    const levelOrder = ['icebreaker', 'level1', 'level2', 'level3', 'level4'];
    const currentIndex = levelOrder.indexOf(game.current_level);
    const nextLevel = levelOrder[currentIndex + 1];

    if (!nextLevel || nextLevel === 'completed') {
      updateGameMutation.mutate({ status: 'completed', current_level: 'completed' });
      navigate(createPageUrl('GameComplete') + `?gameId=${gameId}`);
    } else {
      navigate(createPageUrl('LevelStart') + `?gameId=${gameId}&level=${nextLevel}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Trophy className="w-20 h-20 text-[#d4af37] mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            {levelName} Complete!
          </h1>
          <p className="text-xl text-gray-300">Great job everyone! 🔥</p>
        </div>

        {/* Current Leader */}
        <Card className="bg-gradient-to-br from-[#d4af37]/20 to-[#ff6b9d]/20 backdrop-blur-lg border-2 border-[#d4af37] p-8 mb-8">
          <div className="text-center">
            <Crown className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Current Leader</h2>
            <p className="text-5xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent mb-2">
              {leader.name}
            </p>
            <p className="text-2xl text-gray-300">{leader.score} points</p>
          </div>
        </Card>

        {/* All Scores */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Scoreboard</h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-[#d4af37]' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-700' :
                    'bg-white/10'
                  } text-white`}>
                    {index + 1}
                  </div>
                  <p className="text-xl font-semibold text-white">{player.name}</p>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
                  {player.score}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={handlePlayAgain}
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 py-6 text-lg font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Another Round
          </Button>
          <Button
            onClick={handleNextLevel}
            size="lg"
            className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white py-6 text-lg"
          >
            Continue to Next Level
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}