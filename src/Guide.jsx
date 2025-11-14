import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CreateIcon from '@mui/icons-material/Create';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import WifiIcon from '@mui/icons-material/Wifi';
import ContactsIcon from '@mui/icons-material/Contacts';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GetAppIcon from '@mui/icons-material/GetApp';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import LayersIcon from '@mui/icons-material/Layers';

const drawerWidth = 280;

function Guide() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: <AutoAwesomeIcon /> },
    { id: 'scanning', label: 'QR Scanning', icon: <CameraAltIcon /> },
    { id: 'generating', label: 'QR Generation', icon: <CreateIcon /> },
    { id: 'bulk', label: 'Bulk Generation', icon: <LayersIcon /> },
    { id: 'history', label: 'History & Analytics', icon: <HistoryIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: <TipsAndUpdatesIcon /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <HelpOutlineIcon /> },
    { id: 'faq', label: 'FAQ', icon: <InfoIcon /> },
  ];

  useEffect(() => {
    // Scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);

      // Update active section based on scroll position
      const sectionElements = document.querySelectorAll('[data-section]');
      sectionElements.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.getAttribute('data-section'));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      const yOffset = -80; // AppBar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Contents
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search guide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 2 }}
        />

        <List>
          {sections
            .filter(section => 
              searchQuery === '' || 
              section.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((section) => (
              <ListItem key={section.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                  sx={{
                    borderRadius: 3,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={section.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: activeSection === section.id ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <QrCode2Icon sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
            QR Studio User Guide
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          {/* Hero Section */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              mb: 3,
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
            data-section="hero"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <QrCode2Icon sx={{ fontSize: { xs: 40, sm: 56 } }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '3rem' } }}>
                Welcome to QR Studio
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.95, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Master all features of your complete QR code solution
            </Typography>
          </Paper>

          {/* Getting Started */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="getting-started">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Getting Started
              </Typography>
            </Box>

            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
              QR Studio is a powerful Chrome extension for scanning and generating QR codes with advanced features.
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" />
              Installation Steps
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Typography component="li" sx={{ mb: 1.5 }}>
                Open Chrome and navigate to <Chip label="chrome://extensions/" size="small" variant="outlined" />
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                Enable <strong>"Developer mode"</strong> (toggle in top-right corner)
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                Click <strong>"Load unpacked"</strong> and select the <code style={{ padding: '2px 8px', background: '#f5f5f5', borderRadius: 4 }}>dist</code> folder
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                The QR Studio icon will appear in your toolbar <CheckCircleIcon color="success" fontSize="small" sx={{ verticalAlign: 'middle' }} />
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCode2Icon color="primary" />
              First Launch
            </Typography>
            <Typography paragraph>
              Click the QR Studio icon to open the popup. You'll see 5 tabs:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip icon={<CameraAltIcon />} label="Scan" color="primary" variant="outlined" />
              <Chip icon={<CreateIcon />} label="Generate" color="secondary" variant="outlined" />
              <Chip icon={<HistoryIcon />} label="History" variant="outlined" />
              <Chip icon={<BarChartIcon />} label="Analytics" variant="outlined" />
              <Chip icon={<SettingsIcon />} label="Settings" variant="outlined" />
            </Box>
          </Paper>

          {/* QR Scanning */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="scanning">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CameraAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                QR Code Scanning
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CameraAltIcon color="primary" />
              Method 1: Camera Scanning
            </Typography>
            <Box component="ol" sx={{ pl: 3, mb: 3 }}>
              <Typography component="li" sx={{ mb: 1.5 }}>Click the <strong>Scan</strong> tab</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Click <strong>"Start Camera"</strong> button</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Allow camera permission when prompted</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Point camera at QR code - it detects automatically!</Typography>
            </Box>

            <Alert severity="success" icon={<BatteryChargingFullIcon />} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Pro Tip: Battery Optimization
              </Typography>
              Use the Pause button to save battery when not actively scanning. The adaptive scan cadence automatically slows down when no codes are detected.
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderOpenIcon color="secondary" />
              Method 2: Image Scanning
            </Typography>
            <Typography paragraph>
              Multiple ways to scan images:
            </Typography>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, mb: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                <DragIndicatorIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Drag & Drop</Typography>
                <Typography variant="body2" color="text.secondary">Drag image into drop zone</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                <ContentPasteIcon sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Paste</Typography>
                <Typography variant="body2" color="text.secondary">Copy image, press Ctrl+V</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                <FolderOpenIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Browse</Typography>
                <Typography variant="body2" color="text.secondary">Click "Browse Files" button</Typography>
              </Paper>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCode2Icon color="info" />
              Method 3: On-Page Scanning
            </Typography>
            <Typography paragraph>
              Right-click any image on a webpage → Select <strong>"Scan QR Code"</strong>
            </Typography>
          </Paper>

          {/* QR Generation */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="generating">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CreateIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                QR Code Generation
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon color="primary" />
              Quick Actions (One-Click Templates)
            </Typography>
            <Typography paragraph>
              Click any Quick Action button for instant QR generation:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip icon={<QrCode2Icon />} label="URL" size="small" color="primary" variant="outlined" />
              <Chip icon={<WifiIcon />} label="WiFi" size="small" color="primary" variant="outlined" />
              <Chip icon={<ContactsIcon />} label="vCard" size="small" color="primary" variant="outlined" />
              <Chip icon={<EmailIcon />} label="Email" size="small" color="secondary" variant="outlined" />
              <Chip icon={<SmsIcon />} label="SMS" size="small" color="secondary" variant="outlined" />
              <Chip icon={<PhoneIcon />} label="Phone" size="small" color="secondary" variant="outlined" />
              <Chip icon={<LocationOnIcon />} label="Location" size="small" variant="outlined" />
              <Chip icon={<WhatsAppIcon />} label="WhatsApp" size="small" variant="outlined" />
              <Chip label="...and more!" size="small" color="success" />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="info" />
              Customization Options
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" sx={{ mb: 1.5 }}>
                <strong>Size:</strong> 256px - 1024px (drag slider)
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                <strong>Error Correction:</strong> Low (7%) / Medium (15%) / Quartile (25%) / High (30%)
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                <strong>Colors:</strong> Custom foreground & background colors with hex preview
              </Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>
                <strong>Logo:</strong> Add custom logo/image overlay (optional)
              </Typography>
            </Box>
          </Paper>

          {/* Bulk Generation */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="bulk">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <LayersIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Bulk QR Generation
              </Typography>
            </Box>

            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3 }}>
              Generate thousands of QR codes at once from CSV/Excel files or Google Sheets!
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <GetAppIcon color="primary" />
              Step 1: Prepare Data (CSV Format)
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mb: 3, borderRadius: 2 }}>
              <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.9rem', m: 0, overflowX: 'auto' }}>
{`name,url,email
John Doe,https://example.com,john@example.com
Jane Smith,https://example.org,jane@example.org`}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="secondary" />
              Step 2: Import & Configure
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Typography component="li" sx={{ mb: 1.5 }}>Click <strong>"Advanced Bulk Mode"</strong> button</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Upload CSV/Excel or import from Google Sheets</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Map columns to QR content</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Configure size, colors, export format</Typography>
              <Typography component="li" sx={{ mb: 1.5 }}>Generate and export as ZIP or PDF</Typography>
            </Box>
          </Paper>

          {/* History & Analytics */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="history">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <HistoryIcon sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                History & Analytics
              </Typography>
            </Box>

            <Typography paragraph>
              Track all your scanned and generated QR codes with powerful history management:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon color="primary" fontSize="small" /> View comprehensive scan history
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon color="action" fontSize="small" /> Search and filter by content or date
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon color="error" fontSize="small" /> Mark favorites for quick access
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon color="success" fontSize="small" /> Analytics dashboard with usage statistics
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GetAppIcon color="info" fontSize="small" /> Export history as CSV or JSON
              </Typography>
            </Box>
          </Paper>

          {/* Settings */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="settings">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <SettingsIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Settings & Configuration
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Available Settings
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" /> Auto-copy scanned codes to clipboard
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <QrCode2Icon color="primary" fontSize="small" /> Auto-open URLs when scanned
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CameraAltIcon color="info" fontSize="small" /> Default scan mode (Auto/QR/Barcode)
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="action" fontSize="small" /> Sound effects, vibration, notifications
              </Typography>
              <Typography component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon color="secondary" fontSize="small" /> History limit (5-50 entries)
              </Typography>
            </Box>
          </Paper>

          {/* Keyboard Shortcuts */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="shortcuts">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TipsAndUpdatesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Keyboard Shortcuts
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {[
                { keys: ['Ctrl', '1-5'], action: 'Switch between tabs' },
                { keys: ['Escape'], action: 'Close dialogs/overlays/camera' },
                { keys: ['Enter'], action: 'Confirm primary action in dialogs' },
                { keys: ['Tab'], action: 'Navigate between elements' },
                { keys: ['Space'], action: 'Toggle pause/resume scanning' },
              ].map((shortcut, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {shortcut.keys.map((key, i) => (
                      <Chip 
                        key={i}
                        label={key} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'grey.800', 
                          color: 'white',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'right' } }}>{shortcut.action}</Typography>
                </Paper>
              ))}
            </Box>
          </Paper>

          {/* Troubleshooting */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="troubleshooting">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <HelpOutlineIcon sx={{ fontSize: 40, color: 'error.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Troubleshooting
              </Typography>
            </Box>

            {/* Camera Not Working */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WarningAmberIcon color="warning" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Camera not working?
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Check camera permissions in browser settings</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Ensure no other app is using the camera</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Try restarting the browser</span>
                </Typography>
              </Box>
            </Box>

            {/* QR Code Not Scanning */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WarningAmberIcon color="warning" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  QR code not scanning?
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Ensure good lighting and clean lens</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Try adjusting the distance to the QR code</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Use image upload method for damaged codes</span>
                </Typography>
              </Box>
            </Box>

            {/* Extension Not Loading */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WarningAmberIcon color="warning" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Extension not loading?
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Try disabling and re-enabling the extension</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Check if Chrome needs an update</span>
                </Typography>
                <Typography component="li" sx={{ mb: 1, display: 'flex', alignItems: 'start', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                  <span>Remove and reinstall the extension</span>
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" icon={<InfoIcon />}>
              <Typography>
                Still having issues? Check the GitHub repository for more solutions or report a bug.
              </Typography>
            </Alert>
          </Paper>

          {/* FAQ */}
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, mb: 3, borderRadius: 4 }} data-section="faq">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <InfoIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Frequently Asked Questions
              </Typography>
            </Box>

            <Box>
              {/* FAQ 1 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Is my data safe and private?
                </Typography>
                <Typography paragraph>
                  Yes! QR Studio processes everything locally in your browser. No data is sent to external servers. Your history is stored locally using Chrome's storage API.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* FAQ 2 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Does it work offline?
                </Typography>
                <Typography paragraph>
                  Yes! All scanning and generation features work completely offline. Only URL safety checks and webhook integrations require internet connectivity.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* FAQ 3 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  What's the maximum QR code size?
                </Typography>
                <Typography paragraph>
                  QR codes can theoretically store up to 4,296 alphanumeric characters. However, larger codes become harder to scan reliably. We recommend keeping content under 500 characters.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* FAQ 4 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Can I export my history?
                </Typography>
                <Typography paragraph>
                  Yes! Use the Export button in the History tab to download your scan history as a CSV file. You can also export analytics data as JSON.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* FAQ 5 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  How do I clear my history?
                </Typography>
                <Typography paragraph>
                  Go to Settings → History & Data → Clear All History. You can also delete individual items by clicking the delete icon in the History tab.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* FAQ 6 */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Can I customize the QR code colors?
                </Typography>
                <Typography paragraph>
                  Absolutely! The Generate tab includes full customization options for foreground color, background color, corner styles, and error correction levels.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Paper elevation={0} sx={{ p: 3, mt: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Made with
              </Typography>
              <FavoriteIcon sx={{ fontSize: 16, color: 'error.main' }} />
              <Typography variant="body2" color="text.secondary">
                by the QR Studio Team
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Version 2.0.0 • November 2025
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
}

export default Guide;
