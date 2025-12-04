import { useState } from 'react';
import { PlanetViewer } from './components/planet-viewer';
import { PlanetInfo } from './components/planet-info';
import { PlanetSelector } from './components/planet-selector';
import { SolarSystemOverview } from './components/solar-system-overview';
import { planets } from './data/planets';
import { LayoutGrid, Maximize2 } from 'lucide-react';

export default function App() {
  const [selectedPlanetId, setSelectedPlanetId] = useState('earth');
  const [viewMode, setViewMode] = useState<'detail' | 'overview'>('detail');
  
  const selectedPlanet = planets.find(p => p.id === selectedPlanetId) || planets[2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="py-6 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1" />
            <h1 className="text-center">PlanetView</h1>
            <div className="flex-1 flex justify-end gap-2">
              <button
                onClick={() => setViewMode('detail')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'detail' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                title="Detail weergave"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'overview' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                title="Overzicht weergave"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-white/70 max-w-2xl mx-auto">
            {viewMode === 'detail' 
              ? 'Ontdek de planeten van ons zonnestelsel. Sleep om te draaien.'
              : 'Alle planeten op schaal. Klik om in te zoomen.'}
          </p>
        </div>
      </header>

      {viewMode === 'detail' ? (
        <>
          {/* Planet Selector */}
          <PlanetSelector 
            planets={planets}
            selectedId={selectedPlanetId}
            onSelect={setSelectedPlanetId}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-4 lg:h-[calc(100vh-220px)]">
            <div className="grid lg:grid-cols-2 gap-6 h-full">
              {/* 3D Planet Viewer */}
              <div className="order-2 lg:order-1 h-[50vh] lg:h-full min-h-[400px] w-full">
                <PlanetViewer planet={selectedPlanet} />
              </div>

              {/* Planet Information */}
              <div className="order-1 lg:order-2 lg:h-full lg:overflow-y-auto pr-2 custom-scrollbar">
                <PlanetInfo planet={selectedPlanet} />
              </div>
            </div>
          </main>

          {/* Footer Instructions */}
          <footer className="py-3 px-4 text-center text-white/50 text-xs">
            <p>💡 Tip: Sleep de planeet om deze 360° te draaien</p>
          </footer>
        </>
      ) : (
        <SolarSystemOverview 
          planets={planets}
          onSelectPlanet={(id) => {
            setSelectedPlanetId(id);
            setViewMode('detail');
          }}
        />
      )}
    </div>
  );
}