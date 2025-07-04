import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';

interface MagneticsResults {
  primaryTurns: number;
  secondaryTurns: number;
  wireGaugePrimary: number;
  wireGaugeSecondary: number;
  fluxDensity: number;
  coreLoss: number;
  copperLoss: number;
  efficiency: number;
  temperature: number;
}

const MagneticsCalculator: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [componentType, setComponentType] = useState('transformer');
  const [coreMaterial, setCoreMaterial] = useState('ferrite');
  const [coreSize, setCoreSize] = useState('E3230');
  const [frequency, setFrequency] = useState(100000);
  const [primaryVoltage, setPrimaryVoltage] = useState(12);
  const [secondaryVoltage, setSecondaryVoltage] = useState(5);
  const [power, setPower] = useState(10);
  const [maxFluxDensity, setMaxFluxDensity] = useState(0.3);
  const [results, setResults] = useState<MagneticsResults | null>(null);

  const calculateMagnetics = () => {
    // Core parameters for different materials and sizes
    const coreParams: { [key: string]: { Ae: number; Aw: number; Al: number } } = {
      'E3230': { Ae: 160, Aw: 150, Al: 2500 }, // mm², mm², nH/turn²
      'E4728': { Ae: 240, Aw: 280, Al: 3200 },
      'E5542': { Ae: 350, Aw: 420, Al: 4100 },
    };

    const steinmetzParams: { [key: string]: { k: number; alpha: number; beta: number } } = {
      'ferrite': { k: 0.0012, alpha: 1.24, beta: 2.1 },
      'iron_powder': { k: 0.0035, alpha: 1.1, beta: 1.8 },
      'amorphous': { k: 0.0008, alpha: 1.3, beta: 2.3 },
      'nanocrystalline': { k: 0.0005, alpha: 1.4, beta: 2.0 },
    };

    const core = coreParams[coreSize] || coreParams['E3230'];
    const steinmetz = steinmetzParams[coreMaterial] || steinmetzParams['ferrite'];
    
    const f = frequency; // Hz
    const Vpri = primaryVoltage; // V
    const Vsec = secondaryVoltage; // V
    const P = power; // W
    const Bmax = maxFluxDensity; // T
    const Ae = core.Ae * 1e-6; // Convert mm² to m²

    // Calculate turns using Faraday's law: V = 4.44 * f * N * Bmax * Ae
    const primaryTurns = Math.round(Vpri / (4.44 * f * Bmax * Ae));
    const turnsRatio = Vsec / Vpri;
    const secondaryTurns = Math.round(primaryTurns * turnsRatio);

    // Calculate currents
    const primaryCurrent = P / Vpri;
    const secondaryCurrent = P / Vsec;

    // Wire gauge calculation (AWG) based on current density
    const currentDensity = 4; // A/mm² typical for transformers
    const wireAreaPrimary = primaryCurrent / currentDensity; // mm²
    const wireAreaSecondary = secondaryCurrent / currentDensity; // mm²

    // Convert wire area to AWG (simplified approximation)
    const wireGaugePrimary = Math.round(36 - 20 * Math.log10(Math.sqrt(wireAreaPrimary / 0.0507)));
    const wireGaugeSecondary = Math.round(36 - 20 * Math.log10(Math.sqrt(wireAreaSecondary / 0.0507)));

    // Core loss calculation using Steinmetz equation
    const fluxDensity = Vpri / (4.44 * f * primaryTurns * Ae);
    const coreLoss = steinmetz.k * Math.pow(f / 1000, steinmetz.alpha) * Math.pow(fluxDensity, steinmetz.beta) * (core.Ae * 20 / 1000); // Watts

    // Copper loss calculation (simplified)
    const resistivityCopper = 1.7e-8; // Ω⋅m
    const meanLengthTurn = 0.02; // 20mm typical
    const primaryResistance = resistivityCopper * meanLengthTurn * primaryTurns / (wireAreaPrimary * 1e-6);
    const secondaryResistance = resistivityCopper * meanLengthTurn * secondaryTurns / (wireAreaSecondary * 1e-6);
    const copperLoss = primaryCurrent * primaryCurrent * primaryResistance + 
                      secondaryCurrent * secondaryCurrent * secondaryResistance;

    // Efficiency and temperature
    const totalLoss = coreLoss + copperLoss;
    const efficiency = (P / (P + totalLoss)) * 100;
    const thermalResistance = 40; // °C/W typical for small transformers
    const ambientTemp = 25; // °C
    const temperature = ambientTemp + totalLoss * thermalResistance;

    setResults({
      primaryTurns,
      secondaryTurns,
      wireGaugePrimary: Math.max(wireGaugePrimary, 10), // Minimum AWG 10
      wireGaugeSecondary: Math.max(wireGaugeSecondary, 10),
      fluxDensity,
      coreLoss,
      copperLoss,
      efficiency,
      temperature,
    });
  };

  useEffect(() => {
    calculateMagnetics();
  }, [componentType, coreMaterial, coreSize, frequency, primaryVoltage, secondaryVoltage, power, maxFluxDensity]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setComponentType(newValue === 0 ? 'transformer' : 'inductor');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🧲 Magnetics Calculator
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Transformer Design" />
          <Tab label="Inductor Design" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Core Selection
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Core Material</InputLabel>
                  <Select
                    value={coreMaterial}
                    label="Core Material"
                    onChange={(e) => setCoreMaterial(e.target.value)}
                  >
                    <MenuItem value="ferrite">Ferrite</MenuItem>
                    <MenuItem value="iron_powder">Iron Powder</MenuItem>
                    <MenuItem value="amorphous">Amorphous</MenuItem>
                    <MenuItem value="nanocrystalline">Nanocrystalline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Core Size</InputLabel>
                  <Select
                    value={coreSize}
                    label="Core Size"
                    onChange={(e) => setCoreSize(e.target.value)}
                  >
                    <MenuItem value="E3230">E32/30</MenuItem>
                    <MenuItem value="E4728">E47/28</MenuItem>
                    <MenuItem value="E5542">E55/42</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Frequency (Hz)"
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Flux Density (T)"
                  type="number"
                  value={maxFluxDensity}
                  onChange={(e) => setMaxFluxDensity(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {componentType === 'transformer' ? 'Transformer Parameters' : 'Inductor Parameters'}
            </Typography>
            
            <Grid container spacing={2}>
              {componentType === 'transformer' ? (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Primary Voltage (V)"
                      type="number"
                      value={primaryVoltage}
                      onChange={(e) => setPrimaryVoltage(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Secondary Voltage (V)"
                      type="number"
                      value={secondaryVoltage}
                      onChange={(e) => setSecondaryVoltage(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Power Rating (W)"
                      type="number"
                      value={power}
                      onChange={(e) => setPower(Number(e.target.value))}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Inductance (µH)"
                      type="number"
                      value={100}
                      onChange={() => {}}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Current (A)"
                      type="number"
                      value={5}
                      onChange={() => {}}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {results && componentType === 'transformer' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Design Results
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Parameter</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                      <TableCell><strong>Unit</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Primary Turns</TableCell>
                      <TableCell>{results.primaryTurns}</TableCell>
                      <TableCell>turns</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Secondary Turns</TableCell>
                      <TableCell>{results.secondaryTurns}</TableCell>
                      <TableCell>turns</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Primary Wire Gauge</TableCell>
                      <TableCell>AWG {results.wireGaugePrimary}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Secondary Wire Gauge</TableCell>
                      <TableCell>AWG {results.wireGaugeSecondary}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Actual Flux Density</TableCell>
                      <TableCell>{results.fluxDensity.toFixed(3)}</TableCell>
                      <TableCell>T</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Turns Ratio</TableCell>
                      <TableCell>{(results.primaryTurns / results.secondaryTurns).toFixed(2)}:1</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {results && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loss Analysis
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Core Loss</strong></TableCell>
                      <TableCell>{results.coreLoss.toFixed(3)}</TableCell>
                      <TableCell>W</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Copper Loss</strong></TableCell>
                      <TableCell>{results.copperLoss.toFixed(3)}</TableCell>
                      <TableCell>W</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total Loss</strong></TableCell>
                      <TableCell>{(results.coreLoss + results.copperLoss).toFixed(3)}</TableCell>
                      <TableCell>W</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Efficiency</strong></TableCell>
                      <TableCell>{results.efficiency.toFixed(1)}</TableCell>
                      <TableCell>%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Operating Temperature</strong></TableCell>
                      <TableCell>{results.temperature.toFixed(1)}</TableCell>
                      <TableCell>°C</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Saturation Margin</strong></TableCell>
                      <TableCell>{((maxFluxDensity - results.fluxDensity) / maxFluxDensity * 100).toFixed(1)}</TableCell>
                      <TableCell>%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <strong>Design Considerations:</strong> Ensure adequate core saturation margin (&gt;20%). 
        Monitor operating temperature (&lt;100°C for most applications). 
        Consider skin effect at high frequencies (&gt;100kHz). Use Litz wire for better efficiency at high frequencies.
      </Alert>
    </Box>
  );
};

export default MagneticsCalculator;