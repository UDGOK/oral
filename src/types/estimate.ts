export interface ProjectBasics {
  projectName: string
  location: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  totalSquareFootage: number
  desiredCompletionDate: string
  projectTimeline: 'standard' | 'accelerated' | 'relaxed'
  projectType: 'new-construction' | 'renovation' | 'tenant-improvement'
  buildingType: 'ground-floor' | 'upper-floor' | 'basement'
}

export interface RoomConfiguration {
  // Treatment/Clinical Rooms
  treatmentRooms: {
    count: number // 1-20 rooms
    size: 'compact' | 'standard' | 'large' | 'premium'
    hasWindows: boolean
    ceilingHeight: number
    specialFeatures: string[]
  }
  consultationRooms: {
    count: number // 0-10 rooms
    size: 'small' | 'medium' | 'large'
    hasWindows: boolean
  }
  recoveryRooms: {
    count: number // 0-5 rooms
    beds: number
    privateRooms: number
    sharedRooms: number
  }
  labSpaces: {
    count: number // 0-3 rooms
    hasLab: boolean
    size: number
    equipmentLevel: 'basic' | 'advanced' | 'full-service'
    hasCADCAM: boolean
    has3DPrinter: boolean
  }

  // Required Areas
  sterilizationAreas: {
    centralSterile: {
      size: number
      equipmentLevel: 'basic' | 'advanced' | 'comprehensive'
    }
    dirtyUtility: {
      size: number
      required: boolean
    }
    cleanUtility: {
      size: number
      required: boolean
    }
  }

  // Administrative Areas
  administrativeAreas: {
    reception: {
      hasReception: boolean
      size: number
      workstations: number
    }
    privateOffices: {
      count: number
      executiveOffice: boolean
      managerOffices: number
    }
    openWorkArea: {
      hasOpenArea: boolean
      workstations: number
      size: number
    }
    conferenceRoom: {
      hasConferenceRoom: boolean
      capacity: number
    }
    recordsRoom: {
      hasRecordsRoom: boolean
      size: number
      fireRated: boolean
    }
  }

  // Staff Areas
  breakRoomStaffAreas: {
    breakRoom: {
      hasBreakRoom: boolean
      size: number
      hasKitchen: boolean
    }
    lockers: {
      hasLockers: boolean
      count: number
    }
    staffLounge: {
      hasLounge: boolean
      size: number
    }
  }

  // Storage/Utility Rooms
  storageUtilityRooms: {
    generalStorage: {
      count: number
      totalSize: number
    }
    medicalSupplyStorage: {
      size: number
      temperatureControlled: boolean
      securityLevel: 'standard' | 'high'
    }
    equipmentStorage: {
      size: number
      hasCharging: boolean
    }
    janitorialClosets: {
      count: number
      hasUtilitySink: boolean
    }
    mechanicalRooms: {
      hvacRoom: boolean
      electricalRoom: boolean
      dataCloset: boolean
      medicalGasManifold: boolean
    }
  }

  // Patient Areas
  waitingArea: {
    mainWaiting: {
      size: number
      seatingCapacity: number
      hasReception: boolean
    }
    childrenArea: {
      hasChildrenArea: boolean
      size: number
    }
    privateWaiting: {
      hasPrivateWaiting: boolean
      rooms: number
    }
    consultationWaiting: {
      hasConsultWaiting: boolean
      seatingCapacity: number
    }
  }

  // Restrooms
  restrooms: {
    patientRestrooms: {
      count: number
      adaCompliant: boolean
      familyRestroom: boolean
    }
    staffRestrooms: {
      count: number
      adaCompliant: boolean
    }
  }

  // Special Rooms
  specialRooms: {
    xrayRooms: {
      count: number
      leadLined: boolean
      digitalEquipment: boolean
    }
    surgicalSuites: {
      count: number
      size: 'standard' | 'large'
      isolationCapable: boolean
    }
    panRoom: {
      hasPanRoom: boolean
      leadLined: boolean
    }
    cbctRoom: {
      hasCBCT: boolean
      leadLined: boolean
      size: number
    }
  }
}

export interface MedicalGasRequirements {
  nitrousOxide: {
    required: boolean
    outlets: Array<{
      room: string
      count: number
      location: string
    }>
    centralSupply: boolean
    scavengingSystem: boolean
    manifoldLocation: string
    emergencyShutoffs: number
  }
  oxygen: {
    required: boolean
    outlets: Array<{
      room: string
      count: number
      location: string
    }>
    centralSupply: boolean
    backupSystem: boolean
    manifoldLocation: string
    emergencyShutoffs: number
  }
  medicalAir: {
    required: boolean
    outlets: Array<{
      room: string
      count: number
      location: string
    }>
    oilFree: boolean
    backupCompressor: boolean
    manifoldLocation: string
  }
  vacuumSystem: {
    required: boolean
    outlets: Array<{
      room: string
      count: number
      location: string
    }>
    centralSystem: boolean
    backupPump: boolean
    manifoldLocation: string
  }
}

