# 🔬 RF Design Studio

A professional React-based web application for RF and power electronics design calculations. This comprehensive tool provides industry-standard calculators for power supply design, RF transistor analysis, coupler design, and magnetics calculations.

## 🚀 Features

### 🔌 Power Supply Design Calculator
- **Multiple Topologies**: Buck, Boost, Flyback, Forward converters
- **Component Calculations**: Inductors, capacitors, feedback resistors, current sense resistors
- **Performance Analysis**: Efficiency calculations, ripple analysis, switching/conduction losses
- **Interactive Schematics**: ASCII art circuit diagrams with calculated component values
- **LTspice Integration**: Auto-generated SPICE netlists for direct simulation
- **Real-time Updates**: Instant recalculation as parameters change
- **Professional Validation**: Engineering warnings and design notes

### 📡 RF Power Transistor Analyzer
- **S-Parameter Analysis**: Stability factor (K-factor), gain analysis, input/output impedance
- **Device Support**: BJT, FET/MOSFET, HEMT, LDMOS transistors
- **Thermal Analysis**: Power dissipation, junction temperature calculations
- **Interactive Schematics**: RF amplifier circuits with S-parameter annotations
- **SPICE Models**: Complete RF amplifier netlists with device models
- **Complex Mathematics**: S-parameter matrix operations, complex impedance conversions
- **Stability Assessment**: Unconditional/conditional stability analysis

### 🔀 RF Coupler & Power Divider Designer
- **Multiple Types**: Directional couplers, Rat-race hybrids, Wilkinson dividers, Branch-line hybrids
- **Physical Dimensions**: Strip width, gap calculations, electrical length
- **Performance Specs**: Coupling, isolation, return loss, VSWR, bandwidth
- **Visual Layouts**: ASCII schematics showing physical coupler structures
- **Transmission Line Models**: SPICE netlists with coupled transmission lines
- **Substrate Support**: FR4, Rogers, Alumina, PTFE, Duroid materials
- **Manufacturing Guidelines**: PCB fabrication considerations and tolerances

### 🧲 Magnetics Calculator
- **Transformer Design**: Primary/secondary turns, wire gauge, turns ratio
- **Inductor Design**: Core selection, wire specifications
- **Core Materials**: Ferrite, Iron Powder, Amorphous, Nanocrystalline
- **Visual Schematics**: Transformer/inductor diagrams with calculated parameters
- **SPICE Integration**: Coupled inductor models with core characteristics
- **Loss Analysis**: Steinmetz equation for core loss, copper loss calculations
- **Thermal Analysis**: Operating temperature, efficiency calculations
- **Design Validation**: Saturation margin, safety factors

## ✨ Enhanced Features (New!)

### 📐 Interactive Schematics
- **ASCII Art Diagrams**: Professional circuit schematics for every calculator
- **Real-time Component Values**: Calculated values displayed directly on circuits
- **Tabbed Interface**: Switch between Calculator and Schematic views
- **Performance Annotations**: Key metrics overlaid on circuit diagrams

### � LTspice Integration
- **One-Click SPICE Export**: Generate complete netlists with calculated values
- **Ready-to-Simulate**: Files open directly in LTspice for immediate analysis
- **Professional Quality**: Industry-standard models and documentation
- **Topology-Specific**: Optimized SPICE models for each circuit type

### 📊 Design Workflow
1. **Calculate** → Enter parameters and review component values
2. **Visualize** → Switch to schematic tab to see circuit diagram  
3. **Simulate** → Export SPICE file for LTspice verification
4. **Iterate** → Modify parameters and instantly update schematics

## �🛠 Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for better code quality
- **Material-UI v5**: Professional UI components and design system
- **Math.js**: Advanced mathematical calculations and complex numbers
- **ASCII Art Engine**: Professional schematic generation
- **SPICE Generation**: Automated netlist creation for LTspice
- **Responsive Design**: Mobile-friendly interface for all devices

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone https://github.com/htankaria17/RF_POWER_DESIGN
cd RF_POWER_DESIGN

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 🎯 Usage

### Power Supply Calculator
1. Select topology (Buck, Boost, Flyback, Forward)
2. Enter input/output voltages and current requirements
3. Set switching frequency and ripple specifications
4. Review calculated component values and performance metrics

### RF Transistor Analyzer
1. Choose device type (BJT, FET, HEMT, LDMOS)
2. Enter frequency and S-parameters (real and imaginary parts)
3. Specify power dissipation for thermal analysis
4. Analyze stability, gain, and impedance characteristics

### Coupler Designer
1. Select coupler type (Directional, Rat-race, Wilkinson, Branch-line)
2. Set frequency, impedance, and coupling requirements
3. Choose substrate material and thickness
4. Review physical dimensions and performance specifications

### Magnetics Calculator
1. Choose between transformer or inductor design
2. Select core material and size
3. Enter electrical specifications (voltage, power, frequency)
4. Review turns calculation, wire gauge, and loss analysis

## 📐 Engineering Formulas

### Power Supply Design
- **Inductor**: `L = (Vin - Vout) × D / (ΔIL × fs)` (Buck)
- **Duty Cycle**: `D = Vout / Vin` (Buck), `D = 1 - Vin/Vout` (Boost)
- **Output Capacitor**: `C = ΔIL / (8 × fs × ΔVo)`
- **Efficiency**: `η = Pout / (Pout + Ploss)`

### RF Analysis
- **Stability Factor**: `K = (1 - |S11|² - |S22|² + |ΔS|²) / (2|S12||S21|)`
- **Maximum Available Gain**: `MAG = |S21|/|S12| × (K - √(K² - 1))`
- **Input Impedance**: Complex calculation based on S-parameters

### Magnetics
- **Faraday's Law**: `V = 4.44 × f × N × Bmax × Ae`
- **Steinmetz Equation**: `Pcore = k × f^α × B^β × Volume`
- **Copper Loss**: `Pcu = I²R` (AC resistance with skin effect)

## 🔧 Development

### Available Scripts
- `npm start`: Run development server
- `npm build`: Create production build
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App (not recommended)

### Project Structure
```
src/
├── components/
│   ├── PowerSupplyCalculator.tsx
│   ├── RFTransistorAnalyzer.tsx
│   ├── CouplerDesigner.tsx
│   └── MagneticsCalculator.tsx
├── App.tsx
└── index.tsx
```

## 📋 Requirements

- Modern web browser with JavaScript enabled
- Minimum screen resolution: 1024x768 (responsive design adapts to smaller screens)
- No additional plugins or extensions required

## 🎨 Features

- **Professional UI**: Clean, intuitive interface with Material Design
- **Real-time Calculations**: Instant updates as parameters change
- **Comprehensive Results**: Detailed tables with proper engineering units
- **Input Validation**: Error checking and engineering warnings
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Export Ready**: Results can be copied for documentation

## 📚 Technical Notes

- All calculations use industry-standard formulas
- Component values include safety margins and practical considerations
- Thermal analysis includes junction temperature calculations
- Manufacturing tolerances are considered in design guidelines
- Complex number mathematics for RF calculations

## 🚨 Important Disclaimers

- **Design Verification**: Always verify calculations with simulation before prototyping
- **Safety Margins**: Consider component tolerances and temperature coefficients
- **Professional Review**: Have designs reviewed by qualified engineers
- **Simulation Required**: Use SPICE/EM simulation for final verification
- **Manufacturing**: Account for PCB fabrication tolerances

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For questions or support, please open an issue on the GitHub repository.

---

**RF Design Studio v1.0** - Professional RF & Power Electronics Design Tools