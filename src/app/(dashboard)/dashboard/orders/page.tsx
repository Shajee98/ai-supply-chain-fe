"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, AlertTriangle, Clock } from "lucide-react"
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
import { useOrderStore } from "@/stores/orderStore"
import { OrderMap } from "@/components/maps/OrderMap"

enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
}

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  location: {
    lat: number
    lng: number
    address: string
  }
}

interface OrderItem {
  product: Product
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  supplier: Supplier
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  orderDate: string
  expectedDeliveryDate: string
  notes?: string
}

// Mock data - will be replaced with API call
const mockOrders: Order[] = [
  {
    id: "ord1",
    orderNumber: "ORD-2024-001",
    supplier: {
      id: "sup1",
      name: "Tech Components Inc.",
      email: "orders@techcomponents.com",
      phone: "+1 (555) 123-4567",
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Tech Street, New York, NY 10001"
      }
    },
    items: [
      {
        product: {
          id: "prod1",
          sku: "SKU-001",
          name: "Industrial Sensor XL-5",
          category: "Electronics",
          price: 499.99
        },
        quantity: 50,
        unitPrice: 450.00
      }
    ],
    totalAmount: 22500.00,
    status: OrderStatus.PENDING,
    orderDate: "2024-03-15",
    expectedDeliveryDate: "2024-03-30",
    notes: "Priority order for production line"
  },
  {
    id: "ord2",
    orderNumber: "ORD-2024-002",
    supplier: {
      id: "sup2",
      name: "Global Electronics Ltd.",
      email: "purchasing@globalelectronics.com",
      phone: "+1 (555) 987-6543",
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: "456 Electronics Ave, Los Angeles, CA 90012"
      }
    },
    items: [
      {
        product: {
          id: "prod2",
          sku: "SKU-002",
          name: "Circuit Board A200",
          category: "Electronics",
          price: 345.00
        },
        quantity: 100,
        unitPrice: 300.00
      }
    ],
    totalAmount: 30000.00,
    status: OrderStatus.CONFIRMED,
    orderDate: "2024-03-16",
    expectedDeliveryDate: "2024-04-01"
  },
  {
    id: "ord3",
    orderNumber: "ORD-2024-003",
    supplier: {
      id: "sup3",
      name: "Hardware Solutions Co.",
      email: "sales@hardwaresolutions.com",
      phone: "+1 (555) 456-7890",
      location: {
        lat: 41.8781,
        lng: -87.6298,
        address: "789 Hardware Blvd, Chicago, IL 60601"
      }
    },
    items: [
      {
        product: {
          id: "prod3",
          sku: "SKU-003",
          name: "Steel Connector S-100",
          category: "Hardware",
          price: 25.51
        },
        quantity: 500,
        unitPrice: 20.00
      }
    ],
    totalAmount: 10000.00,
    status: OrderStatus.IN_TRANSIT,
    orderDate: "2024-03-10",
    expectedDeliveryDate: "2024-03-25"
  },
  {
    id: "ord4",
    orderNumber: "ORD-2024-004",
    supplier: {
      id: "sup4",
      name: "Tech Components Inc.",
      email: "orders@techcomponents.com",
      phone: "+1 (555) 123-4567",
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Tech Street, New York, NY 10001"
      }
    },
    items: [
      {
        product: {
          id: "prod4",
          sku: "SKU-004",
          name: "Temperature Controller",
          category: "Electronics",
          price: 129.50
        },
        quantity: 75,
        unitPrice: 115.00
      }
    ],
    totalAmount: 8625.00,
    status: OrderStatus.DELIVERED,
    orderDate: "2024-03-01",
    expectedDeliveryDate: "2024-03-15"
  },
  {
    id: "ord5",
    orderNumber: "ORD-2024-005",
    supplier: {
      id: "sup5",
      name: "Global Electronics Ltd.",
      email: "purchasing@globalelectronics.com",
      phone: "+1 (555) 987-6543",
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: "456 Electronics Ave, Los Angeles, CA 90012"
      }
    },
    items: [
      {
        product: {
          id: "prod5",
          sku: "SKU-005",
          name: "Power Unit P-500",
          category: "Electronics",
          price: 799.99
        },
        quantity: 25,
        unitPrice: 700.00
      }
    ],
    totalAmount: 17500.00,
    status: OrderStatus.CANCELLED,
    orderDate: "2024-03-05",
    expectedDeliveryDate: "2024-03-20",
    notes: "Cancelled due to supplier stock issues"
  }
];

