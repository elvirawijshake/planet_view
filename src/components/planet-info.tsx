import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import type { Planet } from '../data/planets';

interface PlanetInfoProps {
  planet: Planet;
}

export function PlanetInfo({ planet }: PlanetInfoProps) {
  const [expandedFactIndex, setExpandedFactIndex] = useState<number | null>(null);

  return (
    <motion.div
      key={planet.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Planet Name */}
      <div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <h2 className="inline-flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
            {planet.name}
          </h2>
        </motion.div>
        <p className="mt-3 text-white/70">
          {planet.description}
        </p>
      </div>

      {/* Key Facts */}
      <div className="space-y-2">
        <h3 className="text-white/90">Kernfeiten</h3>
        <div className="space-y-2">
          {planet.facts.map((fact, index) => (
            <motion.div
              key={fact.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm text-white/60 mb-1">{fact.title}</div>
                  <div className="text-white">{fact.value}</div>
                  
                  {/* Explanation section */}
                  <AnimatePresence>
                    {expandedFactIndex === index && fact.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-white/70 leading-relaxed overflow-hidden"
                      >
                        {fact.explanation}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${planet.color}30` }}
                  >
                    {index === 0 && '📏'}
                    {index === 1 && '📐'}
                    {index === 2 && '✨'}
                  </div>
                  
                  {/* Info button for facts with explanation */}
                  {fact.explanation && (
                    <button
                      onClick={() => setExpandedFactIndex(expandedFactIndex === index ? null : index)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                      title="Meer informatie"
                    >
                      <HelpCircle className={`w-3.5 h-3.5 transition-transform ${expandedFactIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual comparison */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
        <h4 className="text-xs text-white/60 mb-2">Relatieve grootte</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${planet.size * 40}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: planet.color }}
              />
            </div>
          </div>
          <div className="text-xs text-white/70">
            {planet.size === 1 && '1×'}
            {planet.size < 1 && `${planet.size}×`}
            {planet.size > 1 && `${planet.size}×`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
