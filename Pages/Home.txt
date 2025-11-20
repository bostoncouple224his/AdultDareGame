import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Users, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0817] via-[#2d1b4e] to-[#1e1e1e] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6b9d] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37] rounded-full opacity-10 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Flame className="w-16 h-16 text-[#ff6b9d] animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#ff6b9d] via-[#d4af37] to-[#ff6b9d] bg-clip-text text-transparent">
            The Adult Dare Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Turn up the heat in the bedroom or break the ice at your next game night
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              A playful, seductive dare game designed for couples and groups. With thrilling phases 
              and the chance for a steamy ending, it's all about teasing, tempting, and discovering 
              what really turns you on.
            </p>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#ff6b9d]/50 transition-all duration-300">
                <Sparkles className="w-10 h-10 text-[#d4af37] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Bold Experience</h3>
                <p className="text-sm text-gray-400">
                  Flirty, naughty, dirty, and seriously sexy dares for every taste
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#ff6b9d]/50 transition-all duration-300">
                <Users className="w-10 h-10 text-[#d4af37] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Couples or Groups</h3>
                <p className="text-sm text-gray-400">
                  Play one-on-one or with up to eight people
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#ff6b9d]/50 transition-all duration-300">
                <Heart className="w-10 h-10 text-[#d4af37] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fully Customizable</h3>
                <p className="text-sm text-gray-400">
                  Filter cards, choose toys, and match your desires
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link to={createPageUrl('GameSetup')}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#ff6b9d] to-[#d4af37] hover:from-[#ff5588] hover:to-[#c49d2d] text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-[#ff6b9d]/50 transition-all duration-300 transform hover:scale-105"
                >
                  Start New Game
                  <Flame className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety notice */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-400 italic">
            This game is designed for consenting adults only. Always prioritize safety, 
            respect boundaries, and ensure all activities are legal in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}