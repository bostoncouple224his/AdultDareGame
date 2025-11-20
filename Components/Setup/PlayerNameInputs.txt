import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PlayerNameInputs({ names, onChange }) {
  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    onChange(newNames.filter(n => n !== ''));
  };

  const removeName = (index) => {
    const newNames = names.filter((_, i) => i !== index);
    onChange(newNames);
  };

  const visibleSlots = Math.min(names.length + 1, 8);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Enter Player Names</h3>
      <p className="text-sm text-gray-400 mb-4">Maximum 8 players</p>
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: visibleSlots }).map((_, index) => (
          <div key={index} className="relative">
            <Label className="text-gray-300 mb-2 block">
              Player {index + 1} {index < 2 && <span className="text-[#ff6b9d]">*</span>}
            </Label>
            <div className="relative">
              <Input
                value={names[index] || ''}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder={`Enter name...`}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
              />
              {names[index] && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                  onClick={() => removeName(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {names.length} player(s) added • Minimum 2 players required
      </p>
    </div>
  );
}