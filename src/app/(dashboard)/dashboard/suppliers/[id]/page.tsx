import { Suspense } from "react"
import { SupplierForm } from "@/components/suppliers/SupplierForm"

interface Supplier {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  taxId?: string
  paymentTerms?: string
  leadTime: number
  performanceRating: number
  isActive: boolean
  notes?: string
  lastUpdated: string
}

// Mock data - will be replaced with API call
const mockSupplier: Supplier = {
  id: "sup1",
  companyName: "Tech Components Inc.",
  contactName: "John Smith",
  email: "john.smith@techcomponents.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Street",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  postalCode: "94105",
  taxId: "12-3456789",
  paymentTerms: "Net 30",
  leadTime: 5,
  performanceRating: 4.8,
  isActive: true,
  notes: "Reliable supplier with good quality products.",
  lastUpdated: new Date().toISOString()
};

export default function SupplierDetailPage() {
  // In a real app, this would be an API call
  const supplier = mockSupplier;
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SupplierForm supplier={supplier} />
    </Suspense>
  );
} 