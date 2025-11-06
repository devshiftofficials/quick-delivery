"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Fade,
  Grow,
  Collapse,
} from "@mui/material";

// Lucide Icons
import {
  Home,
  Users,
  LogOut,
  ChevronDown,
  Package,
  ShoppingCart,
  Tag,
  Palette,
  Ruler,
  Settings,
  Ticket,
  Image as ImageIcon,
  Star,
  FileText,
  Phone,
  Store,
  File,
  HelpCircle,
  Building2,
  MessageCircle,
  BookOpen,
  Share2,
  User,
} from "lucide-react";

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    products: false,
    orders: false,
    categories: false,
    size: false,
    color: false,
    settings: false,
    coupons: false,
    sliders: false,
    socialmedia: false,
    blog: false,
    reviews: false,
    pages: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

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
            overflow: "visible",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -15,
              left: -15,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
              animation: "pulse 5s ease-in-out infinite 1.5s",
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              animation: "fadeInDown 0.6s ease",
              overflow: "visible",
              width: "100%",
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
                  Online Ordering System
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
        {/* Home */}
        <Grow in timeout={600}>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/admin/pages/Main"
            sx={{
                py: 1,
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                position: "relative",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(pathname === "/admin/pages/Main" && {
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
                  color: pathname === "/admin/pages/Main" ? "#6366f1" : "#64748b",
                  minWidth: "36px",
                  transition: "all 0.3s ease",
                }}
              >
                <Home size={20} />
            </ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: pathname === "/admin/pages/Main" ? 600 : 400,
                }}
              />
          </ListItemButton>
        </ListItem>
        </Grow>

        {/* Customers Data */}
        <Grow in timeout={800}>
          <Accordion
            sx={{
              bgcolor: "transparent",
              color: "#64748b",
              boxShadow: "none",
              "&:before": { display: "none" },
              mx: 1,
              mb: 0.5,
            }}
          >
          <AccordionSummary
              expandIcon={
                <ChevronDown
                  size={20}
                  style={{
                    color: "#64748b",
                    transition: "transform 0.3s ease",
                    transform: isDropdownOpen.customers ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              }
            onClick={() => toggleDropdown("customers")}
            sx={{
                py: 1,
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                  transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                    color: "#6366f1",
                    transform: "scale(1.2)",
                  },
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    transform: "scale(1.1)",
                  },
                },
                "&.Mui-expanded": {
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                },
            }}
          >
              <ListItemIcon
                sx={{
                  color: isDropdownOpen.customers ? "#6366f1" : "#64748b",
                  minWidth: "36px",
                  mr: 1,
                  transition: "all 0.3s ease",
                }}
              >
                <Users size={20} />
            </ListItemIcon>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: isDropdownOpen.customers ? 600 : 400,
                  transition: "all 0.3s ease",
                  color: isDropdownOpen.customers ? "#6366f1" : "#1e293b",
                }}
              >
                Customers
              </Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/customer"
                  sx={{
                      py: 0.75,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 1.5,
                      transition: "all 0.3s ease",
                    "&:hover": {
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                        transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                          color: "#6366f1",
                          fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Customers"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        </Grow>

        {/* Products */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.products ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("products")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.products ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Package size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.products ? 600 : 400, color: isDropdownOpen.products ? "#6366f1" : "#1e293b" }}>Products</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/Products"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="All Products"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/add-product"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Add Products"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Orders */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.orders ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("orders")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.orders ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <ShoppingCart size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.orders ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.orders ? "#6366f1" : "#1e293b" }}>Orders</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/orders"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="View Orders"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Categories */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.categories ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("categories")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.categories ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Tag size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.categories ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.categories ? "#6366f1" : "#1e293b" }}>Category</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/categories"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Categories"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/subcategories"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="SubCategory"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Size */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.size ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("size")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.size ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Ruler size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.size ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.size ? "#6366f1" : "#1e293b" }}>Size</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/size"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Sizes"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Color */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.color ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("color")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.color ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Palette size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.color ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.color ? "#6366f1" : "#1e293b" }}>Color</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/color"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Colors"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Divider
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.1)",
            my: 1.5,
            mx: 1,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)",
          }}
        />

        {/* Profile */}
        <Grow in timeout={1400}>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="/admin/pages/profile"
              sx={{
                py: 1,
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                position: "relative",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(pathname === "/admin/pages/profile" && {
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
                  color: pathname === "/admin/pages/profile" ? "#6366f1" : "#64748b",
                  minWidth: "36px",
                  transition: "all 0.3s ease",
                }}
              >
                <User size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: pathname === "/admin/pages/profile" ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Grow>

        {/* Settings */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.settings ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("settings")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.settings ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Settings size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.settings ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.settings ? "#6366f1" : "#1e293b" }}>Settings</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/settings"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Settings"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/facebook-pixel"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Facebook Pixel"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Coupons */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.coupons ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("coupons")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.coupons ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Ticket size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.coupons ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.coupons ? "#6366f1" : "#1e293b" }}>Coupons</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/coupons"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Coupons"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Sliders */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.sliders ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("sliders")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.sliders ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <ImageIcon size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.sliders ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.sliders ? "#6366f1" : "#1e293b" }}>Sliders</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/slider"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Manage Sliders"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Divider
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.1)",
            my: 1.5,
            mx: 1,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)",
          }}
        />

        {/* Vendors */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/admin/pages/vendors"
            sx={{
              py: 1,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(pathname === "/admin/pages/vendors" && {
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
            <ListItemIcon sx={{ color: pathname === "/admin/pages/vendors" ? "#6366f1" : "#64748b", minWidth: "36px", transition: "all 0.3s ease" }}>
              <Store size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="Vendors" 
              primaryTypographyProps={{ 
                fontSize: "0.95rem", 
                fontWeight: pathname === "/admin/pages/vendors" ? 600 : 400,
                color: pathname === "/admin/pages/vendors" ? "#6366f1" : "#1e293b"
              }} 
            />
          </ListItemButton>
        </ListItem>

        {/* Social Media */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.socialmedia ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("socialmedia")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.socialmedia ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Share2 size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.socialmedia ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.socialmedia ? "#6366f1" : "#1e293b" }}>Social Media</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/socialmedia"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Manage Social Media"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Blog */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.blog ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("blog")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.blog ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <BookOpen size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.blog ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.blog ? "#6366f1" : "#1e293b" }}>Blog</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/Blogs"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Add Blog"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/BlogCategory"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Blog Categories"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Customer Reviews */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.reviews ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("reviews")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.reviews ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <Star size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.reviews ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.reviews ? "#6366f1" : "#1e293b" }}>Customer Reviews</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/reviews"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="View Reviews"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Pages */}
        <Accordion sx={{ bgcolor: "transparent", color: "#1e293b", boxShadow: "none", mx: 1, mb: 0.5 }}>
          <AccordionSummary
            expandIcon={
              <ChevronDown
                size={20}
                style={{
                  color: "#64748b",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen.pages ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
            onClick={() => toggleDropdown("pages")}
            sx={{
              py: 1,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                transform: "translateX(8px)",
                "& .MuiListItemIcon-root": {
                  color: "#6366f1",
                  transform: "scale(1.2)",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transform: "scale(1.1)",
                },
              },
              "&.Mui-expanded": {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDropdownOpen.pages ? "#6366f1" : "#64748b", minWidth: "36px", mr: 1, transition: "all 0.3s ease" }}>
              <FileText size={20} />
            </ListItemIcon>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: isDropdownOpen.pages ? 600 : 400, transition: "all 0.3s ease", color: isDropdownOpen.pages ? "#6366f1" : "#1e293b" }}>Pages</Typography>
          </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "#f8fafc" }}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addPrivacyPolicy"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Privacy Policy"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addTermsAndConditions"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Terms & Conditions"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addShippingPolicy"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Shipping Policy"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addReturnAndExchangePolicy"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Return & Exchange Policy"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addAboutUs"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="About Us"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="/admin/pages/addContactUs"
                  sx={{
                    py: 0.75,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                      transform: "translateX(8px)",
                      "& .MuiListItemText-primary": {
                        color: "#6366f1",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary="Contact Us"
                    sx={{ pl: 4 }}
                    primaryTypographyProps={{ fontSize: "0.9rem", color: "#1e293b" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Divider
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.1)",
            my: 1.5,
            mx: 1,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)",
          }}
        />

        {/* FAQs */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/admin/pages/addFAQ"
            sx={{
              py: 1,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(pathname === "/admin/pages/addFAQ" && {
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
            <ListItemIcon sx={{ color: pathname === "/admin/pages/addFAQ" ? "#6366f1" : "#64748b", minWidth: "36px", transition: "all 0.3s ease" }}>
              <HelpCircle size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="FAQs" 
              primaryTypographyProps={{ 
                fontSize: "0.95rem", 
                fontWeight: pathname === "/admin/pages/addFAQ" ? 600 : 400,
                color: pathname === "/admin/pages/addFAQ" ? "#6366f1" : "#1e293b"
              }} 
            />
          </ListItemButton>
        </ListItem>

        {/* Contact Info */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/admin/pages/addContactInfo"
            sx={{
              py: 1,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(pathname === "/admin/pages/addContactInfo" && {
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
            <ListItemIcon sx={{ color: pathname === "/admin/pages/addContactInfo" ? "#6366f1" : "#64748b", minWidth: "36px", transition: "all 0.3s ease" }}>
              <Phone size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="Contact Info" 
              primaryTypographyProps={{ 
                fontSize: "0.95rem", 
                fontWeight: pathname === "/admin/pages/addContactInfo" ? 600 : 400,
                color: pathname === "/admin/pages/addContactInfo" ? "#6366f1" : "#1e293b"
              }} 
            />
          </ListItemButton>
        </ListItem>

        {/* Company Details */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/admin/pages/CompanyDetails"
            sx={{
              py: 1,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(pathname === "/admin/pages/CompanyDetails" && {
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
            <ListItemIcon sx={{ color: pathname === "/admin/pages/CompanyDetails" ? "#6366f1" : "#64748b", minWidth: "36px", transition: "all 0.3s ease" }}>
              <Building2 size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="Company Details" 
              primaryTypographyProps={{ 
                fontSize: "0.95rem", 
                fontWeight: pathname === "/admin/pages/CompanyDetails" ? 600 : 400,
                color: pathname === "/admin/pages/CompanyDetails" ? "#6366f1" : "#1e293b"
              }} 
            />
          </ListItemButton>
        </ListItem>

        {/* Logout */}
        <Grow in timeout={1000}>
          <ListItem disablePadding sx={{ mt: 2, mb: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
                py: 1.5,
                mx: 1,
                borderRadius: 2,
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                "& .MuiListItemIcon-root": {
                    color: "#ef4444",
                    transform: "scale(1.2) rotate(-10deg)",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#ef4444",
                    fontWeight: 700,
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
                <LogOut size={22} />
            </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#ef4444",
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