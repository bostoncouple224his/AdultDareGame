import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const EXCLUSION_TYPES = [
  { id: 'bondage', label: 'Bondage & Restraints', description: 'Being tied up or restrained' },
  { id: 'public', label: 'Public/Semi-Public', description: 'Challenges outside private space' },
  { id: 'pain', label: 'Pain Play', description: 'Spanking, biting, rough play' },
  { id: 'roleplay', label: 'Role Play', description: 'Acting out scenarios or characters' },
  { id: 'toys', label: 'Sex Toys', description: 'Use of vibrators and other toys' },
];

export default function ExclusionSelector({ exclusions, onChange }) {
  const toggleExclusion = (exclusionId) => {
    if (exclusions.includes(exclusionId)) {
      onChange(exclusions.filter(id => id !== exclusionId));
    } else {
      onChange([...exclusions, exclusionId]);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-white">Exclude Specific Types</h4>
      <p className="text-sm text-gray-400 mb-3">
        You like surprises, but want to exclude certain activities
      </p>
      <div className="space-y-2">
        {EXCLUSION_TYPES.map((type) => (
          <Card key={type.id} className="p-4 bg-white/5 border-white/10">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={type.id}
                checked={exclusions.includes(type.id)}
                onCheckedChange={() => toggleExclusion(type.id)}
                className="mt-1 border-white/30 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <div className="flex-1">
                <Label htmlFor={type.id} className="text-white font-medium cursor-pointer block mb-1">
                  {type.label}
                </Label>
                <p className="text-xs text-gray-400">{type.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}