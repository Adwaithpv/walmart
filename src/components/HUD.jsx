import React from 'react';
import { useGameStore } from '../store';

const hudStyle = {
  position: 'fixed',
  top: 24,
  left: 24,
  color: '#222',
  background: 'rgba(255,255,255,0.92)',
  padding: '16px 32px',
  borderRadius: '16px',
  fontSize: '1.5rem',
  fontWeight: 700,
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
  display: 'flex',
  alignItems: 'center',
  zIndex: 1000,
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
};
const coinStyle = {
  fontSize: '2rem',
  marginRight: '0.5em',
  filter: 'drop-shadow(0 1px 2px #ffd70088)',
};

export default function HUD() {
  const score = useGameStore((state) => state.score);
  return (
    <div style={hudStyle}>
      <span style={coinStyle}>🪙</span>
      <span>Score: {score}</span>
    </div>
  );
} 