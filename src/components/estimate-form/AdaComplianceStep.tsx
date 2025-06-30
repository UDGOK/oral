"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdaCompliance } from "@/types/estimate"
import { Accessibility } from "lucide-react"

interface AdaComplianceStepProps {
  data?: AdaCompliance
  onUpdate: (data: AdaCompliance) => void
  onValidationChange: (isValid: boolean) => void
}

export default function AdaComplianceStep({ data, onUpdate, onValidationChange }: AdaComplianceStepProps) {
  const [formData, setFormData] = useState<AdaCompliance>(data || {
    accessibleEntrance: true,
    accessiblePath: true,
    accessibleRestrooms: 1,
    hearingLoopSystem: false,
    accessibleParkingSpaces: 2,
    elevatorRequired: false,
    accessibleReceptionCounter: true,
    doorHardware: "accessible",
    signageCompliance: true,
  })

  useEffect(() => {
    onUpdate(formData)
    onValidationChange(true)
  }, [formData, onUpdate, onValidationChange])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Accessibility className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ADA Compliance
        </h3>
        <p className="text-gray-600">
          Configure accessibility features and compliance requirements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ADA Compliance Configuration</CardTitle>
          <CardDescription>
            Accessibility requirements form will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            ADA compliance form coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Accessible entrance and path requirements</li>
            <li>Accessible restroom specifications</li>
            <li>Hearing loop system options</li>
            <li>Parking space requirements</li>
            <li>Reception counter accessibility</li>
            <li>Door hardware specifications</li>
            <li>Signage compliance requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
