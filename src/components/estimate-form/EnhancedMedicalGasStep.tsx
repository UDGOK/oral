"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { MedicalGasRequirements, RoomConfiguration } from "@/types/estimate"
import { Wind, Plus, Trash2, AlertCircle, CheckCircle, Settings, Shield } from "lucide-react"

const medicalGasSchema = z.object({
  nitrousOxide: z.object({
    required: z.boolean(),
    outlets: z.array(z.object({
      room: z.string().min(1, "Room is required"),
      count: z.number().min(1, "At least 1 outlet required").max(4, "Maximum 4 N2O outlets per room"),
      location: z.string().min(1, "Location is required"),
    })),
    centralSupply: z.boolean(),
    scavengingSystem: z.boolean(),
    manifoldLocation: z.string(),
    emergencyShutoffs: z.number().min(0),
  }),
  oxygen: z.object({
    required: z.boolean(),
    outlets: z.array(z.object({
      room: z.string().min(1, "Room is required"),
      count: z.number().min(1, "At least 1 outlet required").max(6, "Maximum 6 oxygen outlets per room"),
      location: z.string().min(1, "Location is required"),
    })),
    centralSupply: z.boolean(),
    backupSystem: z.boolean(),
    manifoldLocation: z.string(),
    emergencyShutoffs: z.number().min(0),
  }),
  medicalAir: z.object({
    required: z.boolean(),
    outlets: z.array(z.object({
      room: z.string().min(1, "Room is required"),
      count: z.number().min(1, "At least 1 outlet required").max(6, "Maximum 6 air outlets per room"),
      location: z.string().min(1, "Location is required"),
    })),
    oilFree: z.boolean(),
    backupCompressor: z.boolean(),
    manifoldLocation: z.string(),
  }),
  vacuumSystem: z.object({
    required: z.boolean(),
    outlets: z.array(z.object({
      room: z.string().min(1, "Room is required"),
      count: z.number().min(1, "At least 1 outlet required").max(8, "Maximum 8 vacuum outlets per room"),
      location: z.string().min(1, "Location is required"),
    })),
    centralSystem: z.boolean(),
    backupPump: z.boolean(),
    manifoldLocation: z.string(),
  }),
})

interface EnhancedMedicalGasStepProps {
  data?: MedicalGasRequirements
  roomConfig?: RoomConfiguration
  onUpdate: (data: MedicalGasRequirements) => void
  onValidationChange: (isValid: boolean) => void
}

