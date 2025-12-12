import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useIntentStore } from '@/store/intentStore';
import { motion } from 'framer-motion';

interface IntentNodeProps {
  id: string;
  text: string;
  position: [number, number, number];
}

export function IntentNode({ id, text, position }: IntentNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { 
    activeIntentId, 
    highlightedNodeIds, 
    hoveredNodeId,
    agentDecision,
    setHoveredNode,
    setActiveIntent,
    setCameraTarget,
    setShouldFlyToTarget,
    setPanelOpen
  } = useIntentStore();

  const isActive = activeIntentId === id;
  const isHighlighted = highlightedNodeIds.includes(id);
  const isHovered = hoveredNodeId === id || hovered;

  // Determine confidence color
  const confidence = agentDecision?.intent_id === id ? agentDecision.confidence : null;
  
  const colors = useMemo(() => {
    if (isActive && confidence === 'high') return { main: '#10b981', glow: '#10b981' };
    if (isActive && confidence === 'medium') return { main: '#f59e0b', glow: '#f59e0b' };
    if (isActive && confidence === 'low') return { main: '#ef4444', glow: '#ef4444' };
    if (isActive) return { main: '#00d4ff', glow: '#00d4ff' };
    if (isHighlighted) return { main: '#00d4ff', glow: '#00d4ff' };
    if (isHovered) return { main: '#60a5fa', glow: '#60a5fa' };
    return { main: '#6b7280', glow: '#6b7280' };
  }, [isActive, isHighlighted, isHovered, confidence]);

  // Animation offset for floating effect
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.5 + floatOffset) * 0.1;
      meshRef.current.position.y = position[1] + floatY;

      // Scale animation for active/hovered
      const targetScale = isActive ? 1.4 : isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (glowRef.current) {
      // Pulsing glow animation
      const glowScale = isActive ? 2.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3 : isHovered ? 2 : 1.5;
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 0.1);
      
      // Glow opacity
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isActive ? 0.4 : isHovered ? 0.2 : 0.1;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
    }
  });

  const handleClick = () => {
    setActiveIntent(id);
    setCameraTarget(position);
    setShouldFlyToTarget(true);
    setPanelOpen(true);
  };

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          setHoveredNode(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredNode(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={colors.main}
          emissive={colors.main}
          emissiveIntensity={isActive ? 0.8 : isHovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Tooltip on hover */}
      {isHovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-2 max-w-[200px] shadow-2xl"
          >
            <p className="text-xs font-medium text-primary mb-1">{id}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{text}</p>
          </motion.div>
        </Html>
      )}
    </group>
  );
}
