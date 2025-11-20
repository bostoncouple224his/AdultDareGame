import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScoreBoard from '../components/game/ScoreBoard';
import { Flame, Sparkles } from 'lucide-react';

export default function LevelStart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');
  const nextLevel = urlParams.get('level');

  const [clothingMessage, setClothingMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  useEffect(() => {
    const generateClothingMessage = async () => {
      if (!nextLevel) return;

      const levelInfo = {
        icebreaker: { name: 'Icebreaker', clothing: 'Fully Clothed' },
        level1: { name: 'Foreplay', clothing: 'Only Underwear' },
        level2: { name: 'Warm Up', clothing: 'Partially Naked/Getting Naked' },
        level3: { name: 'Hot & Kinky', clothing: 'Fully Naked/Exposed' },
        level4: { name: 'Extreme', clothing: 'Definitely Naked/Exposed' },
      }[nextLevel];

      setIsGenerating(true);
      try {
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `Generate a short, flirty, and playful message (2-3 sentences max) about the clothing status for the "${levelInfo.name}" level of an adult dare game. The clothing requirement is: ${levelInfo.clothing}. Make it sexy, fun, and encouraging. Keep it under 150 characters.`,
          add_context_from_internet: false
        });
        setClothingMessage(response);
      } catch (error) {
        setClothingMessage(`Time to turn up the heat! ${levelInfo.clothing} for this level. 🔥`);
      } finally {
        setIsGenerating(false);
      }
    };

    generateClothingMessage();
  }, [nextLevel]);

  const handleStartLevel = () => {
    if (!game || !players) return;

    // Randomize turn order
    const shuffledOrder = [...game.player_names].sort(() => Math.random() - 0.5);

    updateGameMutation.mutate({
      current_level: nextLevel,
      current_round: 1,
      current_player_index: 0,
      turn_order: shuffledOrder
    });

    navigate(createPageUrl('GamePlay') + `?gameId=${gameId}`);
  };

  if (!game || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const levelInfo = {
    icebreaker: { name: 'Icebreaker', subtitle: 'Fully Clothed' },
    level1: { name: 'Foreplay', subtitle: 'Only Underwear' },
    level2: { name: 'Warm Up', subtitle: 'Partially Naked' },
    level3: { name: 'Hot & Kinky', subtitle: 'Fully Naked' },
    level4: { name: 'Extreme', subtitle: 'Definitely Naked' },
  }[nextLevel] || { name: 'Next Level', subtitle: '' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Flame className="w-20 h-20 text-[#ff6b9d] mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            {levelInfo.name}
          </h1>
          <p className="text-2xl text-gray-300 mb-2">{levelInfo.subtitle}</p>
        </div>

        {/* Clothing Message */}
        <Card className="bg-gradient-to-br from-[#ff6b9d]/20 to-[#d4af37]/20 backdrop-blur-lg border-2 border-[#ff6b9d]/30 p-8 mb-8">
          <div className="text-center">
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
                <p className="text-lg text-gray-300">Preparing your level...</p>
              </div>
            ) : (
              <p className="text-2xl text-white leading-relaxed">
                {clothingMessage}
              </p>
            )}
          </div>
        </Card>

        {/* Scoreboard */}
        <div className="mb-8">
          <ScoreBoard 
            players={players}
            currentPlayerName={null}
          />
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartLevel}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-12 py-7 text-xl rounded-full shadow-2xl font-semibold"
          >
            Start Level
            <Flame className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}