export interface EquipmentIntegration {
  dentalChairs: {
    count: number
    type: 'basic' | 'mid-range' | 'premium'
    manufacturer: string
    integratedDelivery: boolean
  }
  xrayUnits: {
    intraoral: {
      count: number
      digital: boolean
    }
    panoramic: {
      count: number
      digital: boolean
    }
    cephalometric: {
      count: number
    }
  }
  cbct: {
    hasUnit: boolean
    model?: string
    shieldingRequired?: boolean
  }
  sterilizationEquipment: {
    autoclaves: {
      count: number
      size: 'small' | 'medium' | 'large'
    }
    ultrasonicCleaners: number
    sealers: number
  }
  surgicalEquipment: {
    surgicalLights: number
    monitors: number
    anesthesiaMachines: number
    surgicalTables: number
  }
  labEquipment: {
    models3dPrinter: boolean
    scanners: number
    millingMachine: boolean
  }
}

export interface FinishLevel {
  category: 'standard' | 'premium' | 'luxury' | 'custom'
  flooring: {
    operatories: string
    waitingArea: string
    offices: string
    corridors: string
  }
  wallFinishes: {
    paintGrade: 'standard' | 'premium'
    wallcovering: boolean
    wainscoting: boolean
    specialFinishes: string[]
  }
  ceilings: {
    type: 'standard-acm' | 'premium-acm' | 'gypsum' | 'specialty'
    height: number
    specialFeatures: string[]
  }
  cabinetry: {
    material: 'laminate' | 'wood-veneer' | 'solid-wood' | 'metal'
    style: 'traditional' | 'modern' | 'contemporary'
    customMillwork: boolean
  }
  countertops: {
    material: 'laminate' | 'solid-surface' | 'quartz' | 'granite'
    edgeProfile: string
  }
  lighting: {
    level: 'standard' | 'premium' | 'architectural'
    controlSystems: boolean
    emergencyLighting: boolean
  }
}

export interface AdaCompliance {
  accessibleEntrance: boolean
  accessiblePath: boolean
  accessibleRestrooms: number
  hearingLoopSystem: boolean
  accessibleParkingSpaces: number
  elevatorRequired: boolean
  accessibleReceptionCounter: boolean
  doorHardware: 'standard' | 'accessible'
  signageCompliance: boolean
}

export interface ItDataAvNeeds {
  networkDrops: Array<{
    room: string
    count: number
    type: 'cat6' | 'cat6a' | 'fiber'
  }>
  wifiAccess: {
    commercial: boolean
    guestNetwork: boolean
    coverage: 'basic' | 'enterprise'
  }
  phoneSystem: {
    type: 'voip' | 'traditional'
    extensions: number
    nurseCalls: boolean
  }
  securitySystem: {
    cameras: number
    accessControl: boolean
    alarmSystem: boolean
  }
  audiovisual: {
    tvs: Array<{
      room: string
      size: number
      mounting: 'wall' | 'ceiling'
    }>
    soundSystem: boolean
    intercom: boolean
  }
  serverRoom: {
    required: boolean
    size?: number
    cooling?: boolean
  }
}

// Paradigm Project Cost Database
export interface ParadigmCostData {
  sitePrep: 2.41
  demolition: 7.29
  framingDrywallInsulation: 29.08
  hvac: 24.31
  electrical: 75.20
  plumbing: 62.92
  millworkSurfaces: 41.67
  flooringDoors: 17.39
  paint: 4.67
}

export interface CostBreakdown {
  sitePrep: number
  demolition: number
  framingDrywallInsulation: number
  hvac: number
  electrical: number
  plumbing: number
  millworkSurfaces: number
  flooringDoors: number
  paint: number
  medicalGas: number
  specialEquipment: number
  permits: number
  generalConditions: number
  overhead: number
  profit: number
  contingency: number
  total: number
}

export interface EstimateData {
  id?: string
  projectBasics: ProjectBasics
  roomConfiguration: RoomConfiguration
  medicalGasRequirements: MedicalGasRequirements
  equipmentIntegration: EquipmentIntegration
  finishLevel: FinishLevel
  adaCompliance: AdaCompliance
  itDataAvNeeds: ItDataAvNeeds
  costBreakdown?: CostBreakdown
  createdAt?: string
  updatedAt?: string
  status: 'draft' | 'completed' | 'archived'
}

export interface EstimateFormStep {
  id: string
  title: string
  description: string
  isComplete: boolean
  isValid: boolean
}
