"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Package, MapPin, Calendar, Hash, Edit, Save, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
const mockOrder: Order = {
  id: "ord1",
  orderNumber: "ORD-2024-001",
  supplier: {
    id: "sup1",
    name: "Tech Components Inc.",
    email: "orders@techcomponents.com",
    phone: "+1 (555) 123-4567"
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
};

const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  status: z.nativeEnum(OrderStatus),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrderDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: order = mockOrder, isLoading, error } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/orders/${params.id}`);
      // if (!response.ok) throw new Error('Failed to fetch order');
      // return response.json();
      
      // Using mock data for now
      return mockOrder;
    }
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: order.orderNumber,
      supplierId: order.supplier.id,
      status: order.status,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
      notes: order.notes,
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (updatedOrder: OrderFormData) => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/orders/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedOrder),
      // });
      // if (!response.ok) throw new Error('Failed to update order');
      // return response.json();
      
      // Using mock data for now
      return {
        ...order,
        ...updatedOrder,
        supplier: {
          ...order.supplier,
          id: updatedOrder.supplierId,
        },
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: OrderFormData) => {
    updateMutation.mutate(data);
  };
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load order data. Please try again.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
          <p className="text-muted-foreground">
            View and manage order information
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Order
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div>Loading order details...</div>
      ) : (
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
                {isEditing ? (
                  <Input
                    id="orderNumber"
                    {...register("orderNumber")}
                    className={errors.orderNumber ? "border-red-500" : ""}
                  />
                ) : (
                  <div className="text-sm">{order.orderNumber}</div>
                )}
                {errors.orderNumber && (
                  <p className="text-sm text-red-500">{errors.orderNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) => register("status").onChange({ target: { value } })}
                    defaultValue={order.status}
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
                ) : (
                  <Badge variant={
                    order.status === OrderStatus.DELIVERED ? "success" :
                    order.status === OrderStatus.CANCELLED ? "destructive" :
                    order.status === OrderStatus.PENDING ? "warning" :
                    "default"
                  }>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                )}
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <div className="text-sm">{order.supplier.name}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <div className="text-sm">{order.supplier.email}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <div className="text-sm">{order.supplier.phone}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                {isEditing ? (
                  <Input
                    id="orderDate"
                    type="date"
                    {...register("orderDate")}
                    className={errors.orderDate ? "border-red-500" : ""}
                  />
                ) : (
                  <div className="text-sm">{format(new Date(order.orderDate), 'MMM d, yyyy')}</div>
                )}
                {errors.orderDate && (
                  <p className="text-sm text-red-500">{errors.orderDate.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                {isEditing ? (
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    {...register("expectedDeliveryDate")}
                    className={errors.expectedDeliveryDate ? "border-red-500" : ""}
                  />
                ) : (
                  <div className="text-sm">{format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</div>
                )}
                {errors.expectedDeliveryDate && (
                  <p className="text-sm text-red-500">{errors.expectedDeliveryDate.message}</p>
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
                <Label htmlFor="notes">Notes</Label>
                {isEditing ? (
                  <Input
                    id="notes"
                    {...register("notes")}
                    className={errors.notes ? "border-red-500" : ""}
                  />
                ) : (
                  <div className="text-sm">{order.notes || "No notes"}</div>
                )}
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>{item.product.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-medium">Total Amount</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 