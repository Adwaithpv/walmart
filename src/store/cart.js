import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [], // { product, quantity }
  addToCart: (product) => set(state => {
    const existing = state.items.find(item => item.product.id === product.id);
    if (existing) {
      // Increment quantity
      return {
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    } else {
      // Add new
      return { items: [...state.items, { product, quantity: 1 }] };
    }
  }),
  removeFromCart: (productId) => set(state => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),
  clearCart: () => set({ items: [] })
})); 