import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ACTS = [
  { id: 'kissing', label: 'Kissing', description: 'Passionate kissing and making out' },
  { id: 'oral', label: 'Oral', description: 'Oral stimulation' },
  { id: 'anal', label: 'Anal', description: 'Anal play and stimulation' },
  { id: 'special', label: 'Special / Surprising', description: 'You like surprises and trying new things' },
];

export default function PreferenceSelector({ preferences, onChange }) {
  const togglePreference = (actId, type) => {
    const key = `${actId}_${type}`;
    onChange({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-white">Activate Additional Cards</h4>
      <p className="text-sm text-gray-400 mb-3">
        These cards are only drawn if your opponent has also selected these preferences
      </p>
      <div className="space-y-3">
        {ACTS.map((act) => (
          <Card key={act.id} className="p-4 bg-white/5 border-white/10">
            <div className="mb-3">
              <h5 className="text-white font-medium">{act.label}</h5>
              <p className="text-xs text-gray-400">{act.description}</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${act.id}-do`}
                  checked={preferences[`${act.id}_do`] || false}
                  onCheckedChange={() => togglePreference(act.id, 'do')}
                  className="border-white/30 data-[state=checked]:bg-[#ff6b9d] data-[state=checked]:border-[#ff6b9d]"
                />
                <Label htmlFor={`${act.id}-do`} className="text-sm text-gray-300 cursor-pointer">
                  Do It
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${act.id}-receive`}
                  checked={preferences[`${act.id}_receive`] || false}
                  onCheckedChange={() => togglePreference(act.id, 'receive')}
                  className="border-white/30 data-[state=checked]:bg-[#ff6b9d] data-[state=checked]:border-[#ff6b9d]"
                />
                <Label htmlFor={`${act.id}-receive`} className="text-sm text-gray-300 cursor-pointer">
                  Receive
                </Label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}