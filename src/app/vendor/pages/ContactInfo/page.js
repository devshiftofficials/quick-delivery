'use client';
import { useState, useEffect } from 'react';
import VendorLayout from '../layout';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Grow,
  InputAdornment,
} from '@mui/material';
import PageLoader from '../../../components/PageLoader';
// Lucide Icons
import { Mail, Phone, MapPin, Globe, User, MessageCircle } from 'lucide-react';

const VendorContactInfoPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    owner: '',
  });
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContactInfo() {
      setIsInitialLoading(true);
      setIsLoading(true);
      try {
        const response = await axios.get('/api/contactinfo');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const existingContact = response.data[0];
          setContactInfo(existingContact);
          setFormData({
            phoneNumber: existingContact.phoneNumber || '',
            email: existingContact.email || '',
            address: existingContact.address || '',
            website: existingContact.website || '',
            owner: existingContact.owner || '',
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    }
    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (contactInfo && contactInfo.id) {
        await axios.put(`/api/contactinfo/${contactInfo.id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        const response = await axios.post('/api/contactinfo', formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        setContactInfo(response.data);
      }
      alert('Contact information saved successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact information.');
    } finally {
      setSaving(false);
    }
  };

  const fieldConfig = [
    { name: 'phoneNumber', label: 'Phone Number', icon: Phone },
    { name: 'email', label: 'Email', icon: Mail, type: 'email' },
    { name: 'address', label: 'Address', icon: MapPin, multiline: true, rows: 3 },
    { name: 'website', label: 'Website', icon: Globe },
    { name: 'owner', label: 'Owner', icon: User },
  ];

  if (isInitialLoading) {
    return <PageLoader message="Loading Contact Information..." />;
  }

  return (
    <VendorLayout>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '100%' }}>
        <Container maxWidth="md" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 }, py: 2, pt: 2 }}>
          <Fade in timeout={800}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Grow in timeout={600}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <MessageCircle size={64} style={{ opacity: 0.9, color: 'white' }} />
                  </Box>
                </Grow>
                <Grow in timeout={800}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Contact Information
          </Typography>
                </Grow>
              </Box>
              <CardContent sx={{ p: 4 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
                ) : (
                  <Fade in timeout={1000}>
          <form onSubmit={handleSubmit}>
                      {fieldConfig.map((field, index) => {
                        const IconComponent = field.icon;
                        return (
                          <Grow in timeout={(index + 1) * 100} key={field.name}>
                <TextField
                  fullWidth
                              label={field.label}
                              name={field.name}
                              type={field.type || 'text'}
                              value={formData[field.name]}
                  onChange={handleInputChange}
                  variant="outlined"
                              multiline={field.multiline}
                              rows={field.rows}
                              sx={{ mb: 3 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <IconComponent size={20} style={{ color: '#6366f1' }} />
                                  </InputAdornment>
                                ),
                              }}
                />
                          </Grow>
                        );
                      })}

            <Button
              type="submit"
              variant="contained"
              fullWidth
                        size="large"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <MessageCircle size={20} />}
              sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          mt: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                          },
                          transition: 'all 0.3s ease',
              }}
            >
                        {saving ? 'Saving...' : (contactInfo ? 'Update Contact Info' : 'Save Contact Info')}
            </Button>
          </form>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Fade>
      </Container>
      </Box>
    </VendorLayout>
  );
};

export default VendorContactInfoPage;
