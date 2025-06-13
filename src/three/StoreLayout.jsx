import { useMemo } from 'react';
import { Box } from '@react-three/drei';

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

function Aisle({ x, color }) {
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
  // Products (colored boxes on shelves)
  const products = SHELF_HEIGHTS.flatMap((y, shelfIdx) => (
    Array.from({ length: PRODUCT_BOXES_PER_SHELF }).map((_, i) => {
      const px = x - AISLE_WIDTH / 2 + 0.25 + (i * (AISLE_WIDTH - 0.5)) / (PRODUCT_BOXES_PER_SHELF - 1);
      const pz = -AISLE_LENGTH / 2 + 1.2 + (shelfIdx % 2 ? 0.2 : -0.2); // alternate z for realism
      const pzStep = (AISLE_LENGTH - 2.4) / (PRODUCT_BOXES_PER_SHELF - 1);
      return (
        <Box
          key={y + '-' + i}
          args={[0.22, 0.32, 0.22]}
          position={[px, y + 0.22, pz + i * pzStep]}
        >
          <meshStandardMaterial color={DEPARTMENT_COLORS[color]} metalness={0.1} roughness={0.5} />
        </Box>
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
      {/* Products */}
      {products}
    </group>
  );
}

export default function StoreLayout() {
  // Floor
  const floor = useMemo(() => (
    <Box args={[40, 0.5, 30]} position={[10, -0.25, 0]}>
      <meshStandardMaterial color="#e0e0e0" />
    </Box>
  ), []);

  // Aisles
  const aisles = useMemo(() => (
    AISLES.map((aisle, i) => <Aisle key={i} x={aisle.x} color={aisle.color} />)
  ), []);

  return (
    <group>
      {floor}
      {aisles}
    </group>
  );
} 