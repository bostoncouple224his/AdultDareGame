import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ModeSelector({ title, options, selected, onChange }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((option) => (
          <Card
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 border-2",
              selected === option.value
                ? "bg-gradient-to-br from-[#ff6b9d]/20 to-[#d4af37]/20 border-[#ff6b9d] shadow-lg shadow-[#ff6b9d]/20"
                : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2 text-white">{option.label}</h4>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
              {selected === option.value && (
                <div className="ml-4 bg-[#ff6b9d] rounded-full p-1">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}