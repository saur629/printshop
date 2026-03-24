import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.paper === item.paper &&
            i.finish === item.finish
        )
        if (existingIndex > -1) {
          const updated = [...items]
          updated[existingIndex].quantity += item.quantity
          updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice
          set({ items: updated })
        } else {
          set({ items: [...items, { ...item, id: Date.now().toString() }] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        const items = get().items.map((i) =>
          i.id === id ? { ...i, quantity, totalPrice: quantity * i.unitPrice } : i
        )
        set({ items })
      },

      clearCart: () => set({ items: [] }),

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0)
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      get tax() {
        return get().subtotal * 0.18 // 18% GST
      },

      get shipping() {
        return get().subtotal > 5000 ? 0 : 199 // Free above ₹5000, else ₹199
      },

      get total() {
        return get().subtotal + get().tax + get().shipping
      },
    }),
    { name: 'printshop-cart' }
  )
)

export default useCartStore