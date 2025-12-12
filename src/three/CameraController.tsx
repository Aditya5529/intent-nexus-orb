import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useIntentStore } from '@/store/intentStore';

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosition = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  const { 
    cameraTarget, 
    shouldFlyToTarget, 
    setShouldFlyToTarget 
  } = useIntentStore();

  useEffect(() => {
    if (cameraTarget && shouldFlyToTarget) {
      // Calculate camera position to view the target node
      const nodePos = new THREE.Vector3(...cameraTarget);
      const cameraOffset = new THREE.Vector3(3, 2, 5);
      targetPosition.current.copy(nodePos).add(cameraOffset);
      targetLookAt.current.copy(nodePos);
    }
  }, [cameraTarget, shouldFlyToTarget]);

  useFrame(() => {
    if (shouldFlyToTarget && controlsRef.current) {
      // Smooth camera movement
      camera.position.lerp(targetPosition.current, 0.03);
      
      // Smooth look-at transition
      const currentTarget = new THREE.Vector3();
      controlsRef.current.target.copy(currentTarget.lerp(targetLookAt.current, 0.03));
      controlsRef.current.update();

      // Check if we've arrived
      if (camera.position.distanceTo(targetPosition.current) < 0.1) {
        setShouldFlyToTarget(false);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={20}
      enablePan
      panSpeed={0.5}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}
