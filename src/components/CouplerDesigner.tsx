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

interface CouplerResults {
  stripWidth: number;
  stripGap: number;
  electricalLength: number;
  couplingValue: number;
  isolation: number;
  returnLoss: number;
  vswr: number;
  bandwidth: number;
}

const CouplerDesigner: React.FC = () => {
  const [couplerType, setCouplerType] = useState('directional');
  const [coupling, setCoupling] = useState(-20);
  const [frequency, setFrequency] = useState(1000);
  const [impedance, setImpedance] = useState(50);
  const [substrate, setSubstrate] = useState('FR4');
  const [substrateHeight, setSubstrateHeight] = useState(1.6);
  const [results, setResults] = useState<CouplerResults | null>(null);

  const calculateCoupler = () => {
    // Dielectric constants for common substrates
    const dielectricConstants: { [key: string]: number } = {
      'FR4': 4.5,
      'Rogers4003': 3.55,
      'Alumina': 9.8,
      'PTFE': 2.1,
      'Duroid5880': 2.2
    };

    const er = dielectricConstants[substrate] || 4.5;
    const h = substrateHeight; // mm
    const c = 299792458; // m/s
    const f = frequency * 1e6; // Convert MHz to Hz
    const Z0 = impedance;

    // Effective dielectric constant
    const erEff = (er + 1) / 2 + (er - 1) / 2 * Math.pow(1 + 12 * h / 1, -0.5);

    // Wavelength in the medium
    const lambdaG = c / (f * Math.sqrt(erEff));

    // Calculate dimensions based on coupler type
    let stripWidth = 0;
    let stripGap = 0;
    let electricalLength = 0;
    let couplingValue = coupling;
    let isolation = 0;
    let returnLoss = 0;
    let vswr = 0;
    let bandwidth = 0;

    switch (couplerType) {
      case 'directional':
        // Directional coupler design
        stripWidth = h * (8 * Math.exp(Z0 * Math.sqrt(erEff + 1.41) / 87) / (Math.exp(Z0 * Math.sqrt(erEff + 1.41) / 87) + 2));
        stripGap = 0.2 + Math.abs(coupling) / 40; // Simplified gap calculation
        electricalLength = 90; // Quarter wavelength
        isolation = Math.abs(coupling) + 20; // Typical isolation
        returnLoss = 25;
        vswr = 1.2;
        bandwidth = 30; // Percentage
        break;

      case 'rat-race':
        // Rat-race hybrid
        stripWidth = h * 2.5; // Typical for rat-race
        stripGap = 0; // No gap in rat-race
        electricalLength = 270; // 3λ/4 for rat-race
        couplingValue = -3; // 3dB split
        isolation = 20;
        returnLoss = 20;
        vswr = 1.3;
        bandwidth = 25;
        break;

      case 'wilkinson':
        // Wilkinson power divider
        stripWidth = h * 1.8; // For 70.7Ω line
        stripGap = 0; // No gap
        electricalLength = 90; // Quarter wavelength
        couplingValue = -3; // 3dB split
        isolation = 25;
        returnLoss = 30;
        vswr = 1.1;
        bandwidth = 40;
        break;

      case 'branch-line':
        // Branch-line hybrid
        stripWidth = h * 2.2; // Mixed impedances
        stripGap = 0;
        electricalLength = 90; // Quarter wavelength
        couplingValue = -3; // 3dB split
        isolation = 25;
        returnLoss = 25;
        vswr = 1.2;
        bandwidth = 35;
        break;
    }

    setResults({
      stripWidth,
      stripGap,
      electricalLength,
      couplingValue,
      isolation,
      returnLoss,
      vswr,
      bandwidth,
    });
  };

  useEffect(() => {
    calculateCoupler();
  }, [couplerType, coupling, frequency, impedance, substrate, substrateHeight]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🔀 RF Coupler & Power Divider Designer
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Design Parameters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Coupler Type</InputLabel>
                  <Select
                    value={couplerType}
                    label="Coupler Type"
                    onChange={(e) => setCouplerType(e.target.value)}
                  >
                    <MenuItem value="directional">Directional Coupler</MenuItem>
                    <MenuItem value="rat-race">Rat-Race Hybrid</MenuItem>
                    <MenuItem value="wilkinson">Wilkinson Divider</MenuItem>
                    <MenuItem value="branch-line">Branch-Line Hybrid</MenuItem>
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

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Impedance (Ω)"
                  type="number"
                  value={impedance}
                  onChange={(e) => setImpedance(Number(e.target.value))}
                />
              </Grid>

              {couplerType === 'directional' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Coupling (dB)"
                    type="number"
                    value={coupling}
                    onChange={(e) => setCoupling(Number(e.target.value))}
                    helperText="Negative value (e.g., -20 for 20dB coupling)"
                  />
                </Grid>
              )}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Substrate</InputLabel>
                  <Select
                    value={substrate}
                    label="Substrate"
                    onChange={(e) => setSubstrate(e.target.value)}
                  >
                    <MenuItem value="FR4">FR4 (εr = 4.5)</MenuItem>
                    <MenuItem value="Rogers4003">Rogers 4003 (εr = 3.55)</MenuItem>
                    <MenuItem value="Alumina">Alumina (εr = 9.8)</MenuItem>
                    <MenuItem value="PTFE">PTFE (εr = 2.1)</MenuItem>
                    <MenuItem value="Duroid5880">Duroid 5880 (εr = 2.2)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Substrate Height (mm)"
                  type="number"
                  value={substrateHeight}
                  onChange={(e) => setSubstrateHeight(Number(e.target.value))}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {results && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Physical Dimensions
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
                      <TableCell>Strip Width</TableCell>
                      <TableCell>{results.stripWidth.toFixed(2)}</TableCell>
                      <TableCell>mm</TableCell>
                    </TableRow>
                    {results.stripGap > 0 && (
                      <TableRow>
                        <TableCell>Strip Gap</TableCell>
                        <TableCell>{results.stripGap.toFixed(2)}</TableCell>
                        <TableCell>mm</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Electrical Length</TableCell>
                      <TableCell>{results.electricalLength}</TableCell>
                      <TableCell>degrees</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Physical Length</TableCell>
                      <TableCell>{(299.792 / (frequency * Math.sqrt(4.5)) * results.electricalLength / 360 * 1000).toFixed(1)}</TableCell>
                      <TableCell>mm</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {results && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Specifications
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Coupling Value</strong></TableCell>
                      <TableCell>{results.couplingValue.toFixed(1)} dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Isolation</strong></TableCell>
                      <TableCell>{results.isolation.toFixed(1)} dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Return Loss</strong></TableCell>
                      <TableCell>{results.returnLoss.toFixed(1)} dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>VSWR</strong></TableCell>
                      <TableCell>{results.vswr.toFixed(2)}:1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Bandwidth</strong></TableCell>
                      <TableCell>±{results.bandwidth}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Center Frequency</strong></TableCell>
                      <TableCell>{frequency} MHz</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Manufacturing Notes:</strong> Consider PCB fabrication tolerances (±10%) for strip width and gap. 
        Use ground plane on the opposite side and via stitching for proper grounding. 
        Verify performance with EM simulation before fabrication.
      </Alert>
    </Box>
  );
};

export default CouplerDesigner;