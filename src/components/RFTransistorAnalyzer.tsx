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
} from '@mui/material';

interface TransistorResults {
  stabilityFactor: number;
  maxAvailableGain: number;
  inputImpedance: { real: number; imag: number };
  outputImpedance: { real: number; imag: number };
  powerGain: number;
  thermalResistance: number;
  junctionTemp: number;
}

const RFTransistorAnalyzer: React.FC = () => {
  const [deviceType, setDeviceType] = useState('BJT');
  const [frequency, setFrequency] = useState(1000);
  const [s11Real, setS11Real] = useState(0.5);
  const [s11Imag, setS11Imag] = useState(-0.3);
  const [s21Real, setS21Real] = useState(3.0);
  const [s21Imag, setS21Imag] = useState(1.5);
  const [s12Real, setS12Real] = useState(0.05);
  const [s12Imag, setS12Imag] = useState(0.02);
  const [s22Real, setS22Real] = useState(0.4);
  const [s22Imag, setS22Imag] = useState(-0.6);
  const [powerDissipation, setPowerDissipation] = useState(1.0);
  const [results, setResults] = useState<TransistorResults | null>(null);

  const calculateTransistorParameters = () => {
    // S-parameter matrix
    const s11 = { real: s11Real, imag: s11Imag };
    const s21 = { real: s21Real, imag: s21Imag };
    const s12 = { real: s12Real, imag: s12Imag };
    const s22 = { real: s22Real, imag: s22Imag };

    // Calculate magnitudes
    const s11Mag = Math.sqrt(s11.real * s11.real + s11.imag * s11.imag);
    const s21Mag = Math.sqrt(s21.real * s21.real + s21.imag * s21.imag);
    const s12Mag = Math.sqrt(s12.real * s12.real + s12.imag * s12.imag);
    const s22Mag = Math.sqrt(s22.real * s22.real + s22.imag * s22.imag);

    // Calculate determinant of S-matrix
    const detS = {
      real: s11.real * s22.real - s11.imag * s22.imag - s12.real * s21.real + s12.imag * s21.imag,
      imag: s11.real * s22.imag + s11.imag * s22.real - s12.real * s21.imag - s12.imag * s21.real
    };
    const detSMag = Math.sqrt(detS.real * detS.real + detS.imag * detS.imag);

    // Stability factor (K-factor)
    const stabilityFactor = (1 - s11Mag * s11Mag - s22Mag * s22Mag + detSMag * detSMag) / 
                           (2 * s12Mag * s21Mag);

    // Maximum Available Gain (MAG) or Maximum Stable Gain (MSG)
    const maxAvailableGain = stabilityFactor > 1 ? 
      s21Mag / s12Mag * (stabilityFactor - Math.sqrt(stabilityFactor * stabilityFactor - 1)) :
      s21Mag / s12Mag; // MSG when unstable

    // Input and Output Impedances (50Ω reference)
    const z0 = 50; // Reference impedance
    const inputImpedance = {
      real: z0 * (1 - s11Mag * s11Mag) / Math.pow(1 - s11.real, 2) + Math.pow(s11.imag, 2),
      imag: z0 * (-2 * s11.imag) / Math.pow(1 - s11.real, 2) + Math.pow(s11.imag, 2)
    };

    const outputImpedance = {
      real: z0 * (1 - s22Mag * s22Mag) / Math.pow(1 - s22.real, 2) + Math.pow(s22.imag, 2),
      imag: z0 * (-2 * s22.imag) / Math.pow(1 - s22.real, 2) + Math.pow(s22.imag, 2)
    };

    // Power gain in dB
    const powerGain = 20 * Math.log10(s21Mag);

    // Thermal calculations
    const thermalResistance = deviceType === 'BJT' ? 150 : 
                             deviceType === 'FET' ? 200 :
                             deviceType === 'HEMT' ? 300 : 100; // °C/W

    const ambientTemp = 25; // °C
    const junctionTemp = ambientTemp + powerDissipation * thermalResistance;

    setResults({
      stabilityFactor,
      maxAvailableGain: 20 * Math.log10(maxAvailableGain), // Convert to dB
      inputImpedance,
      outputImpedance,
      powerGain,
      thermalResistance,
      junctionTemp,
    });
  };

  useEffect(() => {
    calculateTransistorParameters();
  }, [deviceType, frequency, s11Real, s11Imag, s21Real, s21Imag, s12Real, s12Imag, s22Real, s22Imag, powerDissipation]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📡 RF Power Transistor Analyzer
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Parameters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={deviceType}
                    label="Device Type"
                    onChange={(e) => setDeviceType(e.target.value)}
                  >
                    <MenuItem value="BJT">BJT</MenuItem>
                    <MenuItem value="FET">FET/MOSFET</MenuItem>
                    <MenuItem value="HEMT">HEMT</MenuItem>
                    <MenuItem value="LDMOS">LDMOS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Frequency (MHz)"
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Power Dissipation (W)"
                  type="number"
                  value={powerDissipation}
                  onChange={(e) => setPowerDissipation(Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              S-Parameters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S11 Real"
                  type="number"
                  value={s11Real}
                  onChange={(e) => setS11Real(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S11 Imag"
                  type="number"
                  value={s11Imag}
                  onChange={(e) => setS11Imag(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S21 Real"
                  type="number"
                  value={s21Real}
                  onChange={(e) => setS21Real(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S21 Imag"
                  type="number"
                  value={s21Imag}
                  onChange={(e) => setS21Imag(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S12 Real"
                  type="number"
                  value={s12Real}
                  onChange={(e) => setS12Real(Number(e.target.value))}
                  inputProps={{ step: 0.001 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S12 Imag"
                  type="number"
                  value={s12Imag}
                  onChange={(e) => setS12Imag(Number(e.target.value))}
                  inputProps={{ step: 0.001 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S22 Real"
                  type="number"
                  value={s22Real}
                  onChange={(e) => setS22Real(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="S22 Imag"
                  type="number"
                  value={s22Imag}
                  onChange={(e) => setS22Imag(Number(e.target.value))}
                  inputProps={{ step: 0.01 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {results && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analysis Results
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
                      <TableCell>Stability Factor (K)</TableCell>
                      <TableCell>{results.stabilityFactor.toFixed(3)}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Max Available Gain</TableCell>
                      <TableCell>{results.maxAvailableGain.toFixed(1)}</TableCell>
                      <TableCell>dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Power Gain (|S21|²)</TableCell>
                      <TableCell>{results.powerGain.toFixed(1)}</TableCell>
                      <TableCell>dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Input Impedance (Real)</TableCell>
                      <TableCell>{results.inputImpedance.real.toFixed(1)}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Input Impedance (Imag)</TableCell>
                      <TableCell>{results.inputImpedance.imag.toFixed(1)}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Output Impedance (Real)</TableCell>
                      <TableCell>{results.outputImpedance.real.toFixed(1)}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Output Impedance (Imag)</TableCell>
                      <TableCell>{results.outputImpedance.imag.toFixed(1)}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {results && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thermal Analysis
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Thermal Resistance</strong></TableCell>
                      <TableCell>{results.thermalResistance}</TableCell>
                      <TableCell>°C/W</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Junction Temperature</strong></TableCell>
                      <TableCell>{results.junctionTemp.toFixed(1)}</TableCell>
                      <TableCell>°C</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Stability Status</strong></TableCell>
                      <TableCell>
                        {results.stabilityFactor > 1 ? 'Unconditionally Stable' : 'Potentially Unstable'}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <strong>Important:</strong> Ensure proper heat sinking if junction temperature exceeds 150°C. 
        For K-factor &lt; 1, additional stability analysis and compensation networks may be required.
      </Alert>
    </Box>
  );
};

export default RFTransistorAnalyzer;