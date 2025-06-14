import { useMemo, useEffect, useState } from 'react';
import { Box } from '@react-three/drei';
import { products } from '../products.js';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';

// Department colors
const DEPARTMENT_COLORS = [
  '#3a6ea5',    // Electronics (blue)
  '#4caf50',    // Health (green)
  '#e53935',    // Food (red)
  '#ff9800',    // Misc (orange)
  '#8e24aa',    // Misc (purple)
  '#ffd600',    // Misc (yellow)
];

// Aisle layout config
const AISLES = [
  { x: -10, color: 0 },
  { x: -4, color: 1 },
  { x: 2, color: 2 },
  { x: 8, color: 3 },
  { x: 14, color: 4 },
  { x: 20, color: 5 },
];

const SHELF_HEIGHTS = [0.7, 1.5, 2.3]; // y positions for shelves
const SHELF_THICKNESS = 0.12;
const SHELF_DEPTH = 0.5;
const AISLE_WIDTH = 2;
const AISLE_LENGTH = 24;
const SUPPORT_WIDTH = 0.12;
const PRODUCT_BOXES_PER_SHELF = 8;

function ProductBox({ product, position, showPrompt }) {
  const texture = useLoader(TextureLoader, product.image);
  return (
    <group position={position}>
      <Box args={[0.35, 0.5, 0.35]}>
        <meshStandardMaterial map={texture} />
      </Box>
      {showPrompt && (
        <Html center style={{ pointerEvents: 'none' }} position={[0, 0.4, 0]}>
          <div style={{
            background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 16, fontWeight: 600, boxShadow: '0 2px 8px #0006', whiteSpace: 'nowrap'
          }}>
            Press E to view product
          </div>
        </Html>
      )}
    </group>
  );
}

function Aisle({ x, color, aisleIdx, playerPos, nearestProductId }) {
  // Main vertical supports (4 corners)
  const supports = [
    [x - AISLE_WIDTH / 2 + SUPPORT_WIDTH / 2, 1.5, -AISLE_LENGTH / 2 + SUPPORT_WIDTH / 2],
    [x + AISLE_WIDTH / 2 - SUPPORT_WIDTH / 2, 1.5, -AISLE_LENGTH / 2 + SUPPORT_WIDTH / 2],
    [x - AISLE_WIDTH / 2 + SUPPORT_WIDTH / 2, 1.5, AISLE_LENGTH / 2 - SUPPORT_WIDTH / 2],
    [x + AISLE_WIDTH / 2 - SUPPORT_WIDTH / 2, 1.5, AISLE_LENGTH / 2 - SUPPORT_WIDTH / 2],
  ];
  // End caps (small boxes at each end)
  const endCaps = [
    [x, 0.5, -AISLE_LENGTH / 2 - 0.6],
    [x, 0.5, AISLE_LENGTH / 2 + 0.6],
  ];
  // Shelves (horizontal planks)
  const shelves = SHELF_HEIGHTS.map((y) => (
    <Box
      key={y}
      args={[AISLE_WIDTH, SHELF_THICKNESS, AISLE_LENGTH]}
      position={[x, y, 0]}
    >
      <meshStandardMaterial color="#e0e0e0" metalness={0.2} roughness={0.7} />
    </Box>
  ));
  // Products for this aisle
  const aisleProducts = products.filter(p => p.aisleIndex === aisleIdx);
  const productBoxes = SHELF_HEIGHTS.flatMap((y, shelfIdx) => (
    aisleProducts.slice(shelfIdx * PRODUCT_BOXES_PER_SHELF, (shelfIdx + 1) * PRODUCT_BOXES_PER_SHELF).map((product, i) => {
      const px = x - AISLE_WIDTH / 2 + 0.25 + (i * (AISLE_WIDTH - 0.5)) / (PRODUCT_BOXES_PER_SHELF - 1);
      const pz = -AISLE_LENGTH / 2 + 1.2 + (shelfIdx % 2 ? 0.2 : -0.2);
      const pzStep = (AISLE_LENGTH - 2.4) / (PRODUCT_BOXES_PER_SHELF - 1);
      const pos = [px, y + 0.22, pz + i * pzStep];
      const dist = playerPos ? Math.sqrt((playerPos[0] - pos[0]) ** 2 + (playerPos[2] - pos[2]) ** 2) : 999;
      const showPrompt = product.id === nearestProductId && dist < 1.2;
      return (
        <ProductBox
          key={product.id}
          product={product}
          position={pos}
          showPrompt={showPrompt}
        />
      );
    })
  ));
  return (
    <group>
      {/* Main vertical supports */}
      {supports.map((pos, i) => (
        <Box key={i} args={[SUPPORT_WIDTH, 3, SUPPORT_WIDTH]} position={pos}>
          <meshStandardMaterial color="#888" metalness={0.5} roughness={0.4} />
        </Box>
      ))}
      {/* End caps */}
      {endCaps.map((pos, i) => (
        <Box key={i} args={[AISLE_WIDTH, 1, 1.2]} position={pos}>
          <meshStandardMaterial color="#bdbdbd" metalness={0.3} roughness={0.6} />
        </Box>
      ))}
      {/* Shelves */}
      {shelves}
      {/* Real product boxes */}
      {productBoxes}
    </group>
  );
}

