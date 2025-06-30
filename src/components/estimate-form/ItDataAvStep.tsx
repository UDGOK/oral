"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ItDataAvNeeds, RoomConfiguration } from "@/types/estimate"
import { Wifi } from "lucide-react"

interface ItDataAvStepProps {
  data?: ItDataAvNeeds
  roomConfig?: RoomConfiguration
  onUpdate: (data: ItDataAvNeeds) => void
  onValidationChange: (isValid: boolean) => void
}

export default function ItDataAvStep({ data, roomConfig, onUpdate, onValidationChange }: ItDataAvStepProps) {
  const [formData, setFormData] = useState<ItDataAvNeeds>(data || {
    networkDrops: [],
    wifiAccess: {
      commercial: true,
      guestNetwork: true,
      coverage: "enterprise",
    },
    phoneSystem: {
      type: "voip",
      extensions: 8,
      nurseCalls: true,
    },
    securitySystem: {
      cameras: 4,
      accessControl: true,
      alarmSystem: true,
    },
    audiovisual: {
      tvs: [],
      soundSystem: true,
      intercom: true,
    },
    serverRoom: {
      required: true,
      size: 50,
      cooling: true,
    },
  })

  useEffect(() => {
    onUpdate(formData)
    onValidationChange(true)
  }, [formData, onUpdate, onValidationChange])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          IT, Data & AV Systems
        </h3>
        <p className="text-gray-600">
          Configure network, phone, security, and audiovisual requirements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technology Systems Configuration</CardTitle>
          <CardDescription>
            IT, data, and AV systems form will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Technology systems form coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Network drops and data infrastructure</li>
            <li>WiFi access points and coverage</li>
            <li>Phone system and extensions</li>
            <li>Security cameras and access control</li>
            <li>Audiovisual equipment and displays</li>
            <li>Server room requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
