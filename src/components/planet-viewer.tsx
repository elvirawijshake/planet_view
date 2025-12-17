import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import type { Planet } from '../data/planets';

interface PlanetViewerProps {
  planet: Planet;
}

// Planet mesh component with textures
function PlanetMesh({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load textures based on planet
  const texturePaths = useMemo(() => {
    const paths: string[] = [];
    if (planet.texture) paths.push(planet.texture);
    if (planet.bumpMap) paths.push(planet.bumpMap);
    if (planet.specularMap) paths.push(planet.specularMap);
    if (planet.cloudsTexture) paths.push(planet.cloudsTexture);
    if (planet.ringTexture) paths.push(planet.ringTexture);
    return paths;
  }, [planet]);

  const loadedTextures = useTexture(texturePaths.length > 0 ? texturePaths : ['./textures/earth.jpg']);

  // Map textures to their roles
  const textureMap = useMemo(() => {
    let index = 0;
    const map: {
      main?: THREE.Texture;
      bump?: THREE.Texture;
      specular?: THREE.Texture;
      clouds?: THREE.Texture;
      ring?: THREE.Texture;
    } = {};

    if (planet.texture) map.main = Array.isArray(loadedTextures) ? loadedTextures[index++] : loadedTextures;
    if (planet.bumpMap) map.bump = Array.isArray(loadedTextures) ? loadedTextures[index++] : undefined;
    if (planet.specularMap) map.specular = Array.isArray(loadedTextures) ? loadedTextures[index++] : undefined;
    if (planet.cloudsTexture) map.clouds = Array.isArray(loadedTextures) ? loadedTextures[index++] : undefined;
    if (planet.ringTexture) map.ring = Array.isArray(loadedTextures) ? loadedTextures[index++] : undefined;

    return map;
  }, [loadedTextures, planet]);

  // Auto rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.12;
    }
  });

  // Uranus tilt (98 degrees)
  const tilt = planet.id === 'uranus' ? Math.PI * 0.54 : 0;

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* Main planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        {textureMap.main ? (
          <meshStandardMaterial
            map={textureMap.main}
            bumpMap={textureMap.bump}
            bumpScale={0.05}
            metalness={0.1}
            roughness={0.8}
          />
        ) : (
          <meshStandardMaterial color={planet.color} metalness={0.1} roughness={0.8} />
        )}
      </mesh>

      {/* Clouds layer for Earth */}
      {textureMap.clouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.52, 64, 64]} />
          <meshStandardMaterial
            map={textureMap.clouds}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Rings for Saturn */}
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[1.8, 3, 64]} />
          {textureMap.ring ? (
            <meshStandardMaterial
              map={textureMap.ring}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          ) : (
            <meshStandardMaterial
              color="#F4A460"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          )}
        </mesh>
      )}

      {/* Moons */}
      {planet.moons?.map((moon) => (
        <Moon key={moon.id} moon={moon} />
      ))}
    </group>
  );
}

// Moon component
function Moon({ moon }: { moon: NonNullable<Planet['moons']>[0] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const texture = useTexture(moon.texture);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * moon.orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[moon.orbitRadius, 0, 0]}>
        <sphereGeometry args={[moon.size * 0.3, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[moon.orbitRadius - 0.01, moon.orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Fallback planet without texture (for planets without textures like Pluto)
function FallbackPlanet({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial color={planet.color} metalness={0.1} roughness={0.8} />
    </mesh>
  );
}

// Loading component
function LoadingPlanet({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  );
}

// Sun light source
function SunLight() {
  return (
    <>
      <pointLight position={[10, 5, 10]} intensity={2.5} color="#FFF5E0" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4169E1" />
      <ambientLight intensity={1.5} />
    </>
  );
}

export function PlanetViewer({ planet }: PlanetViewerProps) {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setShowHint(true);
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [planet.id]);

  return (
    <div className="relative w-full h-full">
      <motion.div
        key={planet.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-full"
      >
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-4 backdrop-blur-sm border border-white/10 flex flex-col" Style="background: linear-gradient(20deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8)">
          {/* Drag hint */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm border border-white/20"
            >
              ← Sleep om te draaien →
            </motion.div>
          )}

          {/* Three.js Canvas */}
          <div className="w-full flex-1 relative min-h-0 touch-none select-none">
            <Canvas
              className="absolute inset-0"
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%', display: 'block' }}
              resize={{ scroll: false, debounce: 0 }}
            >
              <SunLight />
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
              
              <Suspense fallback={<LoadingPlanet color={planet.color} />}>
                {planet.texture ? (
                  <PlanetMesh planet={planet} />
                ) : (
                  <FallbackPlanet planet={planet} />
                )}
              </Suspense>

              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={10}
                rotateSpeed={0.5}
              />
            </Canvas>
          </div>

          {/* Interaction indicator */}
          <div className="flex items-center justify-center gap-2 mt-2 text-white/50 text-xs flex-shrink-0">
            <motion.div
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↔
            </motion.div>
            <span>Sleep om 360° te draaien • Scroll om te zoomen</span>
          </div>

          {/* Moon legend if planet has moons */}
          {planet.moons && planet.moons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 flex-shrink-0">
              <div className="text-xs text-white/60 mb-2">Manen:</div>
              <div className="flex flex-wrap gap-2">
                {planet.moons.map((moon) => (
                  <div key={moon.id} className="bg-white/5 px-2 py-1 rounded text-xs">
                    {moon.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
