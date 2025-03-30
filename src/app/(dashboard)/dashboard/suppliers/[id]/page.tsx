"use client"

import { useState } from "react"
import { Building2, Mail, Phone, MapPin, Star, AlertTriangle, Calendar, Package, FileText } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

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

// Mock performance history data
const mockPerformanceHistory = [
  { date: "2024-01", rating: 4.5 },
  { date: "2024-02", rating: 4.7 },
  { date: "2024-03", rating: 4.8 },
  { date: "2024-04", rating: 4.8 },
];

// Mock supplied products data
const mockSuppliedProducts = [
  { id: "prod1", name: "Circuit Board A", quantity: 1000, lastOrdered: "2024-04-15" },
  { id: "prod2", name: "Resistor Set B", quantity: 5000, lastOrdered: "2024-04-10" },
];

// Mock purchase orders data
const mockPurchaseOrders = [
  { id: "po1", date: "2024-04-15", amount: 15000, status: "Completed" },
  { id: "po2", date: "2024-04-10", amount: 12000, status: "In Progress" },
];

const supplierSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  leadTime: z.number().min(0, "Lead time must be positive"),
  performanceRating: z.number(),
  isActive: z.boolean(),
  notes: z.string().optional(),
  lastUpdated: z.string(),
});

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use React Query for data fetching
  const { data: supplier = mockSupplier, isLoading, error } = useQuery({
    queryKey: ['supplier', params.id],
    queryFn: async () => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/suppliers/${params.id}`);
      // if (!response.ok) throw new Error('Failed to fetch supplier');
      // return response.json();
      
      // Using mock data for now
      return mockSupplier;
    }
  });
  
  // Use React Query for mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedSupplier: Partial<Supplier>) => {
      // This would be an API call in a real application
      // const response = await fetch(`/api/suppliers/${params.id}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedSupplier),
      // });
      // if (!response.ok) throw new Error('Failed to update supplier');
      // return response.json();
      
      // Using mock data for now
      return { ...supplier, ...updatedSupplier };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier', params.id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update supplier. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<Supplier>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier,
  });
  
  const onSubmit = (data: Supplier) => {
    updateMutation.mutate(data);
  };
  
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
      description: "Failed to load supplier details. Please try again later.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{supplier.companyName}</h2>
          <p className="text-muted-foreground">
            Supplier Details and Performance
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      
      {supplier.performanceRating < 3.5 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Low Performance Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              This supplier has a low performance rating. Consider reviewing their performance and discussing improvements.
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    {...register("taxId")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Input
                    id="paymentTerms"
                    {...register("paymentTerms")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    {...register("leadTime", { valueAsNumber: true })}
                    className={errors.leadTime ? "border-red-500" : ""}
                  />
                  {errors.leadTime && (
                    <p className="text-sm text-red-500">{errors.leadTime.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Tax ID: {supplier.taxId || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Payment Terms: {supplier.paymentTerms || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Lead Time: {supplier.leadTime} days</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Performance Rating</span>
              <Badge variant={supplier.performanceRating >= 4.5 ? "success" : supplier.performanceRating >= 3.5 ? "warning" : "destructive"}>
                {supplier.performanceRating.toFixed(1)}
              </Badge>
            </div>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    {...register("contactName")}
                    className={errors.contactName ? "border-red-500" : ""}
                  />
                  {errors.contactName && (
                    <p className="text-sm text-red-500">{errors.contactName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      className={errors.country ? "border-red-500" : ""}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500">{errors.country.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      className={errors.postalCode ? "border-red-500" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.city}, {supplier.state} {supplier.postalCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.country}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">Supplied Products</TabsTrigger>
              <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="history">Performance History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="space-y-4">
                {mockSuppliedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last ordered: {format(new Date(product.lastOrdered), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge variant="outline">{product.quantity} units</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="space-y-4">
                {mockPurchaseOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Order #{order.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Date: {format(new Date(order.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${order.amount.toLocaleString()}</span>
                      <Badge variant={order.status === "Completed" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                {mockPerformanceHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{format(new Date(record.date), 'MMMM yyyy')}</h4>
                    </div>
                    <Badge variant={record.rating >= 4.5 ? "success" : record.rating >= 3.5 ? "warning" : "destructive"}>
                      {record.rating.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              {...register("notes")}
              placeholder="Add any additional notes about the supplier..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground">
              {supplier.notes || "No notes available."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 