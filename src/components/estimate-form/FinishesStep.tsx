"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FinishLevel } from "@/types/estimate"
import { Palette } from "lucide-react"

interface FinishesStepProps {
  data?: FinishLevel
  onUpdate: (data: FinishLevel) => void
  onValidationChange: (isValid: boolean) => void
}

export default function FinishesStep({ data, onUpdate, onValidationChange }: FinishesStepProps) {
  const [formData, setFormData] = useState<FinishLevel>(data || {
    category: "premium",
    flooring: {
      operatories: "luxury-vinyl",
      waitingArea: "carpet-tile",
      offices: "carpet-tile",
      corridors: "luxury-vinyl",
    },
    wallFinishes: {
      paintGrade: "premium",
      wallcovering: false,
      wainscoting: false,
      specialFinishes: [],
    },
    ceilings: {
      type: "premium-acm",
      height: 9,
      specialFeatures: [],
    },
    cabinetry: {
      material: "wood-veneer",
      style: "modern",
      customMillwork: false,
    },
    countertops: {
      material: "quartz",
      edgeProfile: "standard",
    },
    lighting: {
      level: "premium",
      controlSystems: true,
      emergencyLighting: true,
    },
  })

  useEffect(() => {
    onUpdate(formData)
    onValidationChange(true)
  }, [formData, onUpdate, onValidationChange])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Finishes & Materials
        </h3>
        <p className="text-gray-600">
          Select flooring, cabinetry, countertops, and lighting options
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finishes Configuration</CardTitle>
          <CardDescription>
            Detailed finishes selection form will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Finishes and materials form coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Flooring materials for each area type</li>
            <li>Wall finishes and paint specifications</li>
            <li>Ceiling types and height requirements</li>
            <li>Cabinetry materials and styles</li>
            <li>Countertop materials and edge profiles</li>
            <li>Lighting specifications and controls</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
