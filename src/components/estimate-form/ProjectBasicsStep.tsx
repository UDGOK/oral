"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { ProjectBasics } from "@/types/estimate"
import { MapPin, Building2, Calendar, DollarSign } from "lucide-react"

const projectBasicsSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  location: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  }),
  totalSquareFootage: z.number().min(500).max(10000),
  desiredCompletionDate: z.string().min(1, "Completion date is required"),
  projectTimeline: z.enum(["standard", "accelerated", "relaxed"]),
  projectType: z.enum(["new-construction", "renovation", "tenant-improvement"]),
  buildingType: z.enum(["ground-floor", "upper-floor", "basement"]),
})

interface ProjectBasicsStepProps {
  data?: ProjectBasics
  onUpdate: (data: ProjectBasics) => void
  onValidationChange: (isValid: boolean) => void
}

// Regional cost multipliers by state
const stateCostMultipliers: Record<string, number> = {
  "CA": 1.35, "NY": 1.30, "HI": 1.25, "MA": 1.20, "CT": 1.18,
  "NJ": 1.15, "WA": 1.12, "MD": 1.10, "IL": 1.08, "FL": 1.05,
  "TX": 1.00, "NC": 0.95, "GA": 0.92, "TN": 0.90, "OH": 0.88,
  "MI": 0.87, "IN": 0.85, "KY": 0.83, "AL": 0.80, "MS": 0.78
}

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

export default function ProjectBasicsStep({ data, onUpdate, onValidationChange }: ProjectBasicsStepProps) {
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [costMultiplier, setCostMultiplier] = useState(1.0)

  const form = useForm<ProjectBasics>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: data || {
      projectName: "",
      location: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      totalSquareFootage: 2500,
      desiredCompletionDate: "",
      projectTimeline: "standard",
      projectType: "renovation",
      buildingType: "ground-floor",
    },
  })

  const { watch, formState: { isValid } } = form
  const watchedValues = watch()

  useEffect(() => {
    onUpdate(watchedValues)
    onValidationChange(isValid)
    calculateEstimatedCost()
  }, [watchedValues, isValid, onUpdate, onValidationChange])

  const calculateEstimatedCost = () => {
    const values = watchedValues
    const state = values.location.state
    const multiplier = stateCostMultipliers[state] || 1.0
    setCostMultiplier(multiplier)

    // Base cost calculation
    let baseCostPerSqFt = 150 // Base cost for renovation

    // Adjust for project type
    if (values.projectType === "new-construction") {
      baseCostPerSqFt = 200
    } else if (values.projectType === "tenant-improvement") {
      baseCostPerSqFt = 125
    }

    // Adjust for building type
    if (values.buildingType === "upper-floor") {
      baseCostPerSqFt *= 1.15 // 15% premium for upper floors
    } else if (values.buildingType === "basement") {
      baseCostPerSqFt *= 1.25 // 25% premium for basement
    }

    // Adjust for timeline
    if (values.projectTimeline === "accelerated") {
      baseCostPerSqFt *= 1.20 // 20% premium for fast track
    } else if (values.projectTimeline === "relaxed") {
      baseCostPerSqFt *= 0.95 // 5% discount for extended timeline
    }

    // Apply regional multiplier
    baseCostPerSqFt *= multiplier

    const totalCost = values.totalSquareFootage * baseCostPerSqFt
    setEstimatedCost(Math.round(totalCost))
  }

  const getProjectTypeDescription = (type: string) => {
    switch (type) {
      case "new-construction":
        return "Ground-up construction with full MEP and structural work"
      case "renovation":
        return "Existing space renovation with selective demolition"
      case "tenant-improvement":
        return "Build-out of existing shell space"
      default:
        return ""
    }
  }

  const getTimelineDescription = (timeline: string) => {
    switch (timeline) {
      case "accelerated":
        return "Fast-track construction with premium pricing (+20%)"
      case "standard":
        return "Normal construction timeline with standard pricing"
      case "relaxed":
        return "Extended timeline with potential cost savings (-5%)"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Project Basics
        </h3>
        <p className="text-gray-600 mb-6">
          Tell us about your oral surgery office project to get started
        </p>

        {/* Cost Preview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              ${estimatedCost.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Estimated Project Cost • ${Math.round(estimatedCost / watchedValues.totalSquareFootage).toLocaleString()}/sq ft
          </p>
          {watchedValues.location.state && (
            <Badge variant="outline" className="mt-2">
              {watchedValues.location.state} Multiplier: {costMultiplier}x
            </Badge>
          )}
        </div>
      </div>

      <Form {...form}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Project Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Basic details about your oral surgery office project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Modern Oral Surgery Center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new-construction">New Construction ($200/sq ft base)</SelectItem>
                          <SelectItem value="renovation">Renovation ($150/sq ft base)</SelectItem>
                          <SelectItem value="tenant-improvement">Tenant Improvement ($125/sq ft base)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getProjectTypeDescription(field.value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buildingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select building type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ground-floor">Ground Floor (Standard)</SelectItem>
                          <SelectItem value="upper-floor">Upper Floor (+15%)</SelectItem>
                          <SelectItem value="basement">Basement (+25%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desiredCompletionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Completion Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Timeline</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accelerated">Accelerated (+20%)</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="relaxed">Relaxed (-5%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getTimelineDescription(field.value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Location & Size */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Project Location
                </CardTitle>
                <CardDescription>
                  Location affects regional pricing and regulatory requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="location.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Medical Center Dr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state} {stateCostMultipliers[state] ? `(${stateCostMultipliers[state]}x)` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Size</CardTitle>
                <CardDescription>
                  Adjust the total square footage for your oral surgery office
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="totalSquareFootage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Square Footage</FormLabel>
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-blue-600">
                            {field.value.toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-600 ml-2">sq ft</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={500}
                            max={10000}
                            step={250}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>500 sq ft</span>
                          <span>10,000 sq ft</span>
                        </div>
                      </div>
                      <FormDescription>
                        Typical oral surgery offices range from 1,500 to 5,000 sq ft
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  )
}
