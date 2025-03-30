"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Building2, Star, MapPin, AlertTriangle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
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
import { useSupplierStore } from "@/stores/supplierStore"

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
  lastUpdated: string
}

// Mock data - will be replaced with API call
const mockSuppliers: Supplier[] = [
  {
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
    lastUpdated: new Date().toISOString()
  },
  {
    id: "sup2",
    companyName: "Global Electronics Ltd.",
    contactName: "Sarah Johnson",
    email: "sarah.j@globalelectronics.com",
    phone: "+1 (555) 987-6543",
    address: "456 Global Ave",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    taxId: "98-7654321",
    paymentTerms: "Net 45",
    leadTime: 7,
    performanceRating: 4.2,
    isActive: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "sup3",
    companyName: "Quality Parts Co.",
    contactName: "Michael Brown",
    email: "michael.b@qualityparts.com",
    phone: "+1 (555) 456-7890",
    address: "789 Quality Blvd",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60601",
    taxId: "45-6789012",
    paymentTerms: "Net 60",
    leadTime: 10,
    performanceRating: 3.5,
    isActive: false,
    lastUpdated: new Date().toISOString()
  }
];

export default function SuppliersPage() {
  const { toast } = useToast();
  const { searchQuery, statusFilter, locationFilter, performanceFilter, setFilters } = useSupplierStore();
  
  // Use React Query for data fetching
  const { data: suppliers = [], isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch('/api/suppliers');
      // if (!response.ok) throw new Error('Failed to fetch suppliers');
      // return response.json();
      
      // Using mock data for now
      return mockSuppliers;
    }
  });

  // Filter suppliers based on search query and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && supplier.isActive) || 
      (statusFilter === "inactive" && !supplier.isActive);
    
    const matchesLocation = locationFilter === "all" || 
      supplier.state === locationFilter;
    
    const matchesPerformance = performanceFilter === "all" || 
      (performanceFilter === "high" && supplier.performanceRating >= 4.5) ||
      (performanceFilter === "medium" && supplier.performanceRating >= 3.5 && supplier.performanceRating < 4.5) ||
      (performanceFilter === "low" && supplier.performanceRating < 3.5);
    
    return matchesSearch && matchesStatus && matchesLocation && matchesPerformance;
  });
  
  // Get status badge styling
  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "success" : "destructive"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };
  
  // Get performance badge styling
  const getPerformanceBadge = (rating: number) => {
    let variant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" = "default";
    if (rating >= 4.5) variant = "success";
    else if (rating >= 3.5) variant = "warning";
    else variant = "destructive";
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Star className="h-3 w-3 fill-current" />
        {rating.toFixed(1)}
      </Badge>
    );
  };
  
  // Get unique states for filter
  const states = Array.from(new Set(suppliers.map(supplier => supplier.state)));
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load suppliers. Please try again later.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">
            Manage your suppliers and their performance
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/dashboard/suppliers/new">
            <Plus className="h-4 w-4" /> New Supplier
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Suppliers List</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search suppliers..."
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
              <TabsTrigger value="all">All Suppliers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          
            <TabsContent value="all" className="space-y-4">
              <div className="flex justify-end gap-4 mb-4">
                <Select
                  value={locationFilter}
                  onValueChange={(value) => setFilters({ locationFilter: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={performanceFilter}
                  onValueChange={(value) => setFilters({ performanceFilter: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performance</SelectItem>
                    <SelectItem value="high">High (4.5 or above)</SelectItem>
                    <SelectItem value="medium">Medium (3.5 to 4.4)</SelectItem>
                    <SelectItem value="low">Low (below 3.5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableCaption>A list of your suppliers.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No suppliers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map(supplier => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.companyName}</TableCell>
                        <TableCell>
                          <div>
                            <p>{supplier.contactName}</p>
                            <p className="text-sm text-muted-foreground">{supplier.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{supplier.city}, {supplier.state}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getPerformanceBadge(supplier.performanceRating)}</TableCell>
                        <TableCell>{supplier.leadTime} days</TableCell>
                        <TableCell>{getStatusBadge(supplier.isActive)}</TableCell>
                        <TableCell>
                          {format(new Date(supplier.lastUpdated), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" asChild>
                            <Link href={`/dashboard/suppliers/${supplier.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {["active", "inactive"].map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="flex justify-end gap-4 mb-4">
                  <Select
                    value={locationFilter}
                    onValueChange={(value) => setFilters({ locationFilter: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={performanceFilter}
                    onValueChange={(value) => setFilters({ performanceFilter: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by performance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Performance</SelectItem>
                      <SelectItem value="high">High (4.5 or above)</SelectItem>
                      <SelectItem value="medium">Medium (3.5 to 4.4)</SelectItem>
                      <SelectItem value="low">Low (below 3.5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableCaption>A list of your suppliers.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No suppliers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map(supplier => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.companyName}</TableCell>
                          <TableCell>
                            <div>
                              <p>{supplier.contactName}</p>
                              <p className="text-sm text-muted-foreground">{supplier.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{supplier.city}, {supplier.state}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getPerformanceBadge(supplier.performanceRating)}</TableCell>
                          <TableCell>{supplier.leadTime} days</TableCell>
                          <TableCell>{getStatusBadge(supplier.isActive)}</TableCell>
                          <TableCell>
                            {format(new Date(supplier.lastUpdated), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild>
                              <Link href={`/dashboard/suppliers/${supplier.id}`}>View</Link>
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
      
      {/* Alert for low performance suppliers */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800">Low Performance Alert</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">
            You have {suppliers.filter(s => s.performanceRating < 3.5).length} supplier(s) with low performance rating. Consider reviewing their performance.
          </p>
        </CardContent>
      </Card>
      
      {/* Alert for inactive suppliers */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Inactive Suppliers Alert</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            You have {suppliers.filter(s => !s.isActive).length} inactive supplier(s). Consider reactivating or removing them.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 