"use client"

import { useRouter } from "next/navigation"
import { Package, MapPin, Calendar, Hash } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Mock data - will be replaced with API call
const mockProducts: Product[] = [
  {
    id: "prod1",
    sku: "SKU-001",
    name: "Industrial Sensor XL-5",
    category: "Electronics",
    price: 499.99,
    cost: 350.00
  },
  {
    id: "prod2",
    sku: "SKU-002",
    name: "Circuit Board A200",
    category: "Electronics",
    price: 345.00,
    cost: 250.00
  },
  {
    id: "prod3",
    sku: "SKU-003",
    name: "Steel Connector S-100",
    category: "Hardware",
    price: 25.51,
    cost: 15.00
  }
];

const mockWarehouses: Warehouse[] = [
  {
    id: "wh1",
    name: "Main Warehouse",
    city: "New York",
    state: "NY"
  },
  {
    id: "wh2",
    name: "West Coast Hub",
    city: "Los Angeles",
    state: "CA"
  }
];

const inventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  location: z.string().min(1, "Location is required"),
  status: z.nativeEnum(InventoryStatus),
  expiryDate: z.string().optional(),
  lotNumber: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse is required"),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export default function NewInventoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      quantity: 0,
      location: "",
      status: InventoryStatus.AVAILABLE,
      expiryDate: "",
      lotNumber: "",
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async (newItem: InventoryFormData) => {
      // This would be an API call in a real application
      // const response = await fetch('/api/inventory', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newItem),
      // });
      // if (!response.ok) throw new Error('Failed to create inventory item');
      // return response.json();
      
      // Using mock data for now
      return {
        id: "inv" + Math.random().toString(36).substr(2, 9),
        ...newItem,
        product: mockProducts.find(p => p.id === newItem.productId),
        warehouse: mockWarehouses.find(w => w.id === newItem.warehouseId),
        lastUpdated: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      router.push('/dashboard/inventory');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create inventory item. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: InventoryFormData) => {
    createMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Inventory Item</h2>
        <p className="text-muted-foreground">
          Add a new item to your inventory
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select
                  onValueChange={(value) => register("productId").onChange({ target: { value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-sm text-red-500">{errors.productId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
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
              <div className="space-y-2">
                <Label htmlFor="warehouseId">Warehouse</Label>
                <Select
                  onValueChange={(value) => register("warehouseId").onChange({ target: { value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({warehouse.city}, {warehouse.state})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouseId && (
                  <p className="text-sm text-red-500">{errors.warehouseId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => register("status").onChange({ target: { value } })}
                  defaultValue={InventoryStatus.AVAILABLE}
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
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lotNumber">Lot Number</Label>
                <Input
                  id="lotNumber"
                  {...register("lotNumber")}
                  className={errors.lotNumber ? "border-red-500" : ""}
                />
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
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/inventory')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Item"}
          </Button>
        </div>
      </form>
    </div>
  )
} 