export default function OrdersPage() {
  const { toast } = useToast();
  const { searchQuery, statusFilter, supplierFilter, setFilters } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  console.log("selectedOrder ", selectedOrder)
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch('/api/orders');
      // if (!response.ok) throw new Error('Failed to fetch orders');
      // return response.json();
      
      // Using mock data for now
      return mockOrders;
    }
  });

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSupplier = supplierFilter === "all" || order.supplier.id === supplierFilter;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { variant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning", label: string }> = {
      [OrderStatus.PENDING]: { variant: "warning", label: "Pending" },
      [OrderStatus.CONFIRMED]: { variant: "secondary", label: "Confirmed" },
      [OrderStatus.IN_TRANSIT]: { variant: "default", label: "In Transit" },
      [OrderStatus.DELIVERED]: { variant: "success", label: "Delivered" },
      [OrderStatus.CANCELLED]: { variant: "destructive", label: "Cancelled" }
    };
    
    return (
      <Badge variant={variants[status].variant}>
        {variants[status].label}
      </Badge>
    );
  };
  
  // Get unique suppliers for filter
  const suppliers = Array.from(new Set(orders.map(order => order.supplier)));
  
  // Calculate alerts
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING);
  const delayedOrders = orders.filter(order => 
    order.status === OrderStatus.IN_TRANSIT && 
    new Date(order.expectedDeliveryDate) < new Date()
  );
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load orders data. Please try again.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track your purchase orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            onClick={() => setViewMode("map")}
          >
            Map View
          </Button>
          <Button asChild className="flex items-center gap-1">
            <Link href="/dashboard/orders/new">
              <Plus className="h-4 w-4" /> New Order
            </Link>
          </Button>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Orders List</CardTitle>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search orders..."
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
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value={OrderStatus.PENDING}>Pending</TabsTrigger>
                <TabsTrigger value={OrderStatus.CONFIRMED}>Confirmed</TabsTrigger>
                <TabsTrigger value={OrderStatus.IN_TRANSIT}>In Transit</TabsTrigger>
                <TabsTrigger value={OrderStatus.DELIVERED}>Delivered</TabsTrigger>
                <TabsTrigger value={OrderStatus.CANCELLED}>Cancelled</TabsTrigger>
              </TabsList>
            
              <TabsContent value="all" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Select
                    value={supplierFilter}
                    onValueChange={(value) => setFilters({ supplierFilter: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Table>
                  <TableCaption>A list of your purchase orders.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading orders...
                        </TableCell>
                      </TableRow>
                    ) : filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.supplier.name}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{format(new Date(order.orderDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Button variant="ghost" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              {Object.values(OrderStatus).map(status => (
                <TabsContent key={status} value={status} className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Select
                      value={supplierFilter}
                      onValueChange={(value) => setFilters({ supplierFilter: value })}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Suppliers</SelectItem>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Table>
                    <TableCaption>A list of your purchase orders.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Expected Delivery</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{order.supplier.name}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{format(new Date(order.orderDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Button variant="ghost" asChild>
                                <Link href={`/dashboard/orders/${order.id}`}>View</Link>
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
      ) : (
        <OrderMap
          orders={filteredOrders}
          onOrderSelect={setSelectedOrder}
        />
      )}
      
      {/* Alert for pending orders */}
      {pendingOrders.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Pending Orders Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              You have {pendingOrders.length} pending orders that need attention.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Alert for delayed orders */}
      {delayedOrders.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Delayed Orders Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              You have {delayedOrders.length} orders that are past their expected delivery date.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 