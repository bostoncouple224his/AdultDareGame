import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const BODY_FEATURES = [
  { id: 'vulva', label: 'Vulva' },
  { id: 'boobs', label: 'Boobs' },
  { id: 'penis', label: 'Penis' },
  { id: 'chest', label: 'Chest' },
];

export default function BodyFeatureSelector({ selected, onChange }) {
  const toggleFeature = (featureId) => {
    if (selected.includes(featureId)) {
      onChange(selected.filter(id => id !== featureId));
    } else {
      onChange([...selected, featureId]);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-white">Body Features</h4>
      <p className="text-sm text-gray-400 mb-3">Select all that apply</p>
      <div className="grid grid-cols-2 gap-3">
        {BODY_FEATURES.map((feature) => (
          <Card
            key={feature.id}
            onClick={() => toggleFeature(feature.id)}
            className={cn(
              "p-4 cursor-pointer transition-all duration-300 border-2",
              selected.includes(feature.id)
                ? "bg-gradient-to-br from-[#d4af37]/20 to-[#ff6b9d]/20 border-[#d4af37]"
                : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{feature.label}</span>
              {selected.includes(feature.id) && (
                <Check className="w-4 h-4 text-[#d4af37]" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}