import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import BodyFeatureSelector from '../components/setup/BodyFeatureSelector';
import PreferenceSelector from '../components/setup/PreferenceSelector';
import ExclusionSelector from '../components/setup/ExclusionSelector';
import OpponentSelector from '../components/setup/OpponentSelector';
import { toast } from 'sonner';

export default function PlayerProfiles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');
  const urlPlayerIndex = urlParams.get('playerIndex');
  const isAddingPlayers = urlParams.get('newPlayers') === 'true';

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(parseInt(urlPlayerIndex) || 0);
  const [playerProfiles, setPlayerProfiles] = useState({});
  const [isUpdatingOpponents, setIsUpdatingOpponents] = useState(false);
  const [newPlayerNames, setNewPlayerNames] = useState([]);

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(games => games[0]),
    enabled: !!gameId,
  });

  const { data: existingPlayers } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
  });

  const createPlayersMutation = useMutation({
    mutationFn: async (profiles) => {
      if (existingPlayers && existingPlayers.length > 0) {
        const updatePromises = Object.entries(profiles).map(async ([name, profile]) => {
          const existingPlayer = existingPlayers.find(p => p.name === name);
          if (existingPlayer) {
            return base44.entities.Player.update(existingPlayer.id, {
              body_features: profile.bodyFeatures,
              preferences: profile.preferences,
              exclusions: profile.exclusions,
              opponents: profile.opponents,
            });
          } else {
            return base44.entities.Player.create({
              game_id: gameId,
              name: name,
              body_features: profile.bodyFeatures,
              preferences: profile.preferences,
              exclusions: profile.exclusions,
              opponents: profile.opponents,
              score: 0
            });
          }
        });
        return Promise.all(updatePromises);
      } else {
        const playerPromises = Object.entries(profiles).map(([name, profile]) =>
          base44.entities.Player.create({
            game_id: gameId,
            name: name,
            body_features: profile.bodyFeatures,
            preferences: profile.preferences,
            exclusions: profile.exclusions,
            opponents: profile.opponents,
            score: 0
          })
        );
        return Promise.all(playerPromises);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', gameId] });
      navigate(createPageUrl('GameReview') + `?gameId=${gameId}`);
    },
  });

  useEffect(() => {
    if (game && game.player_names) {
      const initialProfiles = {};
      const existingPlayerNames = existingPlayers?.map(p => p.name) || [];
      const newPlayers = game.player_names.filter(name => !existingPlayerNames.includes(name));
      setNewPlayerNames(newPlayers);

      game.player_names.forEach(name => {
        const existingPlayer = existingPlayers?.find(p => p.name === name);
        initialProfiles[name] = existingPlayer ? {
          bodyFeatures: existingPlayer.body_features || [],
          preferences: existingPlayer.preferences || {},
          exclusions: existingPlayer.exclusions || [],
          opponents: existingPlayer.opponents || []
        } : {
          bodyFeatures: [],
          preferences: {},
          exclusions: [],
          opponents: []
        };
      });
      setPlayerProfiles(initialProfiles);

      // If adding new players, set flag to update existing players' opponents
      if (isAddingPlayers && newPlayers.length > 0) {
        setIsUpdatingOpponents(true);
        // Start with first new player
        const firstNewPlayerIndex = game.player_names.indexOf(newPlayers[0]);
        setCurrentPlayerIndex(firstNewPlayerIndex);
      }
    }
  }, [game, existingPlayers]);

  if (isLoading || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const currentPlayerName = game.player_names[currentPlayerIndex];
  const currentProfile = playerProfiles[currentPlayerName] || {
    bodyFeatures: [],
    preferences: {},
    exclusions: [],
    opponents: []
  };

  const updateCurrentProfile = (updates) => {
    setPlayerProfiles({
      ...playerProfiles,
      [currentPlayerName]: {
        ...currentProfile,
        ...updates
      }
    });
  };

  const handleNext = () => {
    if (currentProfile.bodyFeatures.length === 0) {
      toast.error('Please select at least one body feature');
      return;
    }
    if (currentProfile.opponents.length === 0) {
      toast.error('Please select at least one opponent');
      return;
    }

    // Check if we're updating existing players' opponents FIRST (priority)
    if (isUpdatingOpponents && !newPlayerNames.includes(currentPlayerName)) {
      const existingPlayerNames = game.player_names.filter(name => !newPlayerNames.includes(name));
      const currentExistingIndex = existingPlayerNames.indexOf(currentPlayerName);
      
      if (currentExistingIndex < existingPlayerNames.length - 1) {
        // Move to next existing player
        const nextExistingPlayer = existingPlayerNames[currentExistingIndex + 1];
        const nextIndex = game.player_names.indexOf(nextExistingPlayer);
        setCurrentPlayerIndex(nextIndex);
        return;
      } else {
        // All done, save everything
        createPlayersMutation.mutate(playerProfiles);
        return;
      }
    }

    // If we're configuring new players
    if (isAddingPlayers && newPlayerNames.includes(currentPlayerName)) {
      const currentNewPlayerIndex = newPlayerNames.indexOf(currentPlayerName);
      const isLastNewPlayer = currentNewPlayerIndex === newPlayerNames.length - 1;
      
      if (isLastNewPlayer) {
        // Finished all new players, now update existing players' opponents
        const existingPlayerNames = game.player_names.filter(name => !newPlayerNames.includes(name));
        if (existingPlayerNames.length > 0) {
          const firstExistingPlayerIndex = game.player_names.indexOf(existingPlayerNames[0]);
          setCurrentPlayerIndex(firstExistingPlayerIndex);
          setIsUpdatingOpponents(true);
          return;
        } else {
          // No existing players to update, just save
          createPlayersMutation.mutate(playerProfiles);
          return;
        }
      } else {
        // Move to next new player
        const nextNewPlayer = newPlayerNames[currentNewPlayerIndex + 1];
        const nextIndex = game.player_names.indexOf(nextNewPlayer);
        setCurrentPlayerIndex(nextIndex);
        return;
      }
    }

    // Default behavior for initial setup
    if (currentPlayerIndex < game.player_names.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      createPlayersMutation.mutate(playerProfiles);
    }
  };

  const handleBack = () => {
    if (gameId) {
      navigate(createPageUrl('GameReview') + `?gameId=${gameId}`);
    } else {
      navigate(createPageUrl('GameSetup'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            {isUpdatingOpponents && !newPlayerNames.includes(currentPlayerName) 
              ? `${currentPlayerName}: Update Opponents` 
              : `Player Profile: ${currentPlayerName}`}
          </h1>
          <p className="text-gray-400">
            {isUpdatingOpponents && !newPlayerNames.includes(currentPlayerName)
              ? `New player(s) added • Select if you want to play with them`
              : `Step 2 of 3 • Player ${currentPlayerIndex + 1} of ${game.player_names.length}`}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          {isUpdatingOpponents && !newPlayerNames.includes(currentPlayerName) ? (
            // Only show opponent selector for existing players updating
            <>
              <div className="mb-6 p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
                <p className="text-white text-sm">
                  New player(s) have been added: <span className="font-semibold text-[#d4af37]">{newPlayerNames.join(', ')}</span>
                  <br />
                  Update your opponent list to include or exclude them.
                </p>
              </div>
              <OpponentSelector
                allPlayers={game.player_names}
                currentPlayer={currentPlayerName}
                selectedOpponents={currentProfile.opponents}
                onChange={(opps) => updateCurrentProfile({ opponents: opps })}
                highlightPlayers={newPlayerNames}
              />
            </>
          ) : (
            // Show full profile for new players or initial setup
            <>
              {/* Body Features */}
              <BodyFeatureSelector
                selected={currentProfile.bodyFeatures}
                onChange={(features) => updateCurrentProfile({ bodyFeatures: features })}
              />

              {/* Preferences */}
              <PreferenceSelector
                preferences={currentProfile.preferences}
                onChange={(prefs) => updateCurrentProfile({ preferences: prefs })}
              />

              {/* Exclusions */}
              <ExclusionSelector
                exclusions={currentProfile.exclusions}
                onChange={(excl) => updateCurrentProfile({ exclusions: excl })}
              />

              {/* Opponents */}
              <OpponentSelector
                allPlayers={game.player_names}
                currentPlayer={currentPlayerName}
                selectedOpponents={currentProfile.opponents}
                onChange={(opps) => updateCurrentProfile({ opponents: opps })}
              />
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <div className="flex gap-2">
              {game.player_names.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentPlayerIndex
                      ? 'bg-gradient-to-r from-[#ff6b9d] to-[#d4af37]'
                      : index < currentPlayerIndex
                      ? 'bg-[#d4af37]'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              disabled={createPlayersMutation.isPending}
              size="lg"
              className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-8 py-6 rounded-full shadow-lg"
            >
              {currentPlayerIndex < game.player_names.length - 1 ? 'Next Player' : 'Review Configuration'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}