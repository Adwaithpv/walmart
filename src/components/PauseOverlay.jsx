import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.65)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.2rem',
  zIndex: 3000,
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  textAlign: 'center',
};
const boxStyle = {
  background: 'rgba(30,30,30,0.92)',
  borderRadius: '18px',
  padding: '2em 3em',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
  border: '2px solid #fff2',
};
const buttonStyle = {
  marginTop: '2em',
  fontSize: '1.2rem',
  padding: '0.7em 2em',
  borderRadius: '8px',
  border: 'none',
  background: '#ffd600',
  color: '#222',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
};

export default function PauseOverlay({ onResume }) {
  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5em' }}>⏸️ Paused</div>
        <div>Press <b>Resume</b> or click the 3D view to continue</div>
        <button style={buttonStyle} onClick={onResume}>Resume</button>
      </div>
    </div>
  );
} 