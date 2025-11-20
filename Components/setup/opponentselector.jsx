import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function OpponentSelector({ allPlayers, currentPlayer, selectedOpponents, onChange, highlightPlayers = [] }) {
  const availablePlayers = allPlayers.filter(name => name !== currentPlayer);

  const toggleOpponent = (opponentName) => {
    if (selectedOpponents.includes(opponentName)) {
      onChange(selectedOpponents.filter(name => name !== opponentName));
    } else {
      onChange([...selectedOpponents, opponentName]);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-white">Select Your Opponents</h4>
      <p className="text-sm text-gray-400 mb-3">
        You only compete with players who also chose you as their opponent
      </p>
      <div className="space-y-2">
        {availablePlayers.map((playerName) => {
          const isHighlighted = highlightPlayers.includes(playerName);
          return (
            <Card 
              key={playerName} 
              className={`p-4 border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                isHighlighted ? 'bg-[#d4af37]/20 border-[#d4af37] border-2' : 'bg-white/5'
              }`}
              onClick={() => toggleOpponent(playerName)}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={playerName}
                  checked={selectedOpponents.includes(playerName)}
                  onCheckedChange={() => toggleOpponent(playerName)}
                  className="border-white/30 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37]"
                />
                <Label htmlFor={playerName} className="text-white font-medium cursor-pointer flex-1">
                  {playerName}
                  {isHighlighted && <span className="ml-2 text-xs text-[#d4af37]">(New)</span>}
                </Label>
              </div>
            </Card>
          );
        })}
      </div>
      {selectedOpponents.length === 0 && (
        <p className="text-sm text-red-400 mt-2">Please select at least one opponent</p>
      )}
    </div>
  );
}