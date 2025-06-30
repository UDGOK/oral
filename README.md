# 🦷 Oral Surgeon Office Cost Estimator

A comprehensive, AI-powered construction cost estimation application specifically designed for oral surgery practices. Built with Next.js 15, TypeScript, and shadcn/ui.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Features

### ✅ **Step 1: Project Basics**
- **Dynamic Cost Estimation**: Real-time cost calculation with regional multipliers
- **Interactive Square Footage Slider**: 500-10,000 sq ft range with live updates
- **Project Configuration**: New construction, renovation, tenant improvement options
- **Timeline Management**: Accelerated, standard, and relaxed timelines with cost impact
- **State-Based Regional Pricing**: Accurate cost multipliers for all 50 US states

### ✅ **Step 2: Room Configuration Builder**
- **15 Room Types** across 8 categories:
  - **Clinical**: Operatory, Consultation, Recovery, X-ray, CBCT
  - **Administrative**: Reception/Waiting, Doctor Offices
  - **Support**: Sterilization, Laboratory, Storage
  - **Staff**: Break Room
  - **Facilities**: Restrooms, Utility/Janitorial
  - **Infrastructure**: Mechanical Room, IT/Server Room
- **Professional Tabbed Interface**: Easy navigation between room categories
- **Dynamic Room Management**: Interactive +/- controls for room quantities
- **Custom Square Footage**: Adjustable size per room with min/max/recommended values
- **Real-time Cost Calculation**: Room-specific cost multipliers and instant updates

### ✅ **Step 3: Medical Gas Systems**
- **Four Complete Gas Systems**:
  - **Oxygen (💨)**: Outlets, central manifold, alarm system (NFPA 99 compliant)
  - **Nitrous Oxide (😴)**: Scavenging system, emergency shutoff (NIOSH standards)
  - **Medical Air (🌪️)**: Compressor system, backup compressor capability
  - **Vacuum (🌪️)**: Central vacuum, wet vacuum for surgical procedures
- **🚀 INTELLIGENT AUTO-POPULATION**: Automatically calculates gas outlets based on room configuration
- **Compliance Requirements**: Built-in NFPA 99, OSHA, NIOSH, USP compliance checking
- **Advanced Cost Calculation**: Per-outlet costs + system installation costs

### ✅ **Step 4: Equipment Integration**
- **Comprehensive Equipment Categories**:
  - **Dental Chairs (🪑)**: A-dec, Sirona, KaVo options with gas/electrical requirements
  - **X-Ray Equipment (📸)**: Intraoral, panoramic, cephalometric units
  - **CBCT Scanners (📡)**: Small, large, and full head FOV 3D imaging systems
  - **Surgical Equipment (🔧)**: Piezosurgery, surgical motors, microscopes
  - **Support Equipment (⚙️)**: Autoclaves, ultrasonic cleaners, cabinetry
- **Smart Integration**: Equipment shows required gas connections and electrical needs
- **Real-time Cost Updates**: Add/remove equipment with instant cost calculation

## 🚀 **Advanced Features**

### **Real-Time Cost Calculation Engine**
- Multi-factor pricing: Rooms + Gas Systems + Equipment + Regional multipliers
- Live updates: Cost changes instantly as configurations are modified
- Comprehensive breakdown: Detailed cost analysis by category
- State-based adjustments: Accurate regional cost variations

### **Intelligent Auto-Population System**
- Smart gas calculation: Automatically determines outlets needed based on room types
- Medical standards compliance: Built-in knowledge of surgical room requirements
- One-click population: "Auto-Populate from Room Configuration" button
- Override capability: Manual adjustments still possible after auto-population

### **Professional User Experience**
- Clean medical industry design: Professional, clinical appearance
- Intuitive navigation: Multi-step form with progress tracking
- Responsive layout: Works on desktop and tablet devices
- Smart validation: Step-by-step validation with clear guidance

## 🛠 **Technology Stack**

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Radix UI primitives
- **Package Manager**: Bun
- **Linting**: Biome
- **State Management**: React useState hooks

## 📦 **Installation**

```bash
# Clone the repository
git clone https://github.com/UDGOK/oral.git
cd oral

# Install dependencies with Bun
bun install

# Start development server
bun run dev
```

## 🏗 **Build & Deploy**

```bash
# Build for production
bun run build

# Start production server
bun run start

# Static export for deployment
bun run build
# Files will be in ./out directory
```

## 📊 **Project Statistics**

- **15 Room Types** with individual configuration
- **4 Medical Gas Systems** with compliance requirements
- **25+ Equipment Items** across 5 categories
- **50-State Regional Pricing** with accurate multipliers
- **Real-Time Cost Updates** across all 1000+ configuration options
- **Professional UI** with 20+ shadcn/ui components

## 🎯 **Target Users**

- **Oral Surgery Practices**: Planning new office construction or renovation
- **Dental Professionals**: Expanding practices with surgical capabilities
- **Healthcare Architects**: Designing specialized medical facilities
- **General Contractors**: Estimating costs for medical office projects
- **Healthcare Real Estate**: Evaluating construction costs for leasing decisions

## 📈 **Future Enhancements**

- [ ] **Steps 5-8**: Finishes, ADA Compliance, IT/Data/AV, Review & Export
- [ ] **PDF Report Generation**: Professional project estimates
- [ ] **User Authentication**: Save and manage multiple projects
- [ ] **AI-Powered Cost Prediction**: Advanced cost forecasting
- [ ] **Integration**: Real construction cost databases
- [ ] **Mobile Application**: Native iOS/Android apps

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Built with [Same](https://same.new) - AI-powered development platform
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 **Support**

For support, feature requests, or questions:
- Create an issue in this repository
- Contact: [Your contact information]

---

**🏥 Ready for professional use by oral surgery practices nationwide! 🚀**
