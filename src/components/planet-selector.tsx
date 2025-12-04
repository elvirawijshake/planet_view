import { motion } from 'motion/react';
import type { Planet } from '../data/planets';

interface PlanetSelectorProps {
  planets: Planet[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PlanetSelector({ planets, selectedId, onSelect }: PlanetSelectorProps) {
  return (
    <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {planets.map((planet) => {
            const isSelected = planet.id === selectedId;
            
            return (
              <motion.button
                key={planet.id}
                onClick={() => onSelect(planet.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-full
                  transition-all whitespace-nowrap flex-shrink-0
                  ${isSelected 
                    ? 'bg-white/20 border-2' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
                style={{
                  borderColor: isSelected ? planet.color : undefined
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: planet.color }}
                  animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
                <span className={isSelected ? '' : 'text-white/70'}>
                  {planet.name}
                </span>
                
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: `${planet.color}20`,
                      boxShadow: `0 0 20px ${planet.color}40`
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
