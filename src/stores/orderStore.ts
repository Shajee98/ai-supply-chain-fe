import { create } from "zustand"

interface OrderFilters {
  searchQuery: string
  statusFilter: string
  supplierFilter: string
}

interface OrderStore extends OrderFilters {
  setFilters: (filters: Partial<OrderFilters>) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  supplierFilter: "all",
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
})) 