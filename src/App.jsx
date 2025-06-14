import { Canvas } from '@react-three/fiber';
import StoreLayout from './three/StoreLayout.jsx';
import CoinSystem from './three/CoinSystem.jsx';
import Controls from './three/Controls.jsx';
import HUD from './components/HUD';
import InstructionsOverlay from './components/InstructionsOverlay';
import PauseOverlay from './components/PauseOverlay';
import { useState, useEffect, useRef } from 'react';
import ProductInfoModal from './components/ProductInfoModal';
import { useCartStore } from './store/cart';
import CartModal from './components/CartModal';

function App() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const addToCart = useCartStore(s => s.addToCart);
  const cartItems = useCartStore(s => s.items);
  const unlockForModal = useRef(false);

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
      if (!isLocked) {
        if (unlockForModal.current) {
          unlockForModal.current = false;
          // Don't pause, just unlocked for modal
          return;
        }
        setPaused(true);
      } else {
        setPaused(false);
      }
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

  // Handler to open product modal and exit pointer lock
  const handleProductProximity = (product) => {
    unlockForModal.current = true;
    if (document.exitPointerLock) document.exitPointerLock();
    setSelectedProduct(product);
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
        <StoreLayout onProductProximity={handleProductProximity} />
        <CoinSystem />
        <Controls />
      </Canvas>
      <HUD />
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 1200 }}>
        <button onClick={() => setCartOpen(true)} style={{ background: 'white', border: '1px solid #ccc', borderRadius: 24, padding: 8, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px #0002', display: 'flex', alignItems: 'center' }}>
          🛒
          <span style={{ marginLeft: 6, fontWeight: 600, color: '#0071e3' }}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </div>
      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
      {selectedProduct && (
        <ProductInfoModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => { addToCart(product); setSelectedProduct(null); }}
        />
      )}
    </>
  );
}

export default App;
