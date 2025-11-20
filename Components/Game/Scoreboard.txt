import React from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, Crown } from 'lucide-react';

export default function ScoreBoard({ players, currentPlayerName, turnOrder }) {
  // If turnOrder is provided, use it; otherwise sort by score
  const orderedPlayers = turnOrder 
    ? turnOrder.map(name => players.find(p => p.name === name)).filter(Boolean)
    : [...players].sort((a, b) => b.score - a.score);

  const highestScore = Math.max(...players.map(p => p.score || 0), 0);

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-[#d4af37]" />
        <h3 className="text-xl font-bold text-white">
          {turnOrder ? 'Turn Order' : 'Scoreboard'}
        </h3>
      </div>
      <div className="space-y-3">
        {orderedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              player.name === currentPlayerName
                ? 'bg-[#ff6b9d]/20 border-2 border-[#ff6b9d] shadow-lg'
                : 'bg-white/5 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-white/10 text-gray-300">
                {index + 1}
              </div>
              <div>
                <p className="text-white font-semibold flex items-center gap-2">
                  {player.name}
                  {player.score === highestScore && highestScore > 0 && (
                    <Crown className="w-4 h-4 text-[#d4af37]" />
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
                {player.score}
              </p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}