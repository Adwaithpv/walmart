import React from 'react';

export default function ProductInfoModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px #0003', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }} />
        <h2 style={{ margin: '8px 0' }}>{product.name}</h2>
        <div style={{ color: '#555', marginBottom: 8 }}>{product.category}</div>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>${product.price.toFixed(2)}</div>
        <div style={{ fontSize: 14, color: '#444', marginBottom: 12, maxHeight: 80, overflowY: 'auto' }}>{product.description}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Stock: {product.stock}</div>
        <button onClick={() => onAddToCart(product)} style={{ background: '#0071e3', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 16, cursor: 'pointer' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
} 