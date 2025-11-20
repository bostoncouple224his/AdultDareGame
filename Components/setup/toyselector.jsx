import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const TOY_OPTIONS = [
  { id: 'dildo', label: 'Dildo' },
  { id: 'butt_plug', label: 'Butt Plug' },
  { id: 'flogger', label: 'Flogger' },
  { id: 'strap_on', label: 'Strap-on' },
  { id: 'handcuffs', label: 'Handcuffs' },
  { id: 'mouth_gag', label: 'Mouth Gag' },
];

export default function ToySelector({ selected, onChange, customToy, onCustomToyChange }) {
  const toggleToy = (toyId) => {
    if (selected.includes(toyId)) {
      onChange(selected.filter(id => id !== toyId));
    } else {
      onChange([...selected, toyId]);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Which toys do you have?</h3>
      <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
      <div className="grid md:grid-cols-3 gap-4">
        {TOY_OPTIONS.map((toy) => (
          <Card
            key={toy.id}
            onClick={() => toggleToy(toy.id)}
            className={cn(
              "p-5 cursor-pointer transition-all duration-300 border-2",
              selected.includes(toy.id)
                ? "bg-gradient-to-br from-[#d4af37]/20 to-[#ff6b9d]/20 border-[#d4af37] shadow-md shadow-[#d4af37]/20"
                : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{toy.label}</span>
              {selected.includes(toy.id) && (
                <div className="bg-[#d4af37] rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Custom Toy Input */}
      <div className="mt-4">
        <label className="block text-sm text-gray-300 mb-2">Custom Toy (Optional)</label>
        <Input
          value={customToy || ''}
          onChange={(e) => onCustomToyChange(e.target.value)}
          placeholder="Enter a custom toy name..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}