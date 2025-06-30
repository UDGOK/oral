"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RoomConfiguration } from "@/types/estimate"
import { Building2, Users, Stethoscope, Wrench, Archive, UserCheck, Briefcase, Coffee, ShieldCheck } from "lucide-react"

interface EnhancedRoomConfigurationStepProps {
  data?: RoomConfiguration
  onUpdate: (data: RoomConfiguration) => void
  onValidationChange: (isValid: boolean) => void
}

export default function EnhancedRoomConfigurationStep({ data, onUpdate, onValidationChange }: EnhancedRoomConfigurationStepProps) {
  const [formData, setFormData] = useState<RoomConfiguration>(data || {
    treatmentRooms: {
      count: 6,
      size: "standard",
      hasWindows: true,
      ceilingHeight: 9,
      specialFeatures: [],
    },
    consultationRooms: {
      count: 2,
      size: "medium",
      hasWindows: true,
    },
    recoveryRooms: {
      count: 2,
      beds: 4,
      privateRooms: 1,
      sharedRooms: 1,
    },
    labSpaces: {
      count: 0,
      hasLab: false,
      size: 0,
      equipmentLevel: "basic",
      hasCADCAM: false,
      has3DPrinter: false,
    },
    sterilizationAreas: {
      centralSterile: {
        size: 150,
        equipmentLevel: "advanced",
      },
      dirtyUtility: {
        size: 75,
        required: true,
      },
      cleanUtility: {
        size: 75,
        required: true,
      },
    },
    administrativeAreas: {
      reception: {
        hasReception: true,
        size: 200,
        workstations: 2,
      },
      privateOffices: {
        count: 2,
        executiveOffice: true,
        managerOffices: 1,
      },
      openWorkArea: {
        hasOpenArea: true,
        workstations: 3,
        size: 150,
      },
      conferenceRoom: {
        hasConferenceRoom: true,
        capacity: 8,
      },
      recordsRoom: {
        hasRecordsRoom: true,
        size: 100,
        fireRated: true,
      },
    },
    breakRoomStaffAreas: {
      breakRoom: {
        hasBreakRoom: true,
        size: 120,
        hasKitchen: true,
      },
      lockers: {
        hasLockers: true,
        count: 12,
      },
      staffLounge: {
        hasLounge: false,
        size: 0,
      },
    },
    storageUtilityRooms: {
      generalStorage: {
        count: 2,
        totalSize: 100,
      },
      medicalSupplyStorage: {
        size: 75,
        temperatureControlled: false,
        securityLevel: "standard",
      },
      equipmentStorage: {
        size: 60,
        hasCharging: true,
      },
      janitorialClosets: {
        count: 2,
        hasUtilitySink: true,
      },
      mechanicalRooms: {
        hvacRoom: true,
        electricalRoom: true,
        dataCloset: true,
        medicalGasManifold: true,
      },
    },
    waitingArea: {
      mainWaiting: {
        size: 400,
        seatingCapacity: 16,
        hasReception: true,
      },
      childrenArea: {
        hasChildrenArea: true,
        size: 80,
      },
      privateWaiting: {
        hasPrivateWaiting: false,
        rooms: 0,
      },
      consultationWaiting: {
        hasConsultWaiting: true,
        seatingCapacity: 6,
      },
    },
    restrooms: {
      patientRestrooms: {
        count: 2,
        adaCompliant: true,
        familyRestroom: true,
      },
      staffRestrooms: {
        count: 1,
        adaCompliant: true,
      },
    },
    specialRooms: {
      xrayRooms: {
        count: 1,
        leadLined: true,
        digitalEquipment: true,
      },
      surgicalSuites: {
        count: 1,
        size: "standard",
        isolationCapable: false,
      },
      panRoom: {
        hasPanRoom: true,
        leadLined: true,
      },
      cbctRoom: {
        hasCBCT: false,
        leadLined: false,
        size: 0,
      },
    },
  })

  const [totalSquareFootage, setTotalSquareFootage] = useState(0)

  useEffect(() => {
    onUpdate(formData)
    onValidationChange(true)
    calculateTotalSquareFootage()
  }, [formData, onUpdate, onValidationChange])

  const calculateTotalSquareFootage = () => {
    let total = 0

    // Treatment rooms (120-200 sq ft each based on size)
    const treatmentSizes = { compact: 100, standard: 140, large: 180, premium: 220 }
    total += formData.treatmentRooms.count * treatmentSizes[formData.treatmentRooms.size]

    // Consultation rooms
    const consultSizes = { small: 80, medium: 100, large: 120 }
    total += formData.consultationRooms.count * consultSizes[formData.consultationRooms.size]

    // Recovery rooms (150 sq ft each)
    total += formData.recoveryRooms.count * 150

    // Lab spaces
    if (formData.labSpaces.hasLab) {
      total += formData.labSpaces.size
    }

    // Sterilization areas
    total += formData.sterilizationAreas.centralSterile.size
    if (formData.sterilizationAreas.dirtyUtility.required) {
      total += formData.sterilizationAreas.dirtyUtility.size
    }
    if (formData.sterilizationAreas.cleanUtility.required) {
      total += formData.sterilizationAreas.cleanUtility.size
    }

    // Administrative areas
    if (formData.administrativeAreas.reception.hasReception) {
      total += formData.administrativeAreas.reception.size
    }
    total += formData.administrativeAreas.privateOffices.count * 120
    if (formData.administrativeAreas.openWorkArea.hasOpenArea) {
      total += formData.administrativeAreas.openWorkArea.size
    }
    if (formData.administrativeAreas.conferenceRoom.hasConferenceRoom) {
      total += formData.administrativeAreas.conferenceRoom.capacity * 15
    }
    if (formData.administrativeAreas.recordsRoom.hasRecordsRoom) {
      total += formData.administrativeAreas.recordsRoom.size
    }

    // Break room and staff areas
    if (formData.breakRoomStaffAreas.breakRoom.hasBreakRoom) {
      total += formData.breakRoomStaffAreas.breakRoom.size
    }
    if (formData.breakRoomStaffAreas.lockers.hasLockers) {
      total += formData.breakRoomStaffAreas.lockers.count * 5
    }
    if (formData.breakRoomStaffAreas.staffLounge.hasLounge) {
      total += formData.breakRoomStaffAreas.staffLounge.size
    }

    // Storage and utility
    total += formData.storageUtilityRooms.generalStorage.totalSize
    total += formData.storageUtilityRooms.medicalSupplyStorage.size
    total += formData.storageUtilityRooms.equipmentStorage.size
    total += formData.storageUtilityRooms.janitorialClosets.count * 25

    // Mechanical rooms (estimated)
    let mechanicalSpace = 0
    if (formData.storageUtilityRooms.mechanicalRooms.hvacRoom) mechanicalSpace += 100
    if (formData.storageUtilityRooms.mechanicalRooms.electricalRoom) mechanicalSpace += 60
    if (formData.storageUtilityRooms.mechanicalRooms.dataCloset) mechanicalSpace += 40
    if (formData.storageUtilityRooms.mechanicalRooms.medicalGasManifold) mechanicalSpace += 50
    total += mechanicalSpace

    // Waiting areas
    total += formData.waitingArea.mainWaiting.size
    if (formData.waitingArea.childrenArea.hasChildrenArea) {
      total += formData.waitingArea.childrenArea.size
    }
    if (formData.waitingArea.privateWaiting.hasPrivateWaiting) {
      total += formData.waitingArea.privateWaiting.rooms * 80
    }
    if (formData.waitingArea.consultationWaiting.hasConsultWaiting) {
      total += formData.waitingArea.consultationWaiting.seatingCapacity * 15
    }

    // Restrooms (60 sq ft each)
    total += formData.restrooms.patientRestrooms.count * 60
    total += formData.restrooms.staffRestrooms.count * 60
    if (formData.restrooms.patientRestrooms.familyRestroom) {
      total += 80
    }

    // Special rooms
    total += formData.specialRooms.xrayRooms.count * 100
    const surgicalSizes = { standard: 250, large: 350 }
    total += formData.specialRooms.surgicalSuites.count * surgicalSizes[formData.specialRooms.surgicalSuites.size]
    if (formData.specialRooms.panRoom.hasPanRoom) {
      total += 120
    }
    if (formData.specialRooms.cbctRoom.hasCBCT) {
      total += formData.specialRooms.cbctRoom.size
    }

    // Add circulation space (typically 20-25% of net area)
    total = total * 1.22

    setTotalSquareFootage(Math.round(total))
  }

  const updateField = (path: string, value: unknown) => {
    const keys = path.split('.')
    const newData = { ...formData }
    let current: Record<string, unknown> = newData as Record<string, unknown>

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>
    }

    current[keys[keys.length - 1]] = value
    setFormData(newData as RoomConfiguration)
  }

  const getRoomSummary = () => {
    return {
      treatmentRooms: formData.treatmentRooms.count,
      totalRooms: formData.treatmentRooms.count +
                 formData.consultationRooms.count +
                 formData.recoveryRooms.count +
                 formData.specialRooms.xrayRooms.count +
                 formData.specialRooms.surgicalSuites.count,
      specialRooms: formData.specialRooms.xrayRooms.count + formData.specialRooms.surgicalSuites.count
    }
  }

  const summary = getRoomSummary()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Configure Your Space Layout
        </h3>
        <p className="text-gray-600 mb-6">
          Design your oral surgery office with detailed room specifications
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{summary.treatmentRooms}</div>
              <div className="text-sm text-gray-600">Treatment Rooms</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{summary.totalRooms}</div>
              <div className="text-sm text-gray-600">Total Rooms</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{totalSquareFootage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Est. Sq Ft</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="clinical" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clinical" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Clinical
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Support
          </TabsTrigger>
          <TabsTrigger value="patient" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patient
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Special
          </TabsTrigger>
        </TabsList>

        {/* Clinical Spaces Tab */}
        <TabsContent value="clinical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                Treatment Rooms (1-20 rooms)
              </CardTitle>
              <CardDescription>
                Primary clinical spaces for patient treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="treatmentCount">Number of Rooms</Label>
                  <Input
                    id="treatmentCount"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.treatmentRooms.count}
                    onChange={(e) => updateField('treatmentRooms.count', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="treatmentSize">Room Size</Label>
                  <Select
                    value={formData.treatmentRooms.size}
                    onValueChange={(value) => updateField('treatmentRooms.size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact (100 sq ft)</SelectItem>
                      <SelectItem value="standard">Standard (140 sq ft)</SelectItem>
                      <SelectItem value="large">Large (180 sq ft)</SelectItem>
                      <SelectItem value="premium">Premium (220 sq ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                  <Input
                    id="ceilingHeight"
                    type="number"
                    min="8"
                    max="12"
                    step="0.5"
                    value={formData.treatmentRooms.ceilingHeight}
                    onChange={(e) => updateField('treatmentRooms.ceilingHeight', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="hasWindows"
                    checked={formData.treatmentRooms.hasWindows}
                    onCheckedChange={(checked) => updateField('treatmentRooms.hasWindows', checked)}
                  />
                  <Label htmlFor="hasWindows">Natural Light</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Rooms (0-10)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consultCount">Number of Rooms</Label>
                    <Input
                      id="consultCount"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.consultationRooms.count}
                      onChange={(e) => updateField('consultationRooms.count', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultSize">Room Size</Label>
                    <Select
                      value={formData.consultationRooms.size}
                      onValueChange={(value) => updateField('consultationRooms.size', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (80 sq ft)</SelectItem>
                        <SelectItem value="medium">Medium (100 sq ft)</SelectItem>
                        <SelectItem value="large">Large (120 sq ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consultWindows"
                    checked={formData.consultationRooms.hasWindows}
                    onCheckedChange={(checked) => updateField('consultationRooms.hasWindows', checked)}
                  />
                  <Label htmlFor="consultWindows">Natural Light</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recovery Rooms (0-5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recoveryCount">Number of Rooms</Label>
                    <Input
                      id="recoveryCount"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.recoveryRooms.count}
                      onChange={(e) => updateField('recoveryRooms.count', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recoveryBeds">Total Beds</Label>
                    <Input
                      id="recoveryBeds"
                      type="number"
                      min="0"
                      value={formData.recoveryRooms.beds}
                      onChange={(e) => updateField('recoveryRooms.beds', Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Areas Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-blue-600" />
                Support Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sterileSize">Central Sterile Size (sq ft)</Label>
                  <Input
                    id="sterileSize"
                    type="number"
                    min="100"
                    max="500"
                    value={formData.sterilizationAreas.centralSterile.size}
                    onChange={(e) => updateField('sterilizationAreas.centralSterile.size', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="storageSize">Medical Supply Storage (sq ft)</Label>
                  <Input
                    id="storageSize"
                    type="number"
                    min="50"
                    value={formData.storageUtilityRooms.medicalSupplyStorage.size}
                    onChange={(e) => updateField('storageUtilityRooms.medicalSupplyStorage.size', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Areas Tab */}
        <TabsContent value="patient" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Patient Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waitingSize">Main Waiting Area (sq ft)</Label>
                  <Input
                    id="waitingSize"
                    type="number"
                    min="150"
                    max="1000"
                    value={formData.waitingArea.mainWaiting.size}
                    onChange={(e) => updateField('waitingArea.mainWaiting.size', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="restroomCount">Patient Restrooms</Label>
                  <Input
                    id="restroomCount"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.restrooms.patientRestrooms.count}
                    onChange={(e) => updateField('restrooms.patientRestrooms.count', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Areas Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Administrative Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officeCount">Private Offices</Label>
                  <Input
                    id="officeCount"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.administrativeAreas.privateOffices.count}
                    onChange={(e) => updateField('administrativeAreas.privateOffices.count', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="hasReception"
                    checked={formData.administrativeAreas.reception.hasReception}
                    onCheckedChange={(checked) => updateField('administrativeAreas.reception.hasReception', checked)}
                  />
                  <Label htmlFor="hasReception">Reception Desk</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Rooms Tab */}
        <TabsContent value="special" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
                Special Rooms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="xrayCount">X-Ray Rooms</Label>
                  <Input
                    id="xrayCount"
                    type="number"
                    min="0"
                    max="5"
                    value={formData.specialRooms.xrayRooms.count}
                    onChange={(e) => updateField('specialRooms.xrayRooms.count', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="surgicalCount">Surgical Suites</Label>
                  <Input
                    id="surgicalCount"
                    type="number"
                    min="0"
                    max="5"
                    value={formData.specialRooms.surgicalSuites.count}
                    onChange={(e) => updateField('specialRooms.surgicalSuites.count', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPan"
                    checked={formData.specialRooms.panRoom.hasPanRoom}
                    onCheckedChange={(checked) => updateField('specialRooms.panRoom.hasPanRoom', checked)}
                  />
                  <Label htmlFor="hasPan">Panoramic X-Ray Room</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCBCT"
                    checked={formData.specialRooms.cbctRoom.hasCBCT}
                    onCheckedChange={(checked) => updateField('specialRooms.cbctRoom.hasCBCT', checked)}
                  />
                  <Label htmlFor="hasCBCT">CBCT Room</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
