'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

// MUI Imports
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import PageLoader from '../../../components/PageLoader';

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        const orderData = response.data;
        setOrder(orderData);
        setSelectedStatus(orderData.status);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;
    setIsUpdatingStatus(true);
    setError(null);
    try {
      const response = await axios.put(`/api/orders/${id}`, {
        id,
        status: selectedStatus,
      });
      if (response.status === 200) {
        setOrder((prevOrder) => ({ ...prevOrder, status: selectedStatus }));
      } else {
        setError('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/shipping', {
        email: order.email,
        orderId: order.id,
        shippingMethod: order.shippingMethod,
        shippingTerms: order.shippingTerms,
        shipmentDate: order.shipmentDate,
        deliveryDate: order.deliveryDate,
      });
      if (response.status === 200) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          shippingMethod: order.shippingMethod,
          shippingTerms: order.shippingTerms,
          shipmentDate: order.shipmentDate,
          deliveryDate: order.deliveryDate,
        }));
      } else {
        setError('Failed to update shipping information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating shipping information:', error);
      setError('Failed to update shipping information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading Order Details..." />;
  }

  if (error && !order) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => router.push('/admin/pages/orders')}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  // Calculate order amounts
  const subtotal = order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const subtotalLessDiscount = subtotal - (order.discount ?? 0);
  const totalTax = order.tax ?? 0;
  const total =
    subtotalLessDiscount +
    totalTax +
    (order.deliveryCharge ?? 0) +
    (order.extraDeliveryCharge ?? 0) +
    (order.otherCharges ?? 0);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'info',
      SHIPPED: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 3,
      }}
    >
      <Fade in timeout={600}>
        <Box>
          {/* Header Card */}
          <Grow in timeout={400}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 8px 30px rgba(255, 89, 0, 0.3)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Tooltip title="Back to Orders" arrow>
                    <IconButton
                      onClick={() => router.push('/admin/pages/orders')}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Created on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
      </Typography>
                  </Box>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      px: 1,
                      height: 32,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grow>

          <Grid container spacing={3}>
            {/* Left Column - Main Order Info */}
            <Grid item xs={12} lg={8}>
              {/* General Information */}
              <Grow in timeout={600}>
                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#6366f1' }} />
                      Order Information
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#F9FAFB',
                            border: '1px solid rgba(255, 89, 0, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            Order Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                            {new Date(order.createdAt).toLocaleString()}
              </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#F9FAFB',
                            border: '1px solid rgba(255, 89, 0, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            Order Status
                </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                      label="Status"
                                disabled={isUpdatingStatus}
                                sx={{
                                  borderRadius: 2,
                                  '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6366f1',
                                    },
                                  },
                                }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                      <MenuItem value="SHIPPED">Shipped</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    size="small"
                              onClick={handleStatusChange}
                              disabled={
                                isUpdatingStatus || !selectedStatus || selectedStatus === order.status
                              }
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                },
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600,
                              }}
                            >
                              {isUpdatingStatus ? <CircularProgress size={20} color="inherit" /> : 'Update'}
                  </Button>
                </Box>
              </Box>
            </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#F9FAFB',
                            border: '1px solid rgba(255, 89, 0, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            Customer ID
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                            {order.userId}
                </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#F9FAFB',
                            border: '1px solid rgba(255, 89, 0, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            Payment Method
                  </Typography>
                          <Chip
                            label={order.paymentMethod || 'N/A'}
                            variant="outlined"
                            sx={{
                              borderColor: '#6366f1',
                              color: '#6366f1',
                              fontWeight: 600,
                            }}
                          />
                </Box>
            </Grid>
          </Grid>
                  </CardContent>
                </Card>
              </Grow>

              {/* Shipping Address */}
              <Grow in timeout={800}>
                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <LocationOnIcon sx={{ color: '#6366f1' }} />
                      Shipping Address
                    </Typography>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: '#F9FAFB',
                        border: '1px solid rgba(255, 89, 0, 0.1)',
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        {order.streetAddress && (
                          <>
                            {order.streetAddress}
                            {order.apartmentSuite && `, ${order.apartmentSuite}`}
                            <br />
                          </>
                        )}
                        {order.city && `${order.city}, `}
                        {order.state && `${order.state} `}
                        {order.zip && `${order.zip}`}
                        <br />
                        {order.country}
                      </Typography>
                      {order.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                          <EmailIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {order.email}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Order Items */}
              <Grow in timeout={1000}>
                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <ShoppingCartIcon sx={{ color: '#6366f1' }} />
                        Order Items ({order.orderItems.length})
                      </Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: '500px' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Qty</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Unit Price</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Color</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: '#F9FAFB' }}>Size</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems.map((item, index) => (
                            <TableRow
                              key={item.id}
                              sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 89, 0, 0.05)',
                                },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>{index + 1}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.product ? item.product.name : 'Unknown Product'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {item.product && item.product.images && item.product.images.length > 0 ? (
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      border: '2px solid rgba(255, 89, 0, 0.2)',
                                    }}
                                  >
                                    <Image
                                      width={60}
                                      height={60}
                                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${item.product.images[0].url}`}
                                      alt={item.product.name}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      bgcolor: '#e5e7eb',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <ShoppingCartIcon sx={{ color: '#9ca3af' }} />
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip label={item.quantity} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Rs. {parseFloat(item.price).toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                                  Rs. {(item.quantity * item.price).toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {item.selectedColor ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        bgcolor: item.selectedColor || '#ccc',
                                        border: '2px solid rgba(0,0,0,0.1)',
                                      }}
                                    />
                                    <Typography variant="caption">{item.selectedColor}</Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.selectedSize ? (
                                  <Chip label={item.selectedSize} size="small" variant="outlined" />
                                ) : (
                                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grow>

          {/* Shipping Information Form */}
              {order && (
                <Grow in timeout={1200}>
                  <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <LocalShippingIcon sx={{ color: '#6366f1' }} />
              Shipping Information
            </Typography>
            <form onSubmit={handleShippingSubmit}>
                        <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Shipping Method"
                    value={order.shippingMethod || ''}
                              onChange={(e) =>
                                setOrder((prevOrder) => ({ ...prevOrder, shippingMethod: e.target.value }))
                              }
                    variant="outlined"
                    size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Shipping Details"
                    value={order.shippingTerms || ''}
                              onChange={(e) =>
                                setOrder((prevOrder) => ({ ...prevOrder, shippingTerms: e.target.value }))
                              }
                    variant="outlined"
                    size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Shipment Date"
                    type="date"
                              value={order.shipmentDate ? new Date(order.shipmentDate).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setOrder((prevOrder) => ({
                        ...prevOrder,
                        shipmentDate: e.target.value,
                      }))
                    }
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    onKeyDown={(e) => e.preventDefault()}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Delivery Date"
                    type="date"
                              value={order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setOrder((prevOrder) => ({
                        ...prevOrder,
                        deliveryDate: e.target.value,
                      }))
                    }
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    onKeyDown={(e) => e.preventDefault()}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                  />
                </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                },
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                              }}
                            >
                  Update Shipping Information
                </Button>
                          </Grid>
                        </Grid>
            </form>
                    </CardContent>
                  </Card>
                </Grow>
              )}
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} lg={4}>
              <Grow in timeout={800}>
                <Card
                  sx={{
                    position: 'sticky',
                    top: 20,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <ReceiptIcon sx={{ color: '#6366f1' }} />
                      Order Summary
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Subtotal:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Rs. {subtotal.toLocaleString()}
                        </Typography>
          </Box>

                      {order.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Discount:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                            - Rs. {(order.discount ?? 0).toLocaleString()}
            </Typography>
                        </Box>
                      )}

                      <Divider />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          After Discount:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Rs. {subtotalLessDiscount.toLocaleString()}
                        </Typography>
          </Box>

                      {totalTax > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Tax:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {totalTax.toFixed(2)}
                </Typography>
              </Box>
                      )}

                      {(order.deliveryCharge ?? 0) > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Delivery:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {(order.deliveryCharge ?? 0).toFixed(2)}
                </Typography>
              </Box>
                      )}

                      {(order.extraDeliveryCharge ?? 0) > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            COD Charges:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {(order.extraDeliveryCharge ?? 0).toFixed(2)}
                </Typography>
              </Box>
                      )}

                      {(order.otherCharges ?? 0) > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Other Charges:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {(order.otherCharges ?? 0).toFixed(2)}
                </Typography>
              </Box>
                      )}

                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'linear-gradient(135deg, rgba(255, 89, 0, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '2px solid rgba(255, 89, 0, 0.2)',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1' }}>
                          Total:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#6366f1' }}>
                          Rs. {total.toLocaleString()}
              </Typography>
                </Box>
              </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
            </Box>
      </Fade>
    </Box>
  );
};

export default AdminOrdersPage;
