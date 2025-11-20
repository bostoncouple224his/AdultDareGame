import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ModeSelector from '../components/setup/ModeSelector';
import ToySelector from '../components/setup/ToySelector';
import PlayerNameInputs from '../components/setup/PlayerNameInputs';
import { toast } from 'sonner';

export default function GameSetup() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');
  
  const [icebreakerMode, setIcebreakerMode] = useState(false);
  const [intensityMode, setIntensityMode] = useState(false);
  const [durationMode, setDurationMode] = useState(false);
  const [selectedToys, setSelectedToys] = useState([]);
  const [customToy, setCustomToy] = useState('');
  const [playerNames, setPlayerNames] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: existingGame } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(games => games[0]),
    enabled: !!gameId,
  });

  const { data: existingPlayers } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
  });

  useEffect(() => {
    if (existingGame && !isLoaded) {
      setIcebreakerMode(existingGame.mode_icebreaker || false);
      setIntensityMode(existingGame.mode_intense || false);
      setDurationMode(existingGame.mode_short || false);
      
      const toys = existingGame.toys || [];
      const standardToys = toys.filter(t => ['dildo', 'butt_plug', 'flogger', 'strap_on', 'handcuffs', 'mouth_gag'].includes(t));
      const customToys = toys.filter(t => !['dildo', 'butt_plug', 'flogger', 'strap_on', 'handcuffs', 'mouth_gag'].includes(t));
      
      setSelectedToys(standardToys);
      setCustomToy(customToys[0] || '');
      setPlayerNames(existingGame.player_names || []);
      setIsLoaded(true);
    }
  }, [existingGame, isLoaded]);

  const handleContinue = async () => {
    if (playerNames.length < 2) {
      toast.error('Please enter at least 2 player names');
      return;
    }

    setIsCreating(true);
    try {
      const allToys = customToy ? [...selectedToys, customToy] : selectedToys;
      
      if (gameId && existingGame) {
        // Update existing game
        await base44.entities.Game.update(gameId, {
          mode_icebreaker: icebreakerMode,
          mode_intense: intensityMode,
          mode_short: durationMode,
          toys: allToys,
          player_names: playerNames,
        });

        // Handle deleted players
        if (existingPlayers) {
          const deletedPlayers = existingPlayers.filter(p => !playerNames.includes(p.name));
          for (const deletedPlayer of deletedPlayers) {
            await base44.entities.Player.delete(deletedPlayer.id);
          }

          // Remove deleted players from opponent lists
          const remainingPlayers = existingPlayers.filter(p => playerNames.includes(p.name));
          for (const player of remainingPlayers) {
            const updatedOpponents = player.opponents.filter(opp => playerNames.includes(opp));
            if (updatedOpponents.length !== player.opponents.length) {
              await base44.entities.Player.update(player.id, {
                opponents: updatedOpponents
              });
            }
          }
        }

        // Check for new players
        const existingPlayerNames = existingPlayers?.map(p => p.name) || [];
        const newPlayers = playerNames.filter(name => !existingPlayerNames.includes(name));
        
        if (newPlayers.length > 0) {
          // New players were added, go to player profiles with flag
          navigate(createPageUrl('PlayerProfiles') + `?gameId=${gameId}&newPlayers=true`);
        } else {
          // No new players, return to review
          navigate(createPageUrl('GameReview') + `?gameId=${gameId}`);
        }
      } else {
        // Create new game
        const game = await base44.entities.Game.create({
          mode_icebreaker: icebreakerMode,
          mode_intense: intensityMode,
          mode_short: durationMode,
          toys: allToys,
          player_names: playerNames,
          current_level: icebreakerMode ? 'icebreaker' : 'level1',
          current_round: 1,
          current_player_index: 0,
          scores: Object.fromEntries(playerNames.map(name => [name, 0])),
          status: 'setup',
          terms_accepted: false
        });

        navigate(createPageUrl('PlayerProfiles') + `?gameId=${game.id}`);
      }
    } catch (error) {
      toast.error('Failed to save game configuration');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => gameId ? navigate(createPageUrl('GameReview') + `?gameId=${gameId}`) : navigate(createPageUrl('Home'))}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            {gameId ? 'Edit Game Configuration' : 'Configure Your Game'}
          </h1>
          <p className="text-gray-400">{gameId ? 'Update your settings' : 'Step 1 of 3 • Game Settings'}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          {/* Icebreaker Mode */}
          <ModeSelector
            title="Choose Starting Style"
            options={[
              {
                value: false,
                label: 'No Fully Clothed Round',
                description: 'Start in your sexy underwear and dive right in'
              },
              {
                value: true,
                label: 'Activate Icebreaker Cards',
                description: 'Begin fully clothed with light, playful dares'
              }
            ]}
            selected={icebreakerMode}
            onChange={setIcebreakerMode}
          />

          {/* Intensity Mode */}
          <ModeSelector
            title="Choose Intensity Level"
            options={[
              {
                value: false,
                label: 'Normal Level',
                description: 'A balanced mix of playful and spicy challenges'
              },
              {
                value: true,
                label: 'Activate Intense Cards',
                description: 'More penetration and advanced challenges'
              }
            ]}
            selected={intensityMode}
            onChange={setIntensityMode}
          />

          {/* Duration Mode */}
          <ModeSelector
            title="Choose Game Duration"
            options={[
              {
                value: false,
                label: 'Regular Duration',
                description: 'Full experience with 3 rounds per level (2-4 players) or 2 rounds (5-8 players)'
              },
              {
                value: true,
                label: 'Short Game',
                description: 'Quick session with only 2 cards per player per level'
              }
            ]}
            selected={durationMode}
            onChange={setDurationMode}
          />

          {/* Toy Selection */}
          <ToySelector
            selected={selectedToys}
            onChange={setSelectedToys}
            customToy={customToy}
            onCustomToyChange={setCustomToy}
          />

          {/* Player Names */}
          <PlayerNameInputs
            names={playerNames}
            onChange={setPlayerNames}
          />

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleContinue}
              disabled={playerNames.length < 2 || isCreating}
              size="lg"
              className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              {isCreating ? 'Saving...' : gameId ? 'Save Changes' : 'Continue to Player Profiles'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}