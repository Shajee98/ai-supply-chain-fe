"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, AlertTriangle, Package } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInventoryStore } from "../../../../stores/inventoryStore"

enum InventoryStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  DAMAGED = "DAMAGED",
  EXPIRED = "EXPIRED",
  IN_TRANSIT = "IN_TRANSIT"
}

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  cost: number
}

interface Warehouse {
  id: string
  name: string
  city: string
  state: string
}

interface InventoryItem {
  id: string
  quantity: number
  location: string
  status: InventoryStatus
  expiryDate?: string
  lotNumber?: string
  product: Product
  warehouse: Warehouse
}

// Mock data - will be replaced with API call
const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv1",
    quantity: 150,
    location: "Aisle 5, Shelf B",
    status: InventoryStatus.AVAILABLE,
    expiryDate: "2024-06-15",
    lotNumber: "LOT-2024-001",
    product: {
      id: "prod1",
      sku: "SKU-001",
      name: "Industrial Sensor XL-5",
      category: "Electronics",
      price: 499.99,
      cost: 350.00
    },
    warehouse: {
      id: "wh1",
      name: "Main Warehouse",
      city: "New York",
      state: "NY"
    }
  },
  {
    id: "inv2",
    quantity: 75,
    location: "Aisle 3, Shelf A",
    status: InventoryStatus.RESERVED,
    lotNumber: "LOT-2024-002",
    product: {
      id: "prod2",
      sku: "SKU-002",
      name: "Circuit Board A200",
      category: "Electronics",
      price: 345.00,
      cost: 250.00
    },
    warehouse: {
      id: "wh2",
      name: "West Coast Hub",
      city: "Los Angeles",
      state: "CA"
    }
  },
  {
    id: "inv3",
    quantity: 25,
    location: "Aisle 1, Shelf C",
    status: InventoryStatus.DAMAGED,
    lotNumber: "LOT-2024-003",
    product: {
      id: "prod3",
      sku: "SKU-003",
      name: "Steel Connector S-100",
      category: "Hardware",
      price: 25.51,
      cost: 15.00
    },
    warehouse: {
      id: "wh1",
      name: "Main Warehouse",
      city: "New York",
      state: "NY"
    }
  },
  {
    id: "inv4",
    quantity: 100,
    location: "Aisle 2, Shelf D",
    status: InventoryStatus.EXPIRED,
    expiryDate: "2024-01-15",
    lotNumber: "LOT-2023-001",
    product: {
      id: "prod4",
      sku: "SKU-004",
      name: "Temperature Controller",
      category: "Electronics",
      price: 129.50,
      cost: 90.00
    },
    warehouse: {
      id: "wh2",
      name: "West Coast Hub",
      city: "Los Angeles",
      state: "CA"
    }
  },
  {
    id: "inv5",
    quantity: 50,
    location: "In Transit",
    status: InventoryStatus.IN_TRANSIT,
    lotNumber: "LOT-2024-004",
    product: {
      id: "prod5",
      sku: "SKU-005",
      name: "Power Unit P-500",
      category: "Electronics",
      price: 799.99,
      cost: 600.00
    },
    warehouse: {
      id: "wh1",
      name: "Main Warehouse",
      city: "New York",
      state: "NY"
    }
  }
];

export default function InventoryPage() {
  const { toast } = useToast();
  const { searchQuery, statusFilter, warehouseFilter, setFilters } = useInventoryStore();
  
  const { data: inventoryItems = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch('/api/inventory');
      // if (!response.ok) throw new Error('Failed to fetch inventory');
      // return response.json();
      
      // Using mock data for now
      return mockInventoryItems;
    }
  });

  // Filter inventory items based on search query and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.product.sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse.id === warehouseFilter;
    
    return matchesSearch && matchesStatus && matchesWarehouse;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: InventoryStatus) => {
    const variants: Record<InventoryStatus, { variant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning", label: string }> = {
      [InventoryStatus.AVAILABLE]: { variant: "success", label: "Available" },
      [InventoryStatus.RESERVED]: { variant: "warning", label: "Reserved" },
      [InventoryStatus.DAMAGED]: { variant: "destructive", label: "Damaged" },
      [InventoryStatus.EXPIRED]: { variant: "destructive", label: "Expired" },
      [InventoryStatus.IN_TRANSIT]: { variant: "secondary", label: "In Transit" }
    };
    
    return (
      <Badge variant={variants[status].variant}>
        {variants[status].label}
      </Badge>
    );
  };
  
  // Get unique warehouses for filter
  const warehouses = Array.from(new Set(inventoryItems.map(item => item.warehouse)));
  
  // Calculate alerts
  const lowStockItems = inventoryItems.filter(item => item.quantity < 100);
  const expiringItems = inventoryItems.filter(item => 
    item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load inventory data. Please try again.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage and track your inventory across warehouses
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/dashboard/inventory/new">
            <Plus className="h-4 w-4" /> New Item
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory List</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            onValueChange={(value) => setFilters({ statusFilter: value })}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value={InventoryStatus.AVAILABLE}>Available</TabsTrigger>
              <TabsTrigger value={InventoryStatus.RESERVED}>Reserved</TabsTrigger>
              <TabsTrigger value={InventoryStatus.DAMAGED}>Damaged</TabsTrigger>
              <TabsTrigger value={InventoryStatus.EXPIRED}>Expired</TabsTrigger>
              <TabsTrigger value={InventoryStatus.IN_TRANSIT}>In Transit</TabsTrigger>
            </TabsList>
          
            <TabsContent value="all" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Select
                  value={warehouseFilter}
                  onValueChange={(value) => setFilters({ warehouseFilter: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableCaption>A list of your inventory items.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading inventory items...
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No inventory items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product.sku}</TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.product.category}</TableCell>
                        <TableCell>{item.warehouse.name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.expiryDate ? format(new Date(item.expiryDate), 'MMM d, yyyy') : 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" asChild>
                            <Link href={`/dashboard/inventory/${item.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {Object.values(InventoryStatus).map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Select
                    value={warehouseFilter}
                    onValueChange={(value) => setFilters({ warehouseFilter: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableCaption>A list of your inventory items.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Loading inventory items...
                        </TableCell>
                      </TableRow>
                    ) : filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product.sku}</TableCell>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.product.category}</TableCell>
                          <TableCell>{item.warehouse.name}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.expiryDate ? format(new Date(item.expiryDate), 'MMM d, yyyy') : 'N/A'}</TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild>
                              <Link href={`/dashboard/inventory/${item.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Alert for low stock items */}
      {lowStockItems.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              You have {lowStockItems.length} items with low stock levels. Check the inventory list for details.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Alert for expiring items */}
      {expiringItems.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Expiring Items Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              You have {expiringItems.length} items that are expiring soon. Check the inventory list for details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 