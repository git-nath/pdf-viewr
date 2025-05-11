import React, { useState } from 'react';
import { Typography, Box, Slider, IconButton, Paper, Fade } from '@mui/material';
import PDFViewer from './components/PDFViewer';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { styled } from '@mui/material/styles';

function getDarkBg(darkness) {
  // 0 = #ffffff, 100 = #121212
  const start = [255, 255, 255];
  const end = [18, 18, 18];
  const ratio = darkness / 100;
  const rgb = start.map((s, i) => Math.round(s + (end[i] - s) * ratio));
  return `rgb(${rgb.join(',')})`;
}

const MainContent = styled('main')(({ bgcolor }) => ({
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: bgcolor,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  transition: 'background-color 0.2s',
  overflow: 'hidden',
}));

const FloatingControllerRoot = styled('div')(() => ({
  position: 'fixed',
  bottom: 32,
  right: 32,
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const FloatingPanel = styled(Paper)(({ theme }) => ({
  marginBottom: 12,
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.spacing(3),
  background: '#23272fdd',
  boxShadow: theme.shadows[6],
  minWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  alignItems: 'stretch',
}));

const TransparentHeader = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 18,
  left: 24,
  zIndex: 2100,
  background: 'rgba(30,30,30,0.35)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.2, 2.5),
  boxShadow: theme.shadows[2],
  display: 'flex',
  alignItems: 'center',
  minHeight: 0,
}));

const globalScrollbarStyle = `
  ::-webkit-scrollbar {
    width: 12px;
    background: #23272f;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #90caf9 0%, #1976d2 100%);
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #1976d2 0%, #90caf9 100%);
  }
`;

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [darkness, setDarkness] = useState(90);
  const [showControls, setShowControls] = useState(false);
  const [coffeeIntensity, setCoffeeIntensity] = useState(0); // 0-100

  const handleFileUpload = (file) => {
    setPdfFile(file);
  };

  const handleDarknessChange = (event, newValue) => {
    setDarkness(newValue);
  };

  // When clicking outside the panel, close it
  React.useEffect(() => {
    if (!showControls) return;
    const handleClick = (e) => {
      const panel = document.getElementById('brightness-panel');
      const icon = document.getElementById('brightness-icon');
      if (panel && !panel.contains(e.target) && icon && !icon.contains(e.target)) {
        setShowControls(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showControls]);

  const bgColor = getDarkBg(darkness);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: bgColor, color: '#fff', transition: 'background-color 0.2s', overflow: 'hidden' }}>
      <style>{globalScrollbarStyle}</style>
      <TransparentHeader>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, letterSpacing: 1, fontSize: 22 }}>
          PDF Viewer
        </Typography>
      </TransparentHeader>
      <MainContent bgcolor={bgColor}>
        <PDFViewer onFileUpload={handleFileUpload} pdfFile={pdfFile} darkness={darkness} coffeeIntensity={coffeeIntensity} />
      </MainContent>
      <FloatingControllerRoot>
        <Fade in={showControls} unmountOnExit>
          <FloatingPanel id="brightness-panel">
            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 15, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Brightness4Icon fontSize="small" /> Darkness
              </Typography>
              <Slider
                value={darkness}
                onChange={handleDarknessChange}
                min={0}
                max={100}
                sx={{
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                  },
                }}
              />
            </Box>
            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 15, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalCafeIcon fontSize="small" /> Coffee
              </Typography>
              <Slider
                value={coffeeIntensity}
                min={0}
                max={100}
                step={1}
                onChange={(_, v) => setCoffeeIntensity(v)}
                sx={{
                  color: coffeeIntensity > 0 ? '#a67c52' : 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                  },
                }}
              />
            </Box>
          </FloatingPanel>
        </Fade>
        <IconButton
          id="brightness-icon"
          onClick={() => setShowControls((v) => !v)}
          sx={{ color: 'primary.main', transition: 'color 0.2s', background: '#23272fdd', boxShadow: 3, mb: 0.5 }}
          size="large"
        >
          <Brightness4Icon fontSize="large" />
        </IconButton>
      </FloatingControllerRoot>
    </Box>
  );
}

export default App; 