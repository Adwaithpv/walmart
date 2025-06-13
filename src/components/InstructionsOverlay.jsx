import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  zIndex: 2000,
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  cursor: 'pointer',
  textAlign: 'center',
};
const boxStyle = {
  background: 'rgba(30,30,30,0.85)',
  borderRadius: '18px',
  padding: '2em 3em',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
  border: '2px solid #fff2',
};

export default function InstructionsOverlay({ onDismiss }) {
  return (
    <div style={overlayStyle} onClick={onDismiss}>
      <div style={boxStyle}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5em' }}>🕹️ Welcome!</div>
        <div>WASD to move<br/>Mouse to rotate<br/>Collect <span style={{fontSize:'2rem'}}>🪙</span> coins!</div>
        <div style={{ fontSize: '1.1rem', marginTop: '1.5em', opacity: 0.7 }}>
          (Click anywhere or wait to start)
        </div>
      </div>
    </div>
  );
} 