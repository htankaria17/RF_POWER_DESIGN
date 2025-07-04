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

interface PowerSupplyResults {
  inductance: number;
  outputCapacitor: number;
  inputCapacitor: number;
  feedbackR1: number;
  feedbackR2: number;
  currentSenseR: number;
  efficiency: number;
  rippleVoltage: number;
  rippleCurrent: number;
}

const PowerSupplyCalculator: React.FC = () => {
  const [topology, setTopology] = useState('buck');
  const [inputVoltage, setInputVoltage] = useState(12);
  const [outputVoltage, setOutputVoltage] = useState(5);
  const [outputCurrent, setOutputCurrent] = useState(2);
  const [frequency, setFrequency] = useState(100000);
  const [ripplePercent, setRipplePercent] = useState(5);
  const [results, setResults] = useState<PowerSupplyResults | null>(null);

  const calculatePowerSupply = () => {
    const Po = outputVoltage * outputCurrent;
    const dutyCycle = topology === 'buck' ? outputVoltage / inputVoltage : 
                      topology === 'boost' ? 1 - inputVoltage / outputVoltage :
                      0.5; // Default for flyback/forward

    // Inductor calculation (Henry)
    const deltaIL = outputCurrent * (ripplePercent / 100);
    const inductance = topology === 'buck' ? 
      (inputVoltage - outputVoltage) * dutyCycle / (deltaIL * frequency) :
      inputVoltage * dutyCycle / (deltaIL * frequency);

    // Output capacitor (Farad)
    const deltaVo = outputVoltage * (ripplePercent / 100);
    const outputCapacitor = deltaIL / (8 * frequency * deltaVo);

    // Input capacitor (Farad)
    const inputCapacitor = outputCurrent * dutyCycle / (frequency * inputVoltage * 0.01);

    // Feedback resistors (Ohm) - for 1.25V reference
    const vRef = 1.25;
    const feedbackR2 = 10000; // 10kΩ typical
    const feedbackR1 = feedbackR2 * (outputVoltage / vRef - 1);

    // Current sense resistor (Ohm)
    const currentSenseR = 0.1; // 100mΩ typical

    // Efficiency estimation
    const conductionLoss = Math.pow(outputCurrent, 2) * 0.1; // Simplified
    const switchingLoss = 0.5 * inputVoltage * outputCurrent * 1e-9 * frequency;
    const totalLoss = conductionLoss + switchingLoss;
    const efficiency = (Po / (Po + totalLoss)) * 100;

    // Ripple calculations
    const rippleVoltage = deltaVo;
    const rippleCurrent = deltaIL;

    setResults({
      inductance: inductance * 1e6, // Convert to µH
      outputCapacitor: outputCapacitor * 1e6, // Convert to µF
      inputCapacitor: inputCapacitor * 1e6, // Convert to µF
      feedbackR1,
      feedbackR2,
      currentSenseR,
      efficiency,
      rippleVoltage,
      rippleCurrent,
    });
  };

  useEffect(() => {
    calculatePowerSupply();
  }, [topology, inputVoltage, outputVoltage, outputCurrent, frequency, ripplePercent]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🔌 Power Supply Design Calculator
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input Parameters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Topology</InputLabel>
                  <Select
                    value={topology}
                    label="Topology"
                    onChange={(e) => setTopology(e.target.value)}
                  >
                    <MenuItem value="buck">Buck (Step-down)</MenuItem>
                    <MenuItem value="boost">Boost (Step-up)</MenuItem>
                    <MenuItem value="flyback">Flyback</MenuItem>
                    <MenuItem value="forward">Forward</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Input Voltage (V)"
                  type="number"
                  value={inputVoltage}
                  onChange={(e) => setInputVoltage(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Output Voltage (V)"
                  type="number"
                  value={outputVoltage}
                  onChange={(e) => setOutputVoltage(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Output Current (A)"
                  type="number"
                  value={outputCurrent}
                  onChange={(e) => setOutputCurrent(Number(e.target.value))}
                />
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ripple Percentage (%)"
                  type="number"
                  value={ripplePercent}
                  onChange={(e) => setRipplePercent(Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {results && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Component Values
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Component</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                      <TableCell><strong>Unit</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Inductor</TableCell>
                      <TableCell>{results.inductance.toFixed(2)}</TableCell>
                      <TableCell>µH</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Output Capacitor</TableCell>
                      <TableCell>{results.outputCapacitor.toFixed(2)}</TableCell>
                      <TableCell>µF</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Input Capacitor</TableCell>
                      <TableCell>{results.inputCapacitor.toFixed(2)}</TableCell>
                      <TableCell>µF</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Feedback R1</TableCell>
                      <TableCell>{results.feedbackR1.toFixed(0)}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Feedback R2</TableCell>
                      <TableCell>{results.feedbackR2}</TableCell>
                      <TableCell>Ω</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Current Sense R</TableCell>
                      <TableCell>{results.currentSenseR}</TableCell>
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
                Performance Analysis
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Efficiency</strong></TableCell>
                      <TableCell>{results.efficiency.toFixed(1)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Output Ripple Voltage</strong></TableCell>
                      <TableCell>{results.rippleVoltage.toFixed(3)} V</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Inductor Ripple Current</strong></TableCell>
                      <TableCell>{results.rippleCurrent.toFixed(3)} A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Power Output</strong></TableCell>
                      <TableCell>{(outputVoltage * outputCurrent).toFixed(1)} W</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>Design Notes:</strong> Values are calculated using standard power electronics formulas. 
        Consider component tolerances, temperature coefficients, and safety margins in your final design.
        Always verify calculations with simulation before prototyping.
      </Alert>
    </Box>
  );
};

export default PowerSupplyCalculator;