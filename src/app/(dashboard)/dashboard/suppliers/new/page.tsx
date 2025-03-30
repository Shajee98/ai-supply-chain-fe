"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, FileText, MapPin, Star } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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

interface NewSupplier {
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
  notes?: string
}

const supplierSchema = z.object({
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
  notes: z.string().optional(),
});

export default function NewSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm<NewSupplier>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      taxId: "",
      paymentTerms: "",
      leadTime: 0,
      notes: ""
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async (newSupplier: NewSupplier) => {
      // This would be an API call in a real application
      // const response = await fetch('/api/suppliers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newSupplier),
      // });
      // if (!response.ok) throw new Error('Failed to create supplier');
      // return response.json();
      
      // Using mock data for now
      return {
        id: "sup" + Math.random().toString(36).substr(2, 9),
        ...newSupplier,
        performanceRating: 4.5,
        isActive: true,
        lastUpdated: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Success",
        description: "Supplier created successfully",
      });
      router.push('/dashboard/suppliers');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create supplier. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: NewSupplier) => {
    createMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Supplier</h2>
        <p className="text-muted-foreground">
          Add a new supplier to your supply chain
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Select
                  onValueChange={(value) => register("paymentTerms").onChange({ target: { value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Add any additional notes about the supplier..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/suppliers')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Supplier"}
          </Button>
        </div>
      </form>
    </div>
  )
} 