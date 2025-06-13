import { Canvas } from '@react-three/fiber';
import StoreLayout from './three/StoreLayout.jsx';
import CoinSystem from './three/CoinSystem.jsx';
import Controls from './three/Controls.jsx';
import HUD from './components/HUD';
import InstructionsOverlay from './components/InstructionsOverlay';
import PauseOverlay from './components/PauseOverlay';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef();

  // Instructions overlay logic
  useEffect(() => {
    if (!showInstructions) return;
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, [showInstructions]);

  // Pause overlay logic: listen for pointer lock changes
  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === canvasRef.current;
      setPaused(!isLocked);
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  // Resume handler
  const handleResume = () => {
    if (canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  return (
    <>
      {showInstructions && <InstructionsOverlay onDismiss={() => setShowInstructions(false)} />}
      {paused && !showInstructions && <PauseOverlay onResume={handleResume} />}
      <Canvas
        ref={canvasRef}
        style={{ height: '100vh', width: '100vw' }}
        camera={{ position: [0, 1.7, 10], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <StoreLayout />
        <CoinSystem />
        <Controls />
      </Canvas>
      <HUD />
    </>
  );
}

export default App;
