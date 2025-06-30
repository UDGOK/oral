"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Building, CheckCircle, DollarSign, MapPin } from "lucide-react"

// Form steps for the oral surgeon cost estimator
const formSteps = [
  {
    id: "project-basics",
    title: "Project Basics",
    description: "Location, size, and timeline information",
    isComplete: false,
    isValid: false,
  },
  {
    id: "room-configuration",
    title: "Room Configuration",
    description: "Operatories, offices, and space planning",
    isComplete: false,
    isValid: false,
  },
  {
    id: "medical-gas",
    title: "Medical Gas Systems",
    description: "Oxygen, nitrous oxide, vacuum, and compressed air",
    isComplete: false,
    isValid: false,
  },
  {
    id: "equipment",
    title: "Equipment Integration",
    description: "Dental chairs, X-ray, CBCT, and specialized equipment",
    isComplete: false,
    isValid: false,
  },
  {
    id: "finishes",
    title: "Finishes & Materials",
    description: "Flooring, cabinetry, countertops, and lighting",
    isComplete: false,
    isValid: false,
  },
  {
    id: "ada-compliance",
    title: "ADA Compliance",
    description: "Accessibility requirements and features",
    isComplete: false,
    isValid: false,
  },
  {
    id: "it-data-av",
    title: "IT, Data & AV",
    description: "Network, phone, security, and audiovisual systems",
    isComplete: false,
    isValid: false,
  },
  {
    id: "review",
    title: "Review & Generate",
    description: "Final review and estimate generation",
    isComplete: false,
    isValid: false,
  },
]

// Regional cost multipliers
const stateCostMultipliers: Record<string, number> = {
  "CA": 1.35, "NY": 1.30, "HI": 1.25, "MA": 1.20, "CT": 1.18,
  "NJ": 1.15, "WA": 1.12, "MD": 1.10, "IL": 1.08, "FL": 1.05,
  "TX": 1.00, "NC": 0.95, "GA": 0.92, "TN": 0.90, "OH": 0.88,
}

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

