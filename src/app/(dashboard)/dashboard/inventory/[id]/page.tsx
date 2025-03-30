"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Package, MapPin, Calendar, Hash, AlertTriangle } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

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

interface PerformanceHistory {
  date: string
  quantity: number
  status: InventoryStatus
}

// Mock data - will be replaced with API call
const mockInventoryItem: InventoryItem = {
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
};

const mockPerformanceHistory: PerformanceHistory[] = [
  { date: "2024-01-01", quantity: 200, status: InventoryStatus.AVAILABLE },
  { date: "2024-01-15", quantity: 180, status: InventoryStatus.AVAILABLE },
  { date: "2024-02-01", quantity: 160, status: InventoryStatus.AVAILABLE },
  { date: "2024-02-15", quantity: 150, status: InventoryStatus.AVAILABLE },
  { date: "2024-03-01", quantity: 140, status: InventoryStatus.AVAILABLE },
  { date: "2024-03-15", quantity: 150, status: InventoryStatus.AVAILABLE },
];

const inventorySchema = z.object({
  quantity: z.number().min(0, "Quantity must be positive"),
  location: z.string().min(1, "Location is required"),
  status: z.nativeEnum(InventoryStatus),
  expiryDate: z.string().optional(),
  lotNumber: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: inventoryItem = mockInventoryItem, isLoading, error } = useQuery({
    queryKey: ['inventory', params.id],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/inventory/${params.id}`);
      // if (!response.ok) throw new Error('Failed to fetch inventory item');
      // return response.json();
      
      // Using mock data for now
      return mockInventoryItem;
    }
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      quantity: inventoryItem.quantity,
      location: inventoryItem.location,
      status: inventoryItem.status,
      expiryDate: inventoryItem.expiryDate,
      lotNumber: inventoryItem.lotNumber,
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/inventory/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to update inventory item');
      // return response.json();
      
      // Using mock data for now
      return {
        ...inventoryItem,
        ...data,
        lastUpdated: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update inventory item. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: InventoryFormData) => {
    updateMutation.mutate(data);
  };
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load inventory item. Please try again.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Item</h2>
          <p className="text-muted-foreground">
            View and manage inventory item details
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Item</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <p className="text-lg font-medium">{inventoryItem.product.name}</p>
              </div>
              
              <div>
                <Label>SKU</Label>
                <p className="text-lg font-medium">{inventoryItem.product.sku}</p>
              </div>
              
              <div>
                <Label>Category</Label>
                <p className="text-lg font-medium">{inventoryItem.product.category}</p>
              </div>
              
              <div>
                <Label>Price</Label>
                <p className="text-lg font-medium">${inventoryItem.product.price.toFixed(2)}</p>
              </div>
              
              <div>
                <Label>Cost</Label>
                <p className="text-lg font-medium">${inventoryItem.product.cost.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Warehouse</Label>
                <p className="text-lg font-medium">{inventoryItem.warehouse.name}</p>
                <p className="text-sm text-muted-foreground">
                  {inventoryItem.warehouse.city}, {inventoryItem.warehouse.state}
                </p>
              </div>
              
              <div>
                <Label>Location</Label>
                {isEditing ? (
                  <Input
                    {...register("location")}
                    className={errors.location ? "border-red-500" : ""}
                  />
                ) : (
                  <p className="text-lg font-medium">{inventoryItem.location}</p>
                )}
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
              
              <div>
                <Label>Status</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) => register("status").onChange({ target: { value } })}
                    defaultValue={inventoryItem.status}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(InventoryStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={
                    inventoryItem.status === InventoryStatus.AVAILABLE ? "success" :
                    inventoryItem.status === InventoryStatus.RESERVED ? "warning" :
                    inventoryItem.status === InventoryStatus.DAMAGED ? "destructive" :
                    inventoryItem.status === InventoryStatus.EXPIRED ? "destructive" :
                    "secondary"
                  }>
                    {inventoryItem.status.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Inventory Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quantity</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                ) : (
                  <p className="text-lg font-medium">{inventoryItem.quantity}</p>
                )}
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>
              
              <div>
                <Label>Lot Number</Label>
                {isEditing ? (
                  <Input
                    {...register("lotNumber")}
                    className={errors.lotNumber ? "border-red-500" : ""}
                  />
                ) : (
                  <p className="text-lg font-medium">{inventoryItem.lotNumber || "N/A"}</p>
                )}
                {errors.lotNumber && (
                  <p className="text-sm text-red-500">{errors.lotNumber.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Expiry Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Expiry Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    {...register("expiryDate")}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {inventoryItem.expiryDate ? format(new Date(inventoryItem.expiryDate), 'MMM d, yyyy') : "N/A"}
                  </p>
                )}
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantity" 
                  stroke="#8884d8" 
                  name="Quantity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Alert for low stock */}
      {inventoryItem.quantity < 100 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              This item is running low on stock. Current quantity: {inventoryItem.quantity}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Alert for expiring soon */}
      {inventoryItem.expiryDate && new Date(inventoryItem.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Expiring Soon Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              This item is expiring soon. Expiry date: {format(new Date(inventoryItem.expiryDate), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 