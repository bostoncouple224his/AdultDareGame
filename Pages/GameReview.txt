import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Users, Settings, Shield, CheckCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function GameReview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(games => games[0]),
    enabled: !!gameId,
  });

  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
  });

  const startGameMutation = useMutation({
    mutationFn: () => base44.entities.Game.update(gameId, {
      status: 'in_progress',
      terms_accepted: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
      const firstLevel = game.mode_icebreaker ? 'icebreaker' : 'level1';
      navigate(createPageUrl('LevelStart') + `?gameId=${gameId}&level=${firstLevel}`);
    },
  });

  const handleStartGame = () => {
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Use to continue');
      return;
    }
    startGameMutation.mutate();
  };

  if (gameLoading || playersLoading || !game || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('PlayerProfiles') + `?gameId=${gameId}`)}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] bg-clip-text text-transparent">
            Review Configuration
          </h1>
          <p className="text-gray-400">Step 3 of 3 • Almost ready to play!</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Game Settings */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#d4af37]" />
                <h2 className="text-2xl font-bold text-white">Game Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(createPageUrl('GameSetup') + `?gameId=${gameId}`)}
                className="text-[#d4af37] hover:text-[#d4af37] hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${game.mode_icebreaker ? 'text-green-400' : 'text-gray-500'}`} />
                <span className="text-gray-300">Icebreaker Cards: {game.mode_icebreaker ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${game.mode_intense ? 'text-green-400' : 'text-gray-500'}`} />
                <span className="text-gray-300">Intense Mode: {game.mode_intense ? 'Active' : 'Normal'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${game.mode_short ? 'text-green-400' : 'text-gray-500'}`} />
                <span className="text-gray-300">Duration: {game.mode_short ? 'Short' : 'Regular'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Toys: {game.toys?.length || 0} selected</span>
              </div>
            </div>
          </Card>

          {/* Players */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-[#d4af37]" />
              <h2 className="text-2xl font-bold text-white">Players ({players.length})</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {players.map((player, index) => (
                <Card key={player.id} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const playerIndex = game.player_names.indexOf(player.name);
                        navigate(createPageUrl('PlayerProfiles') + `?gameId=${gameId}&playerIndex=${playerIndex}`);
                      }}
                      className="text-[#d4af37] hover:text-[#d4af37] hover:bg-white/10 h-8 px-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>• Body Features: {player.body_features?.length || 0}</p>
                    <p>• Opponents: {player.opponents?.length || 0}</p>
                    <p>• Exclusions: {player.exclusions?.length || 0}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Terms of Use */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#d4af37]" />
              <h2 className="text-2xl font-bold text-white">Terms of Use</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-300 leading-relaxed">
                By playing this game, all participants agree to the following terms:
                <br /><br />
                • All players are consenting adults of legal age
                <br />
                • Participants will be respectful to each other
                <br />
                • Only engage in activities by mutual agreement
                <br />
                • Prioritize safety - ensure no one gets hurt
                <br />
                • Always use proper contraception
                <br />
                • Respect each other's boundaries at all times
                <br />
                • Only accept challenges that are legal in your country
                <br />
                • Only do things you feel comfortable with
                <br />
                • You can stop or skip any challenge at any time
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="mt-1 border-white/30 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37]"
              />
              <Label htmlFor="terms" className="text-white cursor-pointer leading-relaxed">
                We confirm that all players are of legal age and accept the Terms of Use
              </Label>
            </div>
          </Card>
        </div>

        {/* Start Game Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleStartGame}
            disabled={!termsAccepted || startGameMutation.isPending}
            size="lg"
            className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-12 py-7 text-xl rounded-full shadow-2xl disabled:opacity-50"
          >
            {startGameMutation.isPending ? 'Starting...' : 'Start Game'}
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}