import { useMemo } from 'react';
import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import { useRef } from 'react';
import { Howl } from 'howler';

// Coin sound (user must add src/assets/coin.mp3)
const coinSound = new Howl({ src: ['/src/assets/coin.mp3'], volume: 0.5 });

// Coin positions in walkways between aisles
const COIN_POSITIONS = [
  { x: -7, z: -8 },
  { x: -1, z: 0 },
  { x: 5, z: 10 },
  { x: 11, z: -5 },
  { x: 17, z: 7 },
  { x: -7, z: 8 },
  { x: 5, z: -10 },
  { x: 17, z: -3 },
];

export default function CoinSystem() {
  const collectedCoins = useGameStore((state) => state.collectedCoins);
  const collectCoin = useGameStore((state) => state.collectCoin);
  const addScore = useGameStore((state) => state.addScore);
  const charPosRef = useRef([0, 0, 0]);

  // Listen to character position from Controls (global window for simplicity)
  useFrame(() => {
    const charPos = window.__CHAR_POS__;
    if (!charPos) return;
    charPosRef.current = charPos;
    COIN_POSITIONS.forEach((coin, i) => {
      if (collectedCoins.includes(i)) return;
      const dx = charPos[0] - coin.x;
      const dz = charPos[2] - coin.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 1) {
        collectCoin(i);
        addScore(10);
        coinSound.play();
      }
    });
  });

  const coins = useMemo(() => (
    COIN_POSITIONS.map((pos, i) => (
      collectedCoins.includes(i) ? null : (
        <Cylinder
          key={i}
          args={[0.5, 0.5, 0.2, 32]}
          position={[pos.x, 0.6, pos.z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="gold" />
        </Cylinder>
      )
    ))
  ), [collectedCoins]);

  return <group>{coins}</group>;
} 