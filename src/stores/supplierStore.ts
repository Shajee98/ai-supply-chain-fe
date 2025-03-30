import { create } from 'zustand'

interface SupplierFilters {
  searchQuery: string
  statusFilter: string
  locationFilter: string
  performanceFilter: string
}

interface SupplierStore {
  searchQuery: string
  statusFilter: string
  locationFilter: string
  performanceFilter: string
  setFilters: (filters: Partial<SupplierFilters>) => void
}

export const useSupplierStore = create<SupplierStore>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  locationFilter: 'all',
  performanceFilter: 'all',
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
})) 