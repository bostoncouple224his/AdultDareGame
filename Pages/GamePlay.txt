import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import ChallengeCard from '../components/game/ChallengeCard';
import RejectDialog from '../components/game/RejectDialog';
import ScoreBoard from '../components/game/ScoreBoard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function GamePlay() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(games => games[0]),
    enabled: !!gameId,
    refetchInterval: 2000,
  });

  const { data: players } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
    refetchInterval: 2000,
  });

  const updateGameMutation = useMutation({
    mutationFn: (updates) => base44.entities.Game.update(gameId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: ({ playerId, updates }) => base44.entities.Player.update(playerId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', gameId] });
    },
  });

  const generateChallenge = async () => {
    if (!game || !players) return;

    setIsGenerating(true);
    try {
      const currentPlayerName = game.turn_order?.[game.current_player_index] || game.player_names[game.current_player_index];
      const currentPlayer = players.find(p => p.name === currentPlayerName);
      if (!currentPlayer) return;

      const eligibleOpponents = players.filter(p => 
        p.name !== currentPlayer.name &&
        currentPlayer.opponents.includes(p.name) &&
        p.opponents.includes(currentPlayer.name)
      );

      if (eligibleOpponents.length === 0) {
        toast.error('No eligible opponents for this player');
        return;
      }

      // Randomly decide how many opponents (1-3, weighted toward 1-2)
      const numOpponents = Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 2 : Math.min(3, eligibleOpponents.length);
      const shuffled = [...eligibleOpponents].sort(() => Math.random() - 0.5);
      const selectedOpponents = shuffled.slice(0, numOpponents);
      const opponents = selectedOpponents.map(p => p.name);

      const levelName = game.current_level === 'icebreaker' ? 'Icebreaker (Fully Clothed)' :
                       game.current_level === 'level1' ? 'Foreplay (Only Underwear)' :
                       game.current_level === 'level2' ? 'Warm up (Partially Naked/Getting Naked)' :
                       game.current_level === 'level3' ? 'Hot & Kinky (Fully Naked)' :
                       'Extreme (Definitely Naked)';

      const opponentFeatures = selectedOpponents.map(p => `${p.name}'s body features: ${p.body_features?.join(', ')}`).join('\n- ');
      
      const prompt = `Generate a creative, seductive dare for an adult dare game.

Context:
- Current Level: ${levelName}
- Person being dared (to do the action): ${currentPlayer.name}
- Other participant(s): ${opponents.join(', ')}
- Intensity: ${game.mode_intense ? 'High' : 'Normal'}
- Available toys: ${game.toys?.join(', ') || 'None'}
- ${currentPlayer.name}'s body features: ${currentPlayer.body_features?.join(', ')}
- ${opponentFeatures}

Preferences that BOTH players have activated:
${Object.keys(currentPlayer.preferences || {}).filter(key => 
  currentPlayer.preferences[key] && randomOpponent.preferences?.[key]
).join(', ')}

Exclusions to AVOID for ALL players:
${[...new Set([...(currentPlayer.exclusions || []), ...(randomOpponent.exclusions || [])])].join(', ')}

Generate ONE dare where:
1. ${currentPlayer.name} is the one being dared (they perform the action)
2. ${opponents.join(', ')} participate(s) with ${currentPlayer.name}
3. Appropriate for the current level (respect clothing status)
4. Respects ALL exclusions
5. Uses available toys when appropriate
6. Clear, specific, and sexy but safe
7. Format: "${opponents.join(' & ')}, [action description for them]. ${currentPlayer.name}, [position or action for them]."
8. 2-3 sentences maximum

Example format: "${randomOpponent.name}, kiss ${currentPlayer.name}'s neck slowly while whispering something naughty. ${currentPlayer.name}, you close your eyes and enjoy the sensation."

Return ONLY the dare text, nothing else.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const isActive = Math.random() > 0.4;
      const basePoints = isActive ? 5 : 3;
      const bonusPoints = opponents.length - 1; // Each additional opponent adds 1 point
      const totalPoints = basePoints + bonusPoints;

      const challenge = {
        game_id: gameId,
        challenger_name: currentPlayer.name,
        opponents: opponents,
        dare_text: response,
        level: game.current_level,
        round: game.current_round,
        is_active: isActive,
        points: totalPoints,
        status: 'pending',
        duration: isActive ? 30 : 0
      };

      setCurrentChallenge(challenge);
    } catch (error) {
      console.error('Failed to generate challenge:', error);
      toast.error('Failed to generate challenge');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (game && players && !currentChallenge && !isGenerating) {
      generateChallenge();
    }
  }, [game, players]);

  const moveToNextPlayer = () => {
    if (!game || !players) return;

    let nextPlayerIndex = game.current_player_index + 1;
    let nextRound = game.current_round;
    let nextLevel = game.current_level;

    const roundsPerLevel = players.length <= 4 ? 3 : 2;
    const playersPerRound = players.length;

    if (nextPlayerIndex >= playersPerRound) {
      nextPlayerIndex = 0;
      nextRound += 1;

      if (nextRound > roundsPerLevel) {
        return 'level_complete';
      }
    }

    updateGameMutation.mutate({
      current_player_index: nextPlayerIndex,
      current_round: nextRound,
      current_level: nextLevel
    });

    setCurrentChallenge(null);
    return 'continue';
  };

  const handleComplete = async () => {
    if (!currentChallenge) return;

    // Award points to the challenger (person who was dared)
    const challenger = players.find(p => p.name === currentChallenge.challenger_name);
    if (challenger) {
      await updatePlayerMutation.mutateAsync({
        playerId: challenger.id,
        updates: { score: challenger.score + currentChallenge.points }
      });
    }

    // Award passive points (3 points) only if 2+ opponents participated
    if (currentChallenge.opponents.length >= 2) {
      const passivePoints = 3;
      const opponentUpdatePromises = currentChallenge.opponents.map(opponentName => {
        const opponent = players.find(p => p.name === opponentName);
        if (opponent) {
          return updatePlayerMutation.mutateAsync({
            playerId: opponent.id,
            updates: { score: opponent.score + passivePoints }
          });
        }
      });
      await Promise.all(opponentUpdatePromises);
    }

    const result = moveToNextPlayer();
    if (result === 'level_complete') {
      navigate(createPageUrl('LevelComplete') + `?gameId=${gameId}`);
    }
  };

  const handleReject = async () => {
    if (!currentChallenge) return;

    const player = players.find(p => p.name === currentChallenge.challenger_name);
    if (player && game.current_level !== 'icebreaker') {
      await updatePlayerMutation.mutateAsync({
        playerId: player.id,
        updates: { score: Math.max(0, player.score - 1) }
      });
    }

    setShowRejectDialog(false);
    setCurrentChallenge(null);
    toast.info('Generating new challenge...');
  };

  const handleSkip = () => {
    setShowRejectDialog(false);
    setCurrentChallenge(null);
    toast.info('Challenge skipped');
  };

  if (!game || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const levelName = game.current_level === 'icebreaker' ? 'Icebreaker (Fully Clothed)' :
                   game.current_level === 'level1' ? 'Foreplay (Only Underwear)' :
                   game.current_level === 'level2' ? 'Warm up (Partially Naked)' :
                   game.current_level === 'level3' ? 'Hot & Kinky (Fully Naked)' :
                   'Extreme (Definitely Naked)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-[#ff6b9d]/20 to-[#d4af37]/20 rounded-full mb-4">
            <span className="text-[#d4af37] font-bold text-lg">
              {levelName} • Round {game.current_round}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Challenge Card */}
          <div className="lg:col-span-2">
            {isGenerating || !currentChallenge ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                <Sparkles className="w-16 h-16 text-[#d4af37] animate-pulse mb-4" />
                <p className="text-xl text-gray-300">Generating your challenge...</p>
              </div>
            ) : (
              <ChallengeCard
                challenge={currentChallenge}
                onComplete={handleComplete}
                onReject={() => setShowRejectDialog(true)}
                onSkip={handleSkip}
              />
            )}
          </div>

          {/* Scoreboard */}
          <div>
            <ScoreBoard 
              players={players}
              currentPlayerName={game.turn_order?.[game.current_player_index] || game.player_names[game.current_player_index]}
              turnOrder={game.turn_order}
            />
          </div>
        </div>

        <RejectDialog
          open={showRejectDialog}
          onClose={() => setShowRejectDialog(false)}
          challengerName={currentChallenge?.challenger_name}
          onReject={handleReject}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}