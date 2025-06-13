import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';

// Aisle definitions for collision (from StoreLayout.jsx)
const AISLES = [
  { x: -10, width: 2, length: 24 },
  { x: -4, width: 2, length: 24 },
  { x: 2, width: 2, length: 24 },
  { x: 8, width: 2, length: 24 },
  { x: 14, width: 2, length: 24 },
  { x: 20, width: 2, length: 24 },
];

// Helper: check if a point is inside an aisle's bounding box
function isCollidingWithAisle(x, z) {
  for (const aisle of AISLES) {
    const minX = aisle.x - aisle.width / 2 - 0.5; // 0.5: character half-width
    const maxX = aisle.x + aisle.width / 2 + 0.5;
    const minZ = -aisle.length / 2;
    const maxZ = aisle.length / 2;
    if (x > minX && x < maxX && z > minZ && z < maxZ) {
      return true;
    }
  }
  return false;
}

// Third-person controls: WASD moves character, camera follows behind, mouse rotates character (yaw), collision with aisles
export default function Controls() {
  const { camera, gl } = useThree();
  // Character state: position and yaw (rotation around y)
  const [charPos, setCharPos] = useState([0, 0, 0]);
  const [charYaw, setCharYaw] = useState(0);
  const move = useRef({ forward: false, backward: false, left: false, right: false });
  const pointerLocked = useRef(false);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyW') move.current.forward = true;
      if (e.code === 'KeyS') move.current.backward = true;
      if (e.code === 'KeyA') move.current.left = true;
      if (e.code === 'KeyD') move.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.code === 'KeyW') move.current.forward = false;
      if (e.code === 'KeyS') move.current.backward = false;
      if (e.code === 'KeyA') move.current.left = false;
      if (e.code === 'KeyD') move.current.right = false;
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer lock for mouse look (use gl.domElement)
  useEffect(() => {
    const handlePointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === gl.domElement;
    };
    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl]);

  // Mouse look (yaw only, when pointer locked)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!pointerLocked.current) return;
      setCharYaw((yaw) => yaw - e.movementX * 0.002);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Character movement and camera follow with collision
  useFrame((_, delta) => {
    const speed = 5; // units per second
    let moveX = 0;
    let moveZ = 0;
    if (move.current.forward) {
      moveX += Math.sin(charYaw);
      moveZ += Math.cos(charYaw);
    }
    if (move.current.backward) {
      moveX += -Math.sin(charYaw);
      moveZ += -Math.cos(charYaw);
    }
    if (move.current.left) {
      moveX += Math.cos(charYaw);
      moveZ += -Math.sin(charYaw);
    }
    if (move.current.right) {
      moveX += -Math.cos(charYaw);
      moveZ += Math.sin(charYaw);
    }
    // Normalize
    const len = Math.hypot(moveX, moveZ);
    let [x, y, z] = charPos;
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      const nextX = x + moveX * speed * delta;
      const nextZ = z + moveZ * speed * delta;
      // Only update position if not colliding with any aisle
      if (!isCollidingWithAisle(nextX, nextZ)) {
        x = nextX;
        z = nextZ;
        setCharPos([x, y, z]);
      } else {
        setCharPos([x, y, z]); // Stay in place
      }
    }
    // Expose character position globally for CoinSystem
    window.__CHAR_POS__ = [x, y, z];
    // Camera follows behind and above the character
    const camDist = 3;
    const camHeight = 2;
    camera.position.x = x - Math.sin(charYaw) * camDist;
    camera.position.y = y + camHeight;
    camera.position.z = z - Math.cos(charYaw) * camDist;
    camera.lookAt(x, y + 1, z);
  });

  // Render the character (simple low-poly human)
  const [x, y, z] = charPos;
  return (
    <group position={[x, y, z]} rotation={[0, charYaw, 0]}>
      {/* Body */}
      <Cylinder args={[0.32, 0.32, 1, 24]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#1976d2" /> {/* Shirt color */}
      </Cylinder>
      {/* Head */}
      <Sphere args={[0.28, 24, 24]} position={[0, 1.98, 0]}>
        <meshStandardMaterial color="#f8d9b6" /> {/* Skin tone */}
      </Sphere>
      {/* Left leg */}
      <Cylinder args={[0.13, 0.13, 0.7, 16]} position={[-0.13, 0.35, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      {/* Right leg */}
      <Cylinder args={[0.13, 0.13, 0.7, 16]} position={[0.13, 0.35, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      {/* Left arm */}
      <Cylinder args={[0.09, 0.09, 0.7, 16]} position={[-0.38, 1.45, 0]} rotation={[0, 0, Math.PI / 8]}>
        <meshStandardMaterial color="#f8d9b6" />
      </Cylinder>
      {/* Right arm */}
      <Cylinder args={[0.09, 0.09, 0.7, 16]} position={[0.38, 1.45, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <meshStandardMaterial color="#f8d9b6" />
      </Cylinder>
    </group>
  );
} 