export default function StoreLayout({ onProductProximity }) {
  const [playerPos, setPlayerPos] = useState([0, 0, 0]);
  const [nearestProduct, setNearestProduct] = useState(null);

  // Track player position from Controls
  useEffect(() => {
    const update = () => {
      const pos = window.__CHAR_POS__;
      if (pos) setPlayerPos(pos);
      requestAnimationFrame(update);
    };
    update();
    return () => {};
  }, []);

  // Find nearest product within 1.2 units
  useEffect(() => {
    let minDist = 1.2;
    let nearest = null;
    products.forEach(product => {
      // Find product's 3D position
      const aisleIdx = product.aisleIndex;
      const aisle = AISLES[aisleIdx];
      let found = false;
      SHELF_HEIGHTS.forEach((y, shelfIdx) => {
        const idx = products.filter(p => p.aisleIndex === aisleIdx).indexOf(product);
        if (idx >= 0) {
          const i = idx % PRODUCT_BOXES_PER_SHELF;
          const px = aisle.x - AISLE_WIDTH / 2 + 0.25 + (i * (AISLE_WIDTH - 0.5)) / (PRODUCT_BOXES_PER_SHELF - 1);
          const pz = -AISLE_LENGTH / 2 + 1.2 + (shelfIdx % 2 ? 0.2 : -0.2);
          const pzStep = (AISLE_LENGTH - 2.4) / (PRODUCT_BOXES_PER_SHELF - 1);
          const pos = [px, y + 0.22, pz + i * pzStep];
          const dist = Math.sqrt((playerPos[0] - pos[0]) ** 2 + (playerPos[2] - pos[2]) ** 2);
          if (dist < minDist) {
            minDist = dist;
            nearest = { ...product, pos };
            found = true;
          }
        }
      });
      if (found) return;
    });
    setNearestProduct(nearest);
  }, [playerPos]);

  // Listen for E key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && nearestProduct) {
        onProductProximity(nearestProduct);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearestProduct, onProductProximity]);

  // Floor
  const floor = useMemo(() => (
    <Box args={[40, 0.5, 30]} position={[10, -0.25, 0]}>
      <meshStandardMaterial color="#e0e0e0" />
    </Box>
  ), []);
  // Aisles
  const aisles = useMemo(() => (
    AISLES.map((aisle, i) => <Aisle key={i} x={aisle.x} color={aisle.color} aisleIdx={i} playerPos={playerPos} nearestProductId={nearestProduct?.id} />)
  ), [playerPos, nearestProduct]);
  return (
    <group>
      {floor}
      {aisles}
    </group>
  );
} 