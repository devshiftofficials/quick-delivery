'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

// MUI Imports
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
  TextField,
  InputAdornment,
  Grow,
  Chip,
  Divider,
  Badge,
} from '@mui/material';
// Lucide Icons
import {
  User,
  Settings,
  LogOut,
  Search,
  X,
  Menu as MenuIcon,
  Bell,
  Mail,
} from 'lucide-react';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [inboxCount, setInboxCount] = useState(2);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is authenticated by looking for the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'VENDOR') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/login');
    }
  }, [router]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('authToken');
    handleMenuClose();
    router.push('/login');
  };

  // Render nothing until authentication status is known
  if (!isAuthenticated) {
    return null;
  }

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: { xs: 0, md: '270px' },
        right: 0,
        width: { xs: '100%', md: 'calc(100% - 270px)' },
        zIndex: 1100,
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        position: 'relative',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: 1.5,
          minHeight: '64px !important',
          gap: 2,
        }}
      >
        {/* Left Section - Logo */}
        <Fade in timeout={600}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', md: '1.6rem' },
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                QuickDelivery
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Center Section - Search Bar */}
        <Grow in timeout={800}>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '180px', sm: '350px', md: '500px', lg: '600px' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      size={20}
                      strokeWidth={2.5}
                      style={{
                        color: isSearchFocused ? '#6366f1' : '#94a3b8',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{
                        color: '#94a3b8',
                        '&:hover': {
                          color: '#6366f1',
                          background: 'rgba(99, 102, 241, 0.08)',
                        },
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: isSearchFocused ? '#ffffff' : '#f8fafc',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${
                    isSearchFocused ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0, 0, 0, 0.08)'
                  }`,
                  boxShadow: isSearchFocused 
                    ? '0 2px 8px rgba(99, 102, 241, 0.12)' 
                    : 'none',
                  '&:hover': {
                    background: '#ffffff',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.08)',
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                  '& input': {
                    color: '#1e293b',
                    fontSize: '0.95rem',
                    padding: '10px 14px',
                    '&::placeholder': {
                      color: '#94a3b8',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>
        </Grow>

        {/* Right Section */}
        <Fade in timeout={1000}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 }, 
              flexShrink: 0 
            }}
          >
            {/* Mobile Search Button */}
            <Tooltip title="Search" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: '#64748b',
                  display: { xs: 'flex', sm: 'none' },
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    transform: 'scale(1.05)',
                  },
                }}
                aria-label="search"
              >
                <Search size={22} strokeWidth={2.5} />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: '#64748b',
                  position: 'relative',
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    transform: 'scale(1.05)',
                  },
                }}
                aria-label="notifications"
              >
                <Badge
                  badgeContent={notificationCount}
                  color="error"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 18,
                      height: 18,
                      minWidth: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: 0,
                      lineHeight: '18px',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <Bell size={22} strokeWidth={2.5} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Inbox */}
            <Tooltip title="Inbox" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: '#64748b',
                  position: 'relative',
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    transform: 'scale(1.05)',
                  },
                }}
                aria-label="inbox"
              >
                <Badge
                  badgeContent={inboxCount}
                  color="error"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 18,
                      height: 18,
                      minWidth: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: 0,
                      lineHeight: '18px',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <Mail size={22} strokeWidth={2.5} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Section */}
            <Tooltip title="Account Settings" arrow TransitionComponent={Fade}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  },
                }}
                onClick={handleMenuOpen}
              >
                <Avatar
                  sx={{
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  V
                </Avatar>
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.25,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      lineHeight: 1.2,
                    }}
                  >
                    Vendor
                  </Typography>
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: 'none',
                      '& .MuiChip-label': {
                        padding: '0 6px',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Tooltip>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 240,
                  borderRadius: 3,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: '#ffffff',
                  overflow: 'hidden',
                  '& .MuiMenuItem-root': {
                    px: 2.5,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    color: '#1e293b',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
                      transform: 'translateX(4px)',
                      color: '#6366f1',
                    },
                    '&:first-of-type': {
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    },
                    '&:last-of-type': {
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                  },
                },
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  router.push('/vendor/pages/profile');
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={20} style={{ color: '#6366f1' }} strokeWidth={2.5} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Profile
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      View your profile
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  router.push('/vendor/pages/Setting');
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Settings size={20} style={{ color: '#6366f1' }} strokeWidth={2.5} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Settings
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Manage preferences
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#dc2626',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LogOut size={20} style={{ color: '#ef4444' }} strokeWidth={2.5} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Logout
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Sign out of your account
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