export default function EnhancedMedicalGasStep({ data, roomConfig, onUpdate, onValidationChange }: EnhancedMedicalGasStepProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [totalOutlets, setTotalOutlets] = useState({ oxygen: 0, nitrous: 0, air: 0, vacuum: 0 })
  const [estimatedCost, setEstimatedCost] = useState(0)

  const form = useForm<MedicalGasRequirements>({
    resolver: zodResolver(medicalGasSchema),
    defaultValues: data || {
      nitrousOxide: {
        required: true,
        outlets: [],
        centralSupply: true,
        scavengingSystem: true,
        manifoldLocation: "Mechanical Room",
        emergencyShutoffs: 2,
      },
      oxygen: {
        required: true,
        outlets: [],
        centralSupply: true,
        backupSystem: true,
        manifoldLocation: "Mechanical Room",
        emergencyShutoffs: 2,
      },
      medicalAir: {
        required: true,
        outlets: [],
        oilFree: true,
        backupCompressor: true,
        manifoldLocation: "Mechanical Room",
      },
      vacuumSystem: {
        required: true,
        outlets: [],
        centralSystem: true,
        backupPump: true,
        manifoldLocation: "Mechanical Room",
      },
    },
  })

  const nitrousOutlets = useFieldArray({
    control: form.control,
    name: "nitrousOxide.outlets",
  })

  const oxygenOutlets = useFieldArray({
    control: form.control,
    name: "oxygen.outlets",
  })

  const airOutlets = useFieldArray({
    control: form.control,
    name: "medicalAir.outlets",
  })

  const vacuumOutlets = useFieldArray({
    control: form.control,
    name: "vacuumSystem.outlets",
  })

  const { watch, formState: { isValid } } = form
  const watchedValues = watch()

  useEffect(() => {
    if (isInitialized) {
      onUpdate(watchedValues)
      onValidationChange(isValid)
      calculateTotalsAndCost()
    } else {
      setIsInitialized(true)
    }
  }, [watchedValues, isValid, onUpdate, onValidationChange, isInitialized])

  const calculateTotalsAndCost = () => {
    const values = watchedValues
    const totals = {
      oxygen: values.oxygen.outlets.reduce((sum, outlet) => sum + outlet.count, 0),
      nitrous: values.nitrousOxide.outlets.reduce((sum, outlet) => sum + outlet.count, 0),
      air: values.medicalAir.outlets.reduce((sum, outlet) => sum + outlet.count, 0),
      vacuum: values.vacuumSystem.outlets.reduce((sum, outlet) => sum + outlet.count, 0),
    }
    setTotalOutlets(totals)

    // Cost calculation (industry standard pricing)
    let cost = 0
    if (values.oxygen.required) {
      cost += totals.oxygen * 1200 // $1200 per oxygen outlet
      cost += values.oxygen.centralSupply ? 15000 : 0 // Central supply system
      cost += values.oxygen.backupSystem ? 8000 : 0 // Backup system
    }
    if (values.nitrousOxide.required) {
      cost += totals.nitrous * 1400 // $1400 per nitrous outlet
      cost += values.nitrousOxide.centralSupply ? 12000 : 0 // Central supply
      cost += values.nitrousOxide.scavengingSystem ? 6000 : 0 // Scavenging system
    }
    if (values.medicalAir.required) {
      cost += totals.air * 1000 // $1000 per air outlet
      cost += values.medicalAir.oilFree ? 18000 : 12000 // Oil-free vs standard compressor
    }
    if (values.vacuumSystem.required) {
      cost += totals.vacuum * 800 // $800 per vacuum outlet
      cost += values.vacuumSystem.centralSystem ? 14000 : 0 // Central vacuum system
    }

    // Add installation and piping costs
    const totalOutletCount = totals.oxygen + totals.nitrous + totals.air + totals.vacuum
    cost += totalOutletCount * 300 // $300 per outlet for installation and piping

    setEstimatedCost(cost)
  }

  const getAvailableRooms = () => {
    const rooms = []
    if (roomConfig) {
      // Treatment rooms
      for (let i = 1; i <= roomConfig.treatmentRooms.count; i++) {
        rooms.push(`Treatment Room ${i}`)
      }
      // Surgical suites
      for (let i = 1; i <= roomConfig.specialRooms.surgicalSuites.count; i++) {
        rooms.push(`Surgical Suite ${i}`)
      }
      // Consultation rooms
      for (let i = 1; i <= roomConfig.consultationRooms.count; i++) {
        rooms.push(`Consultation Room ${i}`)
      }
      // Recovery rooms
      for (let i = 1; i <= roomConfig.recoveryRooms.count; i++) {
        rooms.push(`Recovery Room ${i}`)
      }
      // Lab spaces
      if (roomConfig.labSpaces.hasLab) {
        for (let i = 1; i <= roomConfig.labSpaces.count; i++) {
          rooms.push(`Laboratory ${i}`)
        }
      }
      // Sterilization area
      rooms.push("Central Sterilization")
    }
    return rooms
  }

  const locationOptions = [
    "Chair-side left",
    "Chair-side right",
    "Wall mounted left",
    "Wall mounted right",
    "Ceiling mounted",
    "Mobile unit connection",
    "Emergency location",
    "Workstation integrated"
  ]

  const manifoldLocationOptions = [
    "Mechanical Room",
    "Basement Mechanical",
    "Roof Mechanical",
    "Dedicated Gas Room",
    "Utility Closet",
    "External Enclosure"
  ]

  const autoPopulateOutlets = (gasType: 'oxygen' | 'nitrousOxide' | 'medicalAir' | 'vacuumSystem') => {
    const rooms = getAvailableRooms()
    const fieldArray = gasType === 'oxygen' ? oxygenOutlets :
                      gasType === 'nitrousOxide' ? nitrousOutlets :
                      gasType === 'medicalAir' ? airOutlets : vacuumOutlets

    // Clear existing outlets
    fieldArray.remove()

    // Add recommended outlets based on room type and gas type
    for (const room of rooms) {
      let count = 2 // Default outlets per room
      let location = "Chair-side right"

      // Customize based on room type and gas type
      if (room.includes('Treatment Room') || room.includes('Surgical Suite')) {
        if (gasType === 'nitrousOxide') {
          count = 1 // Usually 1 N2O outlet per operatory
        } else if (gasType === 'oxygen') {
          count = 2 // 2 oxygen outlets per operatory
        } else if (gasType === 'medicalAir') {
          count = 2 // 2 air outlets per operatory
        } else if (gasType === 'vacuumSystem') {
          count = 3 // 3 vacuum outlets per operatory (HVE + saliva ejector + spare)
        }
      } else if (room.includes('Consultation')) {
        count = 1 // Minimal gas services in consult rooms
        location = "Wall mounted right"
      } else if (room.includes('Recovery')) {
        if (gasType === 'oxygen') {
          count = 2 // Emergency oxygen in recovery
        } else if (gasType === 'vacuumSystem') {
          count = 1 // Basic suction in recovery
        } else {
          count = 0 // Skip N2O and air in recovery
        }
      } else if (room.includes('Laboratory')) {
        if (gasType === 'vacuumSystem') {
          count = 1 // Lab vacuum only
        } else {
          count = 0 // No other gases in lab typically
        }
      } else if (room.includes('Sterilization')) {
        if (gasType === 'medicalAir') {
          count = 1 // Air for autoclaves
        } else {
          count = 0 // No other gases in sterilization
        }
      }

      if (count > 0) {
        fieldArray.append({
          room,
          count,
          location
        })
      }
    }
  }

  const getComplianceAlerts = () => {
    const alerts = []

    if (!roomConfig) {
      alerts.push({
        type: "warning",
        message: "Complete room configuration first to get personalized gas recommendations."
      })
    }

    if (form.watch("nitrousOxide.required") && !form.watch("nitrousOxide.scavengingSystem")) {
      alerts.push({
        type: "error",
        message: "NFPA 99 requires scavenging systems for nitrous oxide installations."
      })
    }

    if (form.watch("oxygen.required") && !form.watch("oxygen.backupSystem")) {
      alerts.push({
        type: "warning",
        message: "Consider backup oxygen system for enhanced patient safety."
      })
    }

    const totalGases = [
      form.watch("oxygen.required"),
      form.watch("nitrousOxide.required"),
      form.watch("medicalAir.required"),
      form.watch("vacuumSystem.required")
    ].filter(Boolean).length

    if (totalGases >= 2 && form.watch("oxygen.emergencyShutoffs") < 2) {
      alerts.push({
        type: "error",
        message: "Multiple gas systems require minimum 2 emergency shutoff locations per NFPA 99."
      })
    }

    return alerts
  }

  const complianceAlerts = getComplianceAlerts()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Wind className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Medical Gas System Configuration
        </h3>
        <p className="text-gray-600 mb-6">
          Configure oxygen, nitrous oxide, medical air, and vacuum systems with NFPA 99 compliance
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{totalOutlets.oxygen}</div>
              <div className="text-sm text-gray-600">O₂ Outlets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{totalOutlets.nitrous}</div>
              <div className="text-sm text-gray-600">N₂O Outlets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{totalOutlets.air}</div>
              <div className="text-sm text-gray-600">Air Outlets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{totalOutlets.vacuum}</div>
              <div className="text-sm text-gray-600">Vacuum Outlets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">${(estimatedCost / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">Est. Cost</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <div className="space-y-3">
          {complianceAlerts.map((alert) => (
            <Alert key={alert.message} variant={alert.type === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Form {...form}>
        <Tabs defaultValue="oxygen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="oxygen" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Oxygen
            </TabsTrigger>
            <TabsTrigger value="nitrous" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              Nitrous Oxide
            </TabsTrigger>
            <TabsTrigger value="air" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Medical Air
            </TabsTrigger>
            <TabsTrigger value="vacuum" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              Vacuum
            </TabsTrigger>
          </TabsList>

          {/* Oxygen Tab */}
          <TabsContent value="oxygen" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-3" />
                      Medical Oxygen (O₂) System
                    </CardTitle>
                    <CardDescription>
                      Essential for sedation, emergency response, and surgical procedures
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="oxygen.required"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include Oxygen System</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("oxygen.required") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => autoPopulateOutlets('oxygen')}
                        disabled={!roomConfig}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Auto-Configure
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {form.watch("oxygen.required") && (
                <CardContent className="space-y-6">
                  {/* Oxygen Outlets */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Oxygen Outlets</h4>
                    {oxygenOutlets.fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                        <FormField
                          control={form.control}
                          name={`oxygen.outlets.${index}.room`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getAvailableRooms().map((room) => (
                                    <SelectItem key={room} value={room}>
                                      {room}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`oxygen.outlets.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Outlets</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="6"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`oxygen.outlets.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locationOptions.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => oxygenOutlets.remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => oxygenOutlets.append({ room: "", count: 2, location: "" })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Oxygen Outlet
                    </Button>
                  </div>

                  {/* System Configuration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">System Configuration</h4>
                      <FormField
                        control={form.control}
                        name="oxygen.centralSupply"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Central Oxygen Supply</FormLabel>
                              <FormDescription>
                                Bulk oxygen tank system with automatic switching
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="oxygen.backupSystem"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Backup System</FormLabel>
                              <FormDescription>
                                Emergency oxygen backup per NFPA 99 requirements
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="oxygen.manifoldLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manifold Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {manifoldLocationOptions.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="oxygen.emergencyShutoffs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Shutoff Locations</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="6"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              NFPA 99 requires accessible emergency shutoffs
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Nitrous Oxide Tab */}
          <TabsContent value="nitrous" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-4 h-4 rounded-full bg-purple-500 mr-3" />
                      Nitrous Oxide (N₂O) System
                    </CardTitle>
                    <CardDescription>
                      Sedation gas system with required scavenging per NFPA 99
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="nitrousOxide.required"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include N₂O System</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("nitrousOxide.required") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => autoPopulateOutlets('nitrousOxide')}
                        disabled={!roomConfig}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Auto-Configure
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {form.watch("nitrousOxide.required") && (
                <CardContent className="space-y-6">
                  {/* N2O Outlets */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Nitrous Oxide Outlets</h4>
                    {nitrousOutlets.fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-4 gap-4 p-4 bg-purple-50 rounded-lg">
                        <FormField
                          control={form.control}
                          name={`nitrousOxide.outlets.${index}.room`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getAvailableRooms().map((room) => (
                                    <SelectItem key={room} value={room}>
                                      {room}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`nitrousOxide.outlets.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Outlets</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="4"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`nitrousOxide.outlets.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locationOptions.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => nitrousOutlets.remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => nitrousOutlets.append({ room: "", count: 1, location: "" })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add N₂O Outlet
                    </Button>
                  </div>

                  {/* System Configuration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">System Configuration</h4>
                      <FormField
                        control={form.control}
                        name="nitrousOxide.centralSupply"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Central N₂O Supply</FormLabel>
                              <FormDescription>
                                Bulk tank system with pressure regulation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nitrousOxide.scavengingSystem"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Scavenging System</FormLabel>
                              <FormDescription>
                                Required by NFPA 99 for waste gas removal
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nitrousOxide.manifoldLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manifold Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {manifoldLocationOptions.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nitrousOxide.emergencyShutoffs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Shutoff Locations</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="6"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Accessible shutoffs per NFPA 99
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Medical Air Tab */}
          <TabsContent value="air" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-3" />
                      Medical Air System
                    </CardTitle>
                    <CardDescription>
                      Oil-free compressed air for dental handpieces and instruments
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="medicalAir.required"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include Medical Air</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("medicalAir.required") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => autoPopulateOutlets('medicalAir')}
                        disabled={!roomConfig}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Auto-Configure
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {form.watch("medicalAir.required") && (
                <CardContent className="space-y-6">
                  {/* Air Outlets */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Medical Air Outlets</h4>
                    {airOutlets.fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg">
                        <FormField
                          control={form.control}
                          name={`medicalAir.outlets.${index}.room`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getAvailableRooms().map((room) => (
                                    <SelectItem key={room} value={room}>
                                      {room}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medicalAir.outlets.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Outlets</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="6"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medicalAir.outlets.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locationOptions.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => airOutlets.remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => airOutlets.append({ room: "", count: 2, location: "" })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medical Air Outlet
                    </Button>
                  </div>

                  {/* System Configuration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">System Configuration</h4>
                      <FormField
                        control={form.control}
                        name="medicalAir.oilFree"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Oil-Free Compressor</FormLabel>
                              <FormDescription>
                                Medical-grade oil-free air system
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="medicalAir.backupCompressor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Backup Compressor</FormLabel>
                              <FormDescription>
                                Redundant air compressor for reliability
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="medicalAir.manifoldLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compressor Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {manifoldLocationOptions.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Vacuum System Tab */}
          <TabsContent value="vacuum" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500 mr-3" />
                      Medical Vacuum System
                    </CardTitle>
                    <CardDescription>
                      High-volume evacuation and suction for dental procedures
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="vacuumSystem.required"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include Vacuum System</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("vacuumSystem.required") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => autoPopulateOutlets('vacuumSystem')}
                        disabled={!roomConfig}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Auto-Configure
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {form.watch("vacuumSystem.required") && (
                <CardContent className="space-y-6">
                  {/* Vacuum Outlets */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Vacuum Outlets</h4>
                    {vacuumOutlets.fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-4 gap-4 p-4 bg-orange-50 rounded-lg">
                        <FormField
                          control={form.control}
                          name={`vacuumSystem.outlets.${index}.room`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getAvailableRooms().map((room) => (
                                    <SelectItem key={room} value={room}>
                                      {room}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vacuumSystem.outlets.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Outlets</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="8"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vacuumSystem.outlets.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locationOptions.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => vacuumOutlets.remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => vacuumOutlets.append({ room: "", count: 3, location: "" })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vacuum Outlet
                    </Button>
                  </div>

                  {/* System Configuration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">System Configuration</h4>
                      <FormField
                        control={form.control}
                        name="vacuumSystem.centralSystem"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Central Vacuum System</FormLabel>
                              <FormDescription>
                                Centralized vacuum pump system
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vacuumSystem.backupPump"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Backup Pump</FormLabel>
                              <FormDescription>
                                Redundant vacuum pump for reliability
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="vacuumSystem.manifoldLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pump Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {manifoldLocationOptions.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

        </Tabs>
      </Form>
    </div>
  )
}
