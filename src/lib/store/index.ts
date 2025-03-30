import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  role: 'admin' | 'supplier' | 'warehouse_manager' | 'logistics_coordinator'
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  toggleTheme: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'app-storage',
    }
  )
)

// Inventory Store
interface InventoryItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  category: string
  supplier: string
  reorderPoint: number
}

interface InventoryState {
  items: InventoryItem[]
  setItems: (items: InventoryItem[]) => void
  addItem: (item: InventoryItem) => void
  updateItem: (id: string, item: Partial<InventoryItem>) => void
  removeItem: (id: string) => void
}

export const useInventoryStore = create<InventoryState>()((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}))

// Order Store
interface Order {
  id: string
  customerId: string
  items: Array<{ itemId: string; quantity: number }>
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  createdAt: string
}

interface OrderState {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  removeOrder: (id: string) => void
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      ),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
})) 