export default function NewEstimatePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(formSteps)

  // Step 1 form data - inline state
  const [projectName, setProjectName] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [squareFootage, setSquareFootage] = useState(2500)
  const [projectType, setProjectType] = useState("renovation")
  const [buildingType, setBuildingType] = useState("ground-floor")
  const [timeline, setTimeline] = useState("standard")
  const [completionDate, setCompletionDate] = useState("")

  // Step 2: Room Configuration state
  const [activeRoomTab, setActiveRoomTab] = useState("operatory")
  const [rooms, setRooms] = useState({
    operatory: { count: 2, sqft: 150 },
    consultation: { count: 1, sqft: 120 },
    recovery: { count: 1, sqft: 100 },
    reception: { count: 1, sqft: 300 },
    office: { count: 1, sqft: 120 },
    sterilization: { count: 1, sqft: 80 },
    laboratory: { count: 0, sqft: 150 },
    xray: { count: 1, sqft: 60 },
    cbct: { count: 0, sqft: 80 },
    storage: { count: 1, sqft: 50 },
    break: { count: 1, sqft: 120 },
    restroom: { count: 2, sqft: 40 },
    mechanical: { count: 1, sqft: 100 },
    it: { count: 1, sqft: 30 },
    utility: { count: 1, sqft: 40 }
  })

  const [estimatedCost, setEstimatedCost] = useState(375000)

  // Room type definitions
  const roomTypes = {
    operatory: {
      name: "Operatory Rooms",
      description: "Primary surgical suites with medical gas, specialized lighting, and equipment prep",
      icon: "🏥",
      category: "clinical",
      minSqft: 120,
      maxSqft: 200,
      recommendedSqft: 150,
      costMultiplier: 2.5
    },
    consultation: {
      name: "Consultation Rooms",
      description: "Private patient consultation and examination rooms",
      icon: "👨‍⚕️",
      category: "clinical",
      minSqft: 80,
      maxSqft: 150,
      recommendedSqft: 120,
      costMultiplier: 1.8
    },
    recovery: {
      name: "Recovery Rooms",
      description: "Post-operative patient recovery and monitoring areas",
      icon: "🛏️",
      category: "clinical",
      minSqft: 80,
      maxSqft: 150,
      recommendedSqft: 100,
      costMultiplier: 2.0
    },
    reception: {
      name: "Reception/Waiting",
      description: "Patient waiting area, reception desk, and check-in/out",
      icon: "🪑",
      category: "public",
      minSqft: 200,
      maxSqft: 500,
      recommendedSqft: 300,
      costMultiplier: 1.2
    },
    office: {
      name: "Doctor Offices",
      description: "Private offices for consultations and administrative work",
      icon: "🏢",
      category: "administrative",
      minSqft: 100,
      maxSqft: 180,
      recommendedSqft: 120,
      costMultiplier: 1.5
    },
    sterilization: {
      name: "Sterilization",
      description: "Instrument cleaning, sterilization, and storage",
      icon: "🧼",
      category: "support",
      minSqft: 60,
      maxSqft: 120,
      recommendedSqft: 80,
      costMultiplier: 2.2
    },
    laboratory: {
      name: "Laboratory",
      description: "On-site lab for prosthetics and dental work",
      icon: "🔬",
      category: "support",
      minSqft: 100,
      maxSqft: 250,
      recommendedSqft: 150,
      costMultiplier: 2.8
    },
    xray: {
      name: "X-Ray Rooms",
      description: "Traditional radiography with lead-lined walls",
      icon: "📸",
      category: "imaging",
      minSqft: 50,
      maxSqft: 80,
      recommendedSqft: 60,
      costMultiplier: 3.0
    },
    cbct: {
      name: "CBCT/3D Imaging",
      description: "Cone beam CT and advanced 3D imaging suite",
      icon: "📡",
      category: "imaging",
      minSqft: 70,
      maxSqft: 120,
      recommendedSqft: 80,
      costMultiplier: 3.5
    },
    storage: {
      name: "Storage Rooms",
      description: "Supply storage, inventory, and equipment storage",
      icon: "📦",
      category: "support",
      minSqft: 30,
      maxSqft: 100,
      recommendedSqft: 50,
      costMultiplier: 0.8
    },
    break: {
      name: "Break Room",
      description: "Staff break room, kitchen, and lounge area",
      icon: "☕",
      category: "staff",
      minSqft: 80,
      maxSqft: 200,
      recommendedSqft: 120,
      costMultiplier: 1.0
    },
    restroom: {
      name: "Restrooms",
      description: "Patient and staff restrooms (ADA compliant)",
      icon: "🚽",
      category: "facilities",
      minSqft: 30,
      maxSqft: 60,
      recommendedSqft: 40,
      costMultiplier: 1.8
    },
    mechanical: {
      name: "Mechanical Room",
      description: "HVAC, water heater, electrical panel, and building systems",
      icon: "⚙️",
      category: "infrastructure",
      minSqft: 80,
      maxSqft: 150,
      recommendedSqft: 100,
      costMultiplier: 1.5
    },
    it: {
      name: "IT/Server Room",
      description: "Network equipment, servers, and telecommunications",
      icon: "💻",
      category: "infrastructure",
      minSqft: 20,
      maxSqft: 50,
      recommendedSqft: 30,
      costMultiplier: 2.0
    },
    utility: {
      name: "Utility/Janitorial",
      description: "Cleaning supplies, mop sink, and utility storage",
      icon: "🧽",
      category: "facilities",
      minSqft: 25,
      maxSqft: 60,
      recommendedSqft: 40,
      costMultiplier: 0.9
    }
  }

  const roomCategories = {
    clinical: { name: "Clinical Spaces", color: "text-blue-600" },
    imaging: { name: "Imaging & Diagnostics", color: "text-purple-600" },
    support: { name: "Support Spaces", color: "text-green-600" },
    administrative: { name: "Administrative", color: "text-orange-600" },
    public: { name: "Public Areas", color: "text-pink-600" },
    staff: { name: "Staff Areas", color: "text-indigo-600" },
    facilities: { name: "Facilities", color: "text-gray-600" },
    infrastructure: { name: "Infrastructure", color: "text-red-600" }
  }



  // Calculate total square footage from rooms
  const calculateTotalRoomSquareFootage = () => {
    return Object.entries(rooms).reduce((total, [_, room]) => {
      return total + (room.count * room.sqft)
    }, 0)
  }

  // Update room configuration
  const updateRoom = (roomType: string, field: 'count' | 'sqft', value: number) => {
    setRooms(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType as keyof typeof prev],
        [field]: value
      }
    }))
  }

  // Calculate room-specific costs
  const calculateRoomCosts = () => {
    const multiplier = stateCostMultipliers[state] || 1.0
    let baseCost = 150 // Base for renovation

    if (projectType === "new-construction") baseCost = 200
    if (projectType === "tenant-improvement") baseCost = 125

    return Object.entries(rooms).map(([roomType, room]) => {
      const roomConfig = roomTypes[roomType as keyof typeof roomTypes]
      const roomCost = room.count * room.sqft * baseCost * roomConfig.costMultiplier * multiplier
      return {
        roomType,
        config: roomConfig,
        count: room.count,
        sqft: room.sqft,
        totalSqft: room.count * room.sqft,
        cost: Math.round(roomCost)
      }
    }).filter(room => room.count > 0)
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Calculate cost whenever form data changes
  const calculateCost = () => {
    const multiplier = stateCostMultipliers[state] || 1.0
    let baseCost = 150 // Base for renovation

    if (projectType === "new-construction") baseCost = 200
    if (projectType === "tenant-improvement") baseCost = 125

    if (buildingType === "upper-floor") baseCost *= 1.15
    if (buildingType === "basement") baseCost *= 1.25

    if (timeline === "accelerated") baseCost *= 1.20
    if (timeline === "relaxed") baseCost *= 0.95

    baseCost *= multiplier
    return Math.round(squareFootage * baseCost)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  // Update cost when any form field changes
  const updateCost = () => {
    const newCost = calculateCost()
    setEstimatedCost(newCost)
  }

  const renderProjectBasics = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Project Basics
          </h3>
          <p className="text-gray-600 mb-6">
            Tell us about your oral surgery office project
          </p>

          {/* Cost Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                ${estimatedCost.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Estimated Project Cost • ${Math.round(estimatedCost / squareFootage).toLocaleString()}/sq ft
            </p>
            {state && (
              <Badge variant="outline" className="mt-2">
                {state} Multiplier: {stateCostMultipliers[state] || 1}x
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Modern Oral Surgery Center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                  </label>
                  <Select value={projectType} onValueChange={(value) => {
                    setProjectType(value)
                    setTimeout(updateCost, 0)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-construction">New Construction ($200/sq ft)</SelectItem>
                      <SelectItem value="renovation">Renovation ($150/sq ft)</SelectItem>
                      <SelectItem value="tenant-improvement">Tenant Improvement ($125/sq ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Building Type
                  </label>
                  <Select value={buildingType} onValueChange={(value) => {
                    setBuildingType(value)
                    setTimeout(updateCost, 0)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground-floor">Ground Floor (Standard)</SelectItem>
                      <SelectItem value="upper-floor">Upper Floor (+15%)</SelectItem>
                      <SelectItem value="basement">Basement (+25%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  <Select value={timeline} onValueChange={(value) => {
                    setTimeline(value)
                    setTimeout(updateCost, 0)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accelerated">Accelerated (+20%)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="relaxed">Relaxed (-5%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <Input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Location & Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Medical Center Dr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Select value={state} onValueChange={(value) => {
                      setState(value)
                      setTimeout(updateCost, 0)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {usStates.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st} {stateCostMultipliers[st] ? `(${stateCostMultipliers[st]}x)` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <Input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Footage
                  </label>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {squareFootage.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-600 ml-2">sq ft</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={squareFootage}
                      onChange={(e) => {
                        setSquareFootage(Number(e.target.value))
                        setTimeout(updateCost, 0)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>500 sq ft</span>
                      <span>10,000 sq ft</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderRoomConfiguration = () => {
    const totalRoomSqft = calculateTotalRoomSquareFootage()
    const roomCosts = calculateRoomCosts()
    const totalRoomCost = roomCosts.reduce((sum, room) => sum + room.cost, 0)

    const categoryTabs = Object.entries(roomCategories).filter(([categoryKey]) =>
      Object.values(roomTypes).some(room => room.category === categoryKey)
    )

    const currentCategoryRooms = Object.entries(roomTypes).filter(
      ([_, room]) => room.category === activeRoomTab
    )

    return (
      <div className="space-y-8">
        <div className="text-center">
          <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Room Configuration Builder
          </h3>
          <p className="text-gray-600 mb-6">
            Configure your oral surgery office layout and room requirements
          </p>

          {/* Room Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(rooms).reduce((sum, room) => sum + room.count, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Rooms</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalRoomSqft.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Total Sq Ft</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${totalRoomCost.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Room Cost</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {categoryTabs.map(([categoryKey, category]) => (
              <button
                key={categoryKey}
                onClick={() => setActiveRoomTab(categoryKey)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeRoomTab === categoryKey
                    ? `border-blue-500 ${category.color}`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Room Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentCategoryRooms.map(([roomKey, roomConfig]) => {
            const currentRoom = rooms[roomKey as keyof typeof rooms]
            const roomCost = roomCosts.find(r => r.roomType === roomKey)

            return (
              <Card key={roomKey} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{roomConfig.icon}</span>
                      <div>
                        <div className="text-lg">{roomConfig.name}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          {roomConfig.description}
                        </div>
                      </div>
                    </div>
                    {currentRoom.count > 0 && (
                      <Badge variant="secondary">
                        {currentRoom.count} room{currentRoom.count > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Room Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Rooms
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateRoom(roomKey, 'count', Math.max(0, currentRoom.count - 1))}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        disabled={currentRoom.count <= 0}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {currentRoom.count}
                      </span>
                      <button
                        onClick={() => updateRoom(roomKey, 'count', currentRoom.count + 1)}
                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 text-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Room Size */}
                  {currentRoom.count > 0 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size per Room (sq ft)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={roomConfig.minSqft}
                            max={roomConfig.maxSqft}
                            step="10"
                            value={currentRoom.sqft}
                            onChange={(e) => updateRoom(roomKey, 'sqft', Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{roomConfig.minSqft} sq ft</span>
                            <span className="font-semibold text-blue-600">
                              {currentRoom.sqft} sq ft
                            </span>
                            <span>{roomConfig.maxSqft} sq ft</span>
                          </div>
                          {currentRoom.sqft === roomConfig.recommendedSqft && (
                            <div className="text-xs text-green-600 text-center">
                              ✓ Recommended size
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Room Summary */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span>Total Square Footage:</span>
                          <span className="font-semibold">
                            {(currentRoom.count * currentRoom.sqft).toLocaleString()} sq ft
                          </span>
                        </div>
                        {roomCost && (
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span>Estimated Cost:</span>
                            <span className="font-semibold text-green-600">
                              ${roomCost.cost.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Cost Summary */}
        {roomCosts.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle>Room Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roomCosts.map((room) => (
                  <div key={room.roomType} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <span>{room.config.icon}</span>
                      <span className="font-medium">{room.config.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {room.count}x {room.sqft} sq ft
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${room.cost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{room.totalSqft} sq ft total</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-lg font-bold border-t-2 border-gray-300">
                  <span>Total Configuration:</span>
                  <div className="text-right">
                    <div className="text-green-600">${totalRoomCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 font-normal">{totalRoomSqft} sq ft</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "project-basics":
        return renderProjectBasics()
      case "room-configuration":
        return renderRoomConfiguration()
      default:
        return (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-8">
              {currentStepData.description}
            </p>
            <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
              <p className="text-blue-800">
                This step is ready for implementation.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Oral Surgeon Cost Estimator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Save Draft</Button>
              <Button variant="outline" size="sm">Load Template</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentStep
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      } cursor-pointer`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {step.title}
                            </span>
                            {step.isComplete && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {step.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            index === currentStep
                              ? "default"
                              : step.isComplete
                              ? "secondary"
                              : "outline"
                          }
                          className="ml-2 text-xs"
                        >
                          {index + 1}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {currentStepData.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {renderStepContent()}
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    {currentStep === steps.length - 1 ? (
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Generate Estimate
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
