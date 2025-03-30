import { create } from 'zustand'

interface InventoryFilters {
  searchQuery: string
  statusFilter: string
  warehouseFilter: string
}

interface InventoryStore {
  searchQuery: string
  statusFilter: string
  warehouseFilter: string
  setFilters: (filters: Partial<InventoryFilters>) => void
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  warehouseFilter: "all",
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
})) 