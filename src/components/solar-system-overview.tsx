import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet } from '../data/planets';

interface SolarSystemOverviewProps {
  planets: Planet[];
  onSelectPlanet: (id: string) => void;
}

// Mini rotating planet for the modal
function MiniPlanetMesh({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const texture = planet.texture ? useTexture(planet.texture) : null;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const tilt = planet.id === 'uranus' ? Math.PI * 0.54 : 0;

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={planet.color} />
        )}
      </mesh>
      {/* Ring for Saturn */}
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[1.3, 2, 32]} />
          <meshStandardMaterial color="#F4A460" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

function FallbackSphere({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Small textured planet for the overview
function SmallTexturedPlanet({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = planet.texture ? useTexture(planet.texture) : null;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const tilt = planet.id === 'uranus' ? Math.PI * 0.54 : 0;

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={planet.color} />
        )}
      </mesh>
      {/* Ring for Saturn */}
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[1.3, 2, 32]} />
          <meshStandardMaterial color="#F4A460" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

export function SolarSystemOverview({ planets, onSelectPlanet }: SolarSystemOverviewProps) {
  const [zoomedPlanet, setZoomedPlanet] = useState<Planet | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position when zooming
  useEffect(() => {
    if (zoomedPlanet) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [zoomedPlanet]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate proper spacing based on relative distances
  const getSpacing = (index: number) => {
    // Base spacing that increases with distance from sun (including Pluto)
    const baseSpacing = [0, 80, 140, 200, 280, 400, 520, 640, 780, 920];
    return baseSpacing[index] || index * 100;
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
          <div className="text-sm text-white/70 mb-2">Zoom</div>
          <div className="flex gap-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              −
            </button>
            <div className="w-12 flex items-center justify-center text-sm">
              {Math.round(scale * 100)}%
            </div>
            <button
              onClick={() => setScale(prev => Math.min(3, prev + 0.2))}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setZoomedPlanet(null);
          }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10 hover:bg-black/60 transition-colors text-sm"
        >
          Reset weergave
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10 text-sm text-white/70 max-w-xs">
        <p>🖱️ Sleep om te bewegen</p>
        <p>🔍 Scroll om te zoomen</p>
        <p>👆 Klik op een planeet voor info</p>
      </div>

      {/* Solar System Container */}
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-start pl-32 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          className="flex items-center gap-0 relative"
        >
          {/* Sun */}
          <div className="relative flex-shrink-0 mr-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-600 relative">
              <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/50" />
              <div className="absolute inset-0 rounded-full blur-2xl bg-yellow-400/30" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white/70">
              Zon
            </div>
          </div>

          {/* Planets */}
          {planets.map((planet, index) => {
            const spacing = getSpacing(index);
            const planetSize = Math.max(20, planet.size * 45);
            
            return (
              <div
                key={planet.id}
                className="relative flex-shrink-0"
                style={{ 
                  marginLeft: index === 0 ? 0 : `${spacing - getSpacing(index - 1)}px`,
                }}
              >
                {/* Orbit line */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-px bg-white/10"
                  style={{
                    width: index === 0 ? '0' : `${spacing - getSpacing(index - 1)}px`,
                    right: '100%'
                  }}
                />

                {/* Planet */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedPlanet(zoomedPlanet?.id === planet.id ? null : planet);
                  }}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="relative cursor-pointer transition-all overflow-hidden rounded-full"
                    style={{
                      width: `${planetSize}px`,
                      height: `${planetSize}px`,
                    }}
                  >
                    {/* 3D Textured Planet */}
                    <Canvas
                      camera={{ position: [0, 0, 2.5], fov: 45 }}
                      style={{ width: '100%', height: '100%', pointerEvents: 'none', borderRadius: '50%' }}
                      gl={{ alpha: true }}
                    >
                      <ambientLight intensity={0.3} />
                      <pointLight position={[5, 3, 5]} intensity={1} />
                      <Suspense fallback={<FallbackSphere color={planet.color} />}>
                        <SmallTexturedPlanet planet={planet} />
                      </Suspense>
                    </Canvas>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                    
                    {/* Zoom icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <ZoomIn className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white/70 group-hover:text-white transition-colors">
                    {planet.name}
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planet Info Modal */}
      <AnimatePresence>
        {zoomedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setZoomedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl p-6 max-w-md w-full border border-white/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setZoomedPlanet(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Planet visualization with 3D preview */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-40 h-40 flex-shrink-0 overflow-hidden rounded-full">
                  <Canvas camera={{ position: [0, 0, 3], fov: 45 }} style={{ width: '100%', height: '100%', borderRadius: '50%' }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[5, 3, 5]} intensity={1} />
                    <Suspense fallback={<FallbackSphere color={zoomedPlanet.color} />}>
                      <MiniPlanetMesh planet={zoomedPlanet} />
                    </Suspense>
                  </Canvas>
                </div>
                <div>
                  <h2 className="mb-1">{zoomedPlanet.name}</h2>
                  <p className="text-sm text-white/70">{zoomedPlanet.description}</p>
                </div>
              </div>

              {/* Facts */}
              <div className="space-y-3 mb-6">
                {zoomedPlanet.facts.map((fact, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="text-sm text-white/60 mb-1">{fact.title}</div>
                    <div>{fact.value}</div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onSelectPlanet(zoomedPlanet.id);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-3 transition-colors"
                >
                  Bekijk in detail
                </button>
                <button
                  onClick={() => setZoomedPlanet(null)}
                  className="px-6 bg-white/5 hover:bg-white/10 rounded-lg py-3 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
