"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EquipmentIntegration, RoomConfiguration } from "@/types/estimate"
import { Monitor } from "lucide-react"

interface EquipmentStepProps {
  data?: EquipmentIntegration
  roomConfig?: RoomConfiguration
  onUpdate: (data: EquipmentIntegration) => void
  onValidationChange: (isValid: boolean) => void
}

export default function EquipmentStep({ data, roomConfig, onUpdate, onValidationChange }: EquipmentStepProps) {
  const [formData, setFormData] = useState<EquipmentIntegration>(data || {
    dentalChairs: {
      count: 6,
      type: "mid-range",
      manufacturer: "",
      integratedDelivery: true,
    },
    xrayUnits: {
      intraoral: { count: 2, digital: true },
      panoramic: { count: 1, digital: true },
      cephalometric: { count: 0 },
    },
    cbct: {
      hasUnit: false,
    },
    sterilizationEquipment: {
      autoclaves: { count: 2, size: "medium" },
      ultrasonicCleaners: 1,
      sealers: 1,
    },
    surgicalEquipment: {
      surgicalLights: 1,
      monitors: 1,
      anesthesiaMachines: 1,
      surgicalTables: 1,
    },
    labEquipment: {
      models3dPrinter: false,
      scanners: 1,
      millingMachine: false,
    },
  })

  useEffect(() => {
    onUpdate(formData)
    onValidationChange(true)
  }, [formData, onUpdate, onValidationChange])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Equipment Integration
        </h3>
        <p className="text-gray-600">
          Configure dental chairs, X-ray units, and specialized equipment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Configuration</CardTitle>
          <CardDescription>
            This step will be implemented with detailed equipment selection forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Equipment integration form coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Dental chair selection and configuration</li>
            <li>X-ray equipment (intraoral, panoramic, CBCT)</li>
            <li>Sterilization equipment setup</li>
            <li>Surgical equipment integration</li>
            <li>Laboratory equipment if applicable</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
