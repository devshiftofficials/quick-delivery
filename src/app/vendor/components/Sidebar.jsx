"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

// MUI Imports
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Fade,
  Grow,
} from "@mui/material";

// Lucide Icons
import {
  Home,
  LogOut,
  Package,
  Tag,
  Ruler,
  Palette,
  Settings,
  Phone,
  Building2,
  User,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== 'VENDOR') {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const menuItems = [
    { icon: Home, text: "Home", href: "/vendor/pages/Main" },
    { icon: Package, text: "Products", href: "/vendor/pages/Products" },
    { icon: Tag, text: "Categories", href: "/vendor/pages/Categories" },
    { icon: Ruler, text: "Size", href: "/vendor/pages/Size" },
    { icon: Palette, text: "Colour", href: "/vendor/pages/Colour" },
    { icon: User, text: "Profile", href: "/vendor/pages/profile" },
    { icon: Settings, text: "Setting", href: "/vendor/pages/Setting" },
    { icon: Phone, text: "Contact Info", href: "/vendor/pages/ContactInfo" },
    { icon: Building2, text: "Company Detail", href: "/vendor/pages/CompanyDetail" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 270,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          color: "#1e293b",
          height: "100vh",
          maxHeight: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(99, 102, 241, 0.08)",
          boxShadow: "2px 0 15px rgba(99, 102, 241, 0.04), inset -1px 0 0 rgba(99, 102, 241, 0.03)",
          position: "fixed",
          top: 0,
          left: 0,
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f5f9",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "10px",
            border: "2px solid #f1f5f9",
            "&:hover": {
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#6366f1 #f1f5f9",
        },
      }}
    >
      <Fade in timeout={800}>
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(99, 102, 241, 0.04) 100%)",
            borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              animation: "fadeInDown 0.6s ease",
              "@keyframes fadeInDown": {
                from: {
                  opacity: 0,
                  transform: "translateY(-20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            {/* Logo and App Name Container */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                mb: 2,
                px: 2,
                py: 0.5,
                gap: 1.5,
                width: "100%",
                boxSizing: "border-box",
                overflow: "visible",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Circular Logo Container */}
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  minWidth: "56px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  position: "relative",
                  overflow: "visible",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                    borderRadius: "50%",
                  },
                }}
              >
                {/* Grid Icon */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: "32px",
                    height: "32px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "2px",
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* App Name and Subtitle */}
              <Box 
                sx={{ 
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: 0.3,
                    lineHeight: 1.2,
                    mb: 0.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  QuickDelivery
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 400,
                    letterSpacing: 0.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Vendor Portal
                </Typography>
              </Box>
            </Box>

            {/* Online Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                mt: 1.5,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  animation: "pulse 2s infinite",
                  boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                    "50%": {
                      opacity: 0.8,
                      transform: "scale(1.15)",
                    },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#10b981",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Divider
        sx={{
          bgcolor: "rgba(99, 102, 241, 0.1)",
          my: 1,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)",
          flexShrink: 0,
        }}
      />

      <List sx={{ p: 0, flex: 1, overflowY: "auto", overflowX: "hidden", pb: 2 }}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Grow in timeout={600 + index * 100} key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  sx={{
                    py: 1,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    ...(isActive && {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        borderRadius: "0 4px 4px 0",
                      },
                    }),
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemIcon-root": {
                        color: "#6366f1",
                        transform: "scale(1.2)",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#6366f1" : "#64748b",
                      minWidth: "36px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <IconComponent size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#6366f1" : "#1e293b",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Grow>
          );
        })}

        {/* Logout */}
        <Grow in timeout={1000}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 1,
                mx: 1,
                mb: 0.5,
                mt: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)",
                  transform: "translateX(8px)",
                  "& .MuiListItemIcon-root": {
                    color: "#ef4444",
                    transform: "scale(1.2)",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#ef4444",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#ef4444",
                  minWidth: "36px",
                  transition: "all 0.3s ease",
                }}
              >
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Grow>
      </List>
    </Drawer>
  );
};

export default Sidebar;
