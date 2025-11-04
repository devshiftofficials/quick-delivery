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
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
  TextField,
  InputAdornment,
  Grow,
} from '@mui/material';
// Lucide Icons
import {
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Search,
  X,
} from 'lucide-react';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [mailCount, setMailCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is authenticated by looking for the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/admin');
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
    handleMenuClose();
    router.push('/admin');
  };

  // Render nothing until authentication status is known
  if (!isAuthenticated) {
    return null;
  }

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25), 0 0 40px rgba(99, 102, 241, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-20px) translateX(10px)' },
          },
        },
        '&:hover': {
          boxShadow: '0 6px 30px rgba(99, 102, 241, 0.35), 0 0 60px rgba(99, 102, 241, 0.15)',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          py: 1.5,
          position: 'relative',
          zIndex: 1,
          gap: 2,
        }}
      >
        {/* Left Section - Logo */}
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  ml: 1,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  letterSpacing: 1,
                  background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(255,255,255,0.3)',
                }}
              >
              QuickDelivery
            </Typography>
          </Box>
        </Box>
        </Fade>

        {/* Center Section - Search Bar */}
        <Grow in timeout={1000}>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '200px', sm: '400px', md: '500px' },
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
                      size={18}
                      style={{
                        color: isSearchFocused ? 'white' : 'rgba(255, 255, 255, 0.7)',
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
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
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
                  background: isSearchFocused
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${
                    isSearchFocused ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                  '& input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>
        </Grow>

        {/* Right Section */}
        <Fade in timeout={1200}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flexShrink: 0 }}>
            {/* Mobile Search Button */}
            <Tooltip title="Search" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: 'white',
                  display: { xs: 'flex', sm: 'none' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'scale(1.1) rotate(90deg)',
                  },
                }}
                aria-label="search"
              >
                <Search size={20} />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: 'white',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}
                aria-label="notifications"
              >
                <Badge
                  badgeContent={notificationCount}
            color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 18,
                      height: 18,
                      minWidth: 18,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'scale(1)',
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                        },
                      },
                    },
                  }}
                >
              <Bell size={20} />
                </Badge>
            </IconButton>
            </Tooltip>

            {/* Messages */}
            <Tooltip title="Messages" arrow TransitionComponent={Fade}>
              <IconButton
                sx={{
                  color: 'white',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'scale(1.1) rotate(-5deg)',
                  },
                }}
                aria-label="messages"
              >
                <Badge
                  badgeContent={mailCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 18,
                      height: 18,
                      minWidth: 18,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'scale(1)',
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                        },
                      },
                    },
                  }}
                >
                  <MessageCircle size={20} strokeWidth={2} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Account Settings" arrow TransitionComponent={Fade}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={handleMenuOpen}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  A
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    display: { xs: 'none', md: 'block' },
                  }}
                >
              Admin
            </Typography>
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
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      transform: 'translateX(4px)',
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <User size={18} style={{ marginRight: '16px', color: '#6366f1' }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Settings size={18} style={{ marginRight: '16px', color: '#6366f1' }} />
                Settings
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <LogOut size={18} style={{ marginRight: '16px' }} />
                Logout
              </MenuItem>
            </Menu>
        </Box>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
