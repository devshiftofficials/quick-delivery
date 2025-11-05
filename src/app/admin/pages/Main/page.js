'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// MUI Imports
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  Fade,
  Grow,
  Skeleton,
} from '@mui/material';
import PageLoader from '../../../components/PageLoader';
// Lucide Icons
import {
  Package as InventoryIcon,
  CreditCard as PaymentIcon,
  Truck as LocalShippingIcon,
  CheckCircle2 as CheckCircleIcon,
  XCircle as CancelIcon,
  Store as StoreIcon,
  Building2 as StorefrontIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Users as PeopleIcon,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Animated number counter component
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    animate();
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default function Home() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statsData, setStatsData] = useState(null);
  const [vendorStats, setVendorStats] = useState(null);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        const res = await fetch('/api/vendors');
        const data = await res.json();
        if (data.status && data.data) {
          const vendors = data.data || [];
          const activeVendors = vendors.filter(v => v.status === 'active').length;
          const inactiveVendors = vendors.filter(v => v.status !== 'active').length;
          
          setVendorStats({
            total: vendors.length,
            active: activeVendors,
            inactive: inactiveVendors,
          });
        }
      } catch (e) {
        console.error('Failed to fetch vendor stats', e);
      }
    };
    fetchVendorStats();
  }, []);

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const date1 = startDate.toISOString().split('T')[0];
      const date2 = endDate.toISOString().split('T')[0];

      const response = await fetch('/api/dashboard/allorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date1, date2 }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatsData(result.data);

        const salesLabels = [];
        const pendingAmounts = [];
        const paidAmounts = [];
        const shippedAmounts = [];
        const completedAmounts = [];
        const cancelledAmounts = [];

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          salesLabels.push(
            currentDate.toLocaleDateString('default', {
              month: 'short',
              day: 'numeric',
            })
          );

          const totalPending = result.data.pending?.amount || 0;
          const totalPaid = result.data.paid?.amount || 0;
          const totalShipped = result.data.shipped?.amount || 0;
          const totalCompleted = result.data.completed?.amount || 0;
          const totalCancelled = result.data.cancelled?.amount || 0;

          pendingAmounts.push(totalPending);
          paidAmounts.push(totalPaid);
          shippedAmounts.push(totalShipped);
          completedAmounts.push(totalCompleted);
          cancelledAmounts.push(totalCancelled);

          currentDate.setDate(currentDate.getDate() + 1);
        }

        setSalesData({
          labels: salesLabels,
          datasets: [
            {
              label: 'Pending',
              data: pendingAmounts,
              borderColor: '#FBBF24',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Paid',
              data: paidAmounts,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Shipped',
              data: shippedAmounts,
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Completed',
              data: completedAmounts,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Cancelled',
              data: cancelledAmounts,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              tension: 0.4,
            },
          ],
        });
      } else {
        console.error('Failed to fetch data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  if (loading && !statsData) {
    return <PageLoader message="Loading Dashboard..." />;
  }

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  };

  const storeStats = useMemo(() => {
    return [
      {
        label: 'Total Stores',
        value: vendorStats?.total || 0,
        icon: <StoreIcon size={32} />,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        iconBg: 'rgba(99, 102, 241, 0.2)',
        iconColor: '#6366f1',
      },
      {
        label: 'Active Stores',
        value: vendorStats?.active || 0,
        icon: <StorefrontIcon size={32} />,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        iconBg: 'rgba(245, 87, 108, 0.2)',
        iconColor: '#f5576c',
      },
      {
        label: 'Inactive Stores',
        value: vendorStats?.inactive || 0,
        icon: <CancelIcon size={32} />,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        iconBg: 'rgba(79, 172, 254, 0.2)',
        iconColor: '#4facfe',
      },
    ];
  }, [vendorStats]);

  const stats = useMemo(() => {
    return [
      {
        label: 'Pending Orders',
        value: statsData?.pending?.count || 0,
        amount: statsData?.pending?.amount || 0,
        icon: <InventoryIcon size={32} />,
        gradient: 'linear-gradient(135deg, #fad961 0%, #f76b1c 100%)',
        iconBg: 'rgba(251, 191, 36, 0.2)',
        iconColor: '#FBBF24',
      },
      {
        label: 'Paid Orders',
        value: statsData?.paid?.count || 0,
        amount: statsData?.paid?.amount || 0,
        icon: <PaymentIcon size={32} />,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        iconBg: 'rgba(59, 130, 246, 0.2)',
        iconColor: '#3B82F6',
      },
      {
        label: 'Shipped Orders',
        value: statsData?.shipped?.count || 0,
        amount: statsData?.shipped?.amount || 0,
        icon: <LocalShippingIcon size={32} />,
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        iconBg: 'rgba(99, 102, 241, 0.2)',
        iconColor: '#6366F1',
      },
      {
        label: 'Completed Orders',
        value: statsData?.completed?.count || 0,
        amount: statsData?.completed?.amount || 0,
        icon: <CheckCircleIcon size={32} />,
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        iconBg: 'rgba(16, 185, 129, 0.2)',
        iconColor: '#10B981',
      },
      {
        label: 'Cancelled Orders',
        value: statsData?.cancelled?.count || 0,
        amount: statsData?.cancelled?.amount || 0,
        icon: <CancelIcon size={32} />,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        iconBg: 'rgba(239, 68, 68, 0.2)',
        iconColor: '#EF4444',
      },
    ];
  }, [statsData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Sales Overview',
        font: {
          family: 'Inter, sans-serif',
          size: 20,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box
      sx={{
        pt: 3,
        minHeight: '100vh',
        bgcolor: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl" sx={{ px: 3, position: 'relative', zIndex: 1 }}>

        {/* Date Filter Section */}
        <Grow in timeout={1000}>
          <Paper
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { md: 'space-between' },
            alignItems: 'center',
            gap: 2,
          }}
        >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start date"
              customInput={<TextField variant="outlined" size="small" sx={{ minWidth: 150 }} />}
            />
            <Typography>-</Typography>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End date"
              customInput={<TextField variant="outlined" size="small" sx={{ minWidth: 150 }} />}
            />
            <Button
              variant="contained"
              onClick={handleFilter}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
            >
              Filter
            </Button>
          </Box>
        </Box>
          </Paper>
        </Grow>

        {/* Store Statistics Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#1a202c',
            }}
          >
            Store Statistics
          </Typography>
          <Grid container spacing={3}>
            {storeStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Grow in timeout={(index + 1) * 200}>
                <Card
                      sx={{
                        p: 0,
                        borderRadius: 3,
                        background: stat.gradient,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 200,
                          height: 200,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          transition: 'all 0.5s ease',
                        },
                        '&:hover::before': {
                          transform: 'scale(1.5)',
                          opacity: 0.5,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                opacity: 0.9,
                                mb: 1,
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                fontSize: '0.75rem',
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                              }}
                            >
                              {loading ? (
                                <Skeleton variant="text" width={80} />
                              ) : (
                                <AnimatedNumber value={stat.value} />
                              )}
                            </Typography>
                          </Box>
                          <Box
                  sx={{
                    p: 2,
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                  }}
                >
                            {stat.icon}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>

        {/* Order Statistics Cards */}
        <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#1a202c',
              }}
            >
              Order Statistics
            </Typography>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <Grow in timeout={(index + 4) * 150}>
                    <Card
                      sx={{
                        p: 0,
                        borderRadius: 3,
                        background: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '180px',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                          '& .icon-container': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: stat.gradient,
                        }}
                      />
                      <CardContent 
                        sx={{ 
                          p: 3,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          flex: 1,
                          gap: 2,
                        }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#1a202c',
                                mb: 1.5,
                                fontWeight: 700,
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                lineHeight: 1.4,
                              }}
                            >
                        {stat.label}
                      </Typography>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 'bold',
                                mb: 0.5,
                                color: '#1a202c',
                                fontSize: { xs: '1.75rem', md: '2rem' },
                                lineHeight: 1.2,
                              }}
                            >
                              {loading ? (
                                <Skeleton variant="text" width={60} />
                              ) : (
                                <AnimatedNumber value={stat.value} />
                              )}
                      </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#9ca3af',
                                fontSize: '0.875rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {loading ? (
                                <Skeleton variant="text" width={100} />
                              ) : (
                                `Rs. ${stat.amount.toLocaleString()}`
                              )}
                      </Typography>
                          </Box>
                          <Box
                            className="icon-container"
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: stat.iconBg,
                              color: stat.iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.3s ease',
                              flexShrink: 0,
                            }}
                          >
                            {stat.icon}
                          </Box>
                    </Box>
                  </CardContent>
                </Card>
                  </Grow>
              </Grid>
            ))}
          </Grid>
          </Box>

        {/* Sales Chart */}
        <Grow in timeout={1500}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#1a202c',
              }}
            >
            Sales Overview
          </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            ) : (
          <Line data={salesData} options={options} />
            )}
        </Paper>
        </Grow>
      </Container>
    </Box>
  );
}
