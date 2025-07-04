import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
} from '@mui/material';
import {
  Power as PowerIcon,
  Memory as TransistorIcon,
  Hub as CouplerIcon,
  Audiotrack as MagneticsIcon,
} from '@mui/icons-material';

import PowerSupplyCalculator from './components/PowerSupplyCalculator';
import RFTransistorAnalyzer from './components/RFTransistorAnalyzer';
import CouplerDesigner from './components/CouplerDesigner';
import MagneticsCalculator from './components/MagneticsCalculator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🔬 RF Design Studio
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Professional RF & Power Electronics Design
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="RF Design Studio Tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
            >
              <Tab 
                icon={<PowerIcon />} 
                label="Power Supply Design" 
                iconPosition="start"
              />
              <Tab 
                icon={<TransistorIcon />} 
                label="RF Transistor Analyzer" 
                iconPosition="start"
              />
              <Tab 
                icon={<CouplerIcon />} 
                label="Coupler & Divider" 
                iconPosition="start"
              />
              <Tab 
                icon={<MagneticsIcon />} 
                label="Magnetics Calculator" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <PowerSupplyCalculator />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RFTransistorAnalyzer />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <CouplerDesigner />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <MagneticsCalculator />
          </TabPanel>
        </Paper>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto', 
          py: 2, 
          px: 2, 
          backgroundColor: theme.palette.grey[100],
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          RF Design Studio v1.0 - Professional RF & Power Electronics Design Tools
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;