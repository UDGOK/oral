"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EstimateData } from "@/types/estimate"
import { CheckCircle, FileText, DollarSign, Download } from "lucide-react"

interface ReviewStepProps {
  data: Partial<EstimateData>
  onUpdate: (data: Partial<EstimateData>) => void
  onValidationChange: (isValid: boolean) => void
}

export default function ReviewStep({ data, onUpdate, onValidationChange }: ReviewStepProps) {
  const [estimateGenerated, setEstimateGenerated] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)

  useEffect(() => {
    // Simple cost estimation algorithm
    const calculateEstimate = () => {
      let totalCost = 0

      if (data.projectBasics) {
        // Base cost per square foot
        const baseCostPerSqFt = data.projectBasics.projectType === 'new-construction' ? 150 : 125
        totalCost += data.projectBasics.totalSquareFootage * baseCostPerSqFt

        // Timeline adjustments
        if (data.projectBasics.projectTimeline === 'accelerated') {
          totalCost *= 1.15 // 15% premium for accelerated timeline
        } else if (data.projectBasics.projectTimeline === 'relaxed') {
          totalCost *= 0.95 // 5% discount for relaxed timeline
        }
      }

      if (data.roomConfiguration) {
        // Add costs for specialized rooms
        totalCost += data.roomConfiguration.treatmentRooms.count * 25000
        totalCost += data.roomConfiguration.specialRooms.surgicalSuites.count * 45000
        totalCost += data.roomConfiguration.sterilizationAreas.centralSterile.size * 200

        if (data.roomConfiguration.labSpaces.hasLab && data.roomConfiguration.labSpaces.size) {
          totalCost += data.roomConfiguration.labSpaces.size * 300
        }
      }

      if (data.medicalGasRequirements) {
        // Medical gas systems
        const totalOutlets = [
          ...data.medicalGasRequirements.oxygen.outlets,
          ...data.medicalGasRequirements.nitrousOxide.outlets,
          ...data.medicalGasRequirements.vacuumSystem.outlets,
          ...data.medicalGasRequirements.medicalAir.outlets,
        ]
        totalCost += totalOutlets.length * 1500 // $1500 per outlet
        totalCost += 25000 // Base medical gas system cost
      }

      return Math.round(totalCost)
    }

    const estimate = calculateEstimate()
    setEstimatedCost(estimate)
    onValidationChange(true)
  }, [data, onValidationChange])

  const generateEstimate = () => {
    setEstimateGenerated(true)
    const updatedData = {
      ...data,
      costBreakdown: {
        sitePrep: Math.round(estimatedCost * 0.05),
        demolition: Math.round(estimatedCost * 0.08),
        framingDrywallInsulation: Math.round(estimatedCost * 0.15),
        hvac: Math.round(estimatedCost * 0.12),
        electrical: Math.round(estimatedCost * 0.10),
        plumbing: Math.round(estimatedCost * 0.08),
        millworkSurfaces: Math.round(estimatedCost * 0.10),
        flooringDoors: Math.round(estimatedCost * 0.06),
        paint: Math.round(estimatedCost * 0.04),
        medicalGas: Math.round(estimatedCost * 0.06),
        specialEquipment: Math.round(estimatedCost * 0.08),
        permits: Math.round(estimatedCost * 0.02),
        generalConditions: Math.round(estimatedCost * 0.08),
        overhead: Math.round(estimatedCost * 0.06),
        profit: Math.round(estimatedCost * 0.08),
        contingency: Math.round(estimatedCost * 0.10),
        total: estimatedCost,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onUpdate(updatedData)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Review & Generate Estimate
        </h3>
        <p className="text-gray-600">
          Review your project details and generate a comprehensive cost estimate
        </p>
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.projectBasics && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Project Details</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li><strong>Name:</strong> {data.projectBasics.projectName}</li>
                  <li><strong>Location:</strong> {data.projectBasics.location.city}, {data.projectBasics.location.state}</li>
                  <li><strong>Size:</strong> {data.projectBasics.totalSquareFootage.toLocaleString()} sq ft</li>
                  <li><strong>Type:</strong> {data.projectBasics.projectType.replace('-', ' ')}</li>
                </ul>
              </div>
              {data.roomConfiguration && (
                <div>
                  <h4 className="font-semibold text-gray-900">Room Configuration</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li><strong>Treatment Rooms:</strong> {data.roomConfiguration.treatmentRooms.count}</li>
                    <li><strong>Surgical Suites:</strong> {data.roomConfiguration.specialRooms.surgicalSuites.count}</li>
                    <li><strong>Consultation Rooms:</strong> {data.roomConfiguration.consultationRooms.count}</li>
                    <li><strong>Recovery Rooms:</strong> {data.roomConfiguration.recoveryRooms.count}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Estimate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Estimated Project Cost
          </CardTitle>
          <CardDescription>
            AI-generated estimate based on your project specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${estimatedCost.toLocaleString()}
            </div>
            <p className="text-gray-600">Total Project Cost</p>

            {data.projectBasics && (
              <div className="mt-4 text-sm text-gray-500">
                Approximately ${Math.round(estimatedCost / data.projectBasics.totalSquareFootage).toLocaleString()} per square foot
              </div>
            )}
          </div>

          {!estimateGenerated ? (
            <div className="text-center">
              <Button onClick={generateEstimate} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Generate Detailed Estimate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Detailed estimate generated successfully!</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">
                    ${Math.round(estimatedCost * 0.35).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Construction</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    ${Math.round(estimatedCost * 0.30).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">MEP Systems</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-600">
                    ${Math.round(estimatedCost * 0.20).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Equipment</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">
                    ${Math.round(estimatedCost * 0.15).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Finishes</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Badge variant="outline">1</Badge>
              <span className="text-gray-700">Save this estimate to your dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline">2</Badge>
              <span className="text-gray-700">Share with stakeholders and contractors</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline">3</Badge>
              <span className="text-gray-700">Refine specifications and get detailed quotes</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline">4</Badge>
              <span className="text-gray-700">Begin construction planning and permitting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
