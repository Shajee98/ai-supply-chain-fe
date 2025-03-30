"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Plus, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm, useFieldArray } from "react-hook-form"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
}

// Mock data - will be replaced with API calls
const mockProducts: Product[] = [
  {
    id: "prod1",
    sku: "SKU-001",
    name: "Industrial Sensor XL-5",
    category: "Electronics",
    price: 499.99
  },
  {
    id: "prod2",
    sku: "SKU-002",
    name: "Temperature Controller",
    category: "Electronics",
    price: 129.50
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: "sup1",
    name: "Tech Components Inc.",
    email: "orders@techcomponents.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "sup2",
    name: "Global Electronics Ltd.",
    email: "orders@globalelectronics.com",
    phone: "+1 (555) 987-6543"
  }
];

const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  status: z.nativeEnum(OrderStatus),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
  })).min(1, "At least one item is required"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function NewOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: OrderStatus.PENDING,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  
  const createMutation = useMutation({
    mutationFn: async (newOrder: OrderFormData) => {
      // This would be an API call in a real application
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newOrder),
      // });
      // if (!response.ok) throw new Error('Failed to create order');
      // return response.json();
      
      // Using mock data for now
      return {
        id: "ord" + Math.floor(Math.random() * 1000),
        ...newOrder,
        supplier: mockSuppliers.find(s => s.id === newOrder.supplierId),
        items: newOrder.items.map(item => ({
          ...item,
          product: mockProducts.find(p => p.id === item.productId),
        })),
        totalAmount: newOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      router.push('/dashboard/orders');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: OrderFormData) => {
    createMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Order</h2>
        <p className="text-muted-foreground">
          Add a new order to your inventory
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  {...register("orderNumber")}
                  className={errors.orderNumber ? "border-red-500" : ""}
                />
                {errors.orderNumber && (
                  <p className="text-sm text-red-500">{errors.orderNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select
                  onValueChange={(value) => register("supplierId").onChange({ target: { value } })}
                >
                  <SelectTrigger className={errors.supplierId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplierId && (
                  <p className="text-sm text-red-500">{errors.supplierId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => register("status").onChange({ target: { value } })}
                  defaultValue={OrderStatus.PENDING}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderStatus).map(status => (
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
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  {...register("orderDate")}
                  className={errors.orderDate ? "border-red-500" : ""}
                />
                {errors.orderDate && (
                  <p className="text-sm text-red-500">{errors.orderDate.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  {...register("expectedDeliveryDate")}
                  className={errors.expectedDeliveryDate ? "border-red-500" : ""}
                />
                {errors.expectedDeliveryDate && (
                  <p className="text-sm text-red-500">{errors.expectedDeliveryDate.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  {...register("notes")}
                  className={errors.notes ? "border-red-500" : ""}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Select
                        onValueChange={(value) => {
                          const product = mockProducts.find(p => p.id === value);
                          if (product) {
                            register(`items.${index}.productId`).onChange({ target: { value } });
                            register(`items.${index}.unitPrice`).onChange({ target: { value: product.price } });
                          }
                        }}
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
                      {errors.items?.[index]?.productId && (
                        <p className="text-sm text-red-500">{errors.items[index]?.productId?.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        className={errors.items?.[index]?.quantity ? "border-red-500" : ""}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-sm text-red-500">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                        className={errors.items?.[index]?.unitPrice ? "border-red-500" : ""}
                      />
                      {errors.items?.[index]?.unitPrice && (
                        <p className="text-sm text-red-500">{errors.items[index]?.unitPrice?.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      ${((field.quantity || 0) * (field.unitPrice || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total Amount</TableCell>
                  <TableCell>
                    ${fields.reduce((sum, field) => sum + (field.quantity || 0) * (field.unitPrice || 0), 0).toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-sm text-red-500 mt-2">{errors.items.message}</p>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  )
} 