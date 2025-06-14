import React from 'react';
import { useCartStore } from '../store/cart';

export default function CartModal({ onClose }) {
  const items = useCartStore(s => s.items);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const clearCart = useCartStore(s => s.clearCart);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px #0003', position: 'relative', maxHeight: 500, overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ margin: '8px 0 16px 0' }}>Your Cart</h2>
        {items.length === 0 ? (
          <div style={{ color: '#888', margin: '32px 0' }}>Your cart is empty.</div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map(item => (
                <li key={item.product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, marginRight: 12 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                    <div style={{ fontSize: 13, color: '#555' }}>x{item.quantity} &nbsp; <span style={{ color: '#0071e3' }}>${item.product.price.toFixed(2)}</span></div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#e00', fontSize: 18, cursor: 'pointer', marginLeft: 8 }} title="Remove">🗑️</button>
                </li>
              ))}
            </ul>
            <div style={{ fontWeight: 600, fontSize: 18, margin: '18px 0 8px 0', textAlign: 'right' }}>Total: ${total.toFixed(2)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button onClick={clearCart} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, cursor: 'pointer' }}>Clear Cart</button>
              <button style={{ background: '#0071e3', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, cursor: 'pointer' }}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 