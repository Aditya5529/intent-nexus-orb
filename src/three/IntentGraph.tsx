import { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { IntentNode } from './IntentNode';
import { CameraController } from './CameraController';
import { useIntentStore, IntentNode as IntentNodeType } from '@/store/intentStore';
import { demoNodes } from '@/api/backend';

// Generate 3D positions for nodes in a spherical layout
function generateNodePositions(nodes: IntentNodeType[]): (IntentNodeType & { position: [number, number, number] })[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  
  return nodes.map((node, i) => {
    const y = 1 - (i / (nodes.length - 1)) * 2;
    const radius = Math.sqrt(1 - y * y) * 4;
    const theta = goldenAngle * i;
    
    return {
      ...node,
      position: [
        Math.cos(theta) * radius,
        y * 3,
        Math.sin(theta) * radius
      ] as [number, number, number],
    };
  });
}

function Scene() {
  const { nodes, setNodes } = useIntentStore();
  
  // Load demo nodes on mount
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(demoNodes);
    }
  }, [nodes.length, setNodes]);

  const nodesWithPositions = useMemo(() => {
    return generateNodePositions(nodes);
  }, [nodes]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      
      {/* Accent lights */}
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[10, -5, 10]} intensity={0.3} color="#7c3aed" />
      
      {/* Background stars */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      
      {/* Intent nodes */}
      {nodesWithPositions.map((node) => (
        <IntentNode
          key={node.id}
          id={node.id}
          text={node.text}
          position={node.position}
        />
      ))}
      
      {/* Connection lines between nearby nodes */}
      <ConnectionLines nodes={nodesWithPositions} />
      
      {/* Camera controller */}
      <CameraController />
    </>
  );
}

// Render subtle connection lines between nodes
function ConnectionLines({ nodes }: { nodes: { position: [number, number, number] }[] }) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    // Connect each node to its 2 nearest neighbors
    nodes.forEach((node, i) => {
      const nearest = nodes
        .map((other, j) => ({
          index: j,
          distance: Math.sqrt(
            Math.pow(node.position[0] - other.position[0], 2) +
            Math.pow(node.position[1] - other.position[1], 2) +
            Math.pow(node.position[2] - other.position[2], 2)
          ),
        }))
        .filter((d) => d.index !== i)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);

      nearest.forEach((n) => {
        const other = nodes[n.index];
        points.push(
          new THREE.Vector3(...node.position),
          new THREE.Vector3(...other.position)
        );
      });
    });

    return points;
  }, [nodes]);

  if (lineGeometry.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineGeometry.length}
          array={new Float32Array(lineGeometry.flatMap((v) => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#1e3a5f" transparent opacity={0.3} />
    </lineSegments>
  );
}

export function IntentGraph() {
  return (
    <div className="absolute inset-0 bg-background">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
