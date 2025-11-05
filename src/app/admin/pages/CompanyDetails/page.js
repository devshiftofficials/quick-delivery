"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Fade,
  Grow,
} from "@mui/material";
import PageLoader from '../../../components/PageLoader';
import { Business as BusinessIcon, Image as ImageIcon } from '@mui/icons-material';

const CompanyDetailsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headerImage: "",
    favIcon: "",
  });
  const [companyDetails, setCompanyDetails] = useState(null);
  const [headerImageFile, setHeaderImageFile] = useState(null);
  const [favIconFile, setFavIconFile] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [favIconPreview, setFavIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCompanyDetails() {
      setLoading(true);
      try {
        const response = await fetch("/api/companydetails");
        const data = await response.json();
        if (data) {
          setCompanyDetails(data);
          setFormData({
            name: data.name || "",
            description: data.description || "",
            headerImage: data.headerImage || "",
            favIcon: data.favIcon || "",
          });
          setHeaderImagePreview(
            data.headerImage
              ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${data.headerImage}`
              : null
          );
          setFavIconPreview(
            data.favIcon
              ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${data.favIcon}`
              : null
          );
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "headerImage") {
      setHeaderImageFile(file);
      setHeaderImagePreview(URL.createObjectURL(file));
    } else if (name === "favIcon") {
      setFavIconFile(file);
      setFavIconPreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImage = async (base64Image, type) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image, type: type }),
      });
      const result = await response.json();
      return result.url || result.image_url || null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let headerImageUrl = formData.headerImage;
    let favIconUrl = formData.favIcon;

    if (headerImageFile) {
      const headerImageBase64 = await convertToBase64(headerImageFile);
      const uploadedHeaderImageUrl = await uploadImage(headerImageBase64);
      if (uploadedHeaderImageUrl) headerImageUrl = uploadedHeaderImageUrl;
    }

    if (favIconFile) {
      const favIconBase64 = await convertToBase64(favIconFile);
      const uploadedFavIconUrl = await uploadImage(favIconBase64, "ico");
      if (uploadedFavIconUrl) favIconUrl = uploadedFavIconUrl;
    }

    const updatedFormData = {
      ...formData,
      headerImage: headerImageUrl,
      favIcon: favIconUrl,
    };

    try {
      if (companyDetails && companyDetails.id) {
        await fetch(`/api/companydetails/${companyDetails.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });
      } else {
        const response = await fetch("/api/companydetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });
        const data = await response.json();
        setCompanyDetails(data);
      }
      alert("Company details saved successfully!");
    } catch (error) {
      console.error("Error saving company details:", error);
      alert("Failed to save company details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading Company Details..." />;
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Fade in timeout={800}>
      <Grid container spacing={4}>
            {/* Form Section */}
        <Grid item xs={12} md={6}>
              <Grow in timeout={600}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #ff5900 0%, #e2552b 100%)',
                      color: 'white',
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Company Details
            </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                        label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                        required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                multiline
                        rows={4}
              />
              <TextField
                label="Header Image"
                type="file"
                name="headerImage"
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
              />
              <TextField
                label="Favicon"
                type="file"
                name="favIcon"
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                        size="large"
                        disabled={saving}
                        sx={{
                          background: 'linear-gradient(135deg, #ff5900 0%, #e2552b 100%)',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #e2552b 0%, #ff5900 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(255, 89, 0, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
              >
                        {saving ? 'Saving...' : (companyDetails ? 'Update Company Details' : 'Save Company Details')}
              </Button>
            </Box>
                  </CardContent>
                </Card>
              </Grow>
        </Grid>

            {/* Preview Section */}
        <Grid item xs={12} md={6}>
              <Grow in timeout={800}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    bgcolor: '#f9fafb',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #ff5900 0%, #e2552b 100%)',
                      color: 'white',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Image Previews
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      {headerImagePreview ? (
              <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Header Image Preview
                </Typography>
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              border: '2px solid #ff5900',
                            }}
                          >
                <Image
                              width={300}
                              height={200}
                  src={headerImagePreview}
                  alt="Header Preview"
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", p: 4 }}>
                          <ImageIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            No header image selected
                          </Typography>
              </Box>
            )}
                      {favIconPreview ? (
              <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Favicon Preview
                </Typography>
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              border: '2px solid #ff5900',
                              display: 'inline-block',
                            }}
                          >
                <Image
                              width={64}
                  height={64}
                  src={favIconPreview}
                  alt="Favicon Preview"
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", p: 4 }}>
                          <ImageIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            No favicon selected
                          </Typography>
              </Box>
            )}
          </Box>
                  </CardContent>
                </Card>
              </Grow>
        </Grid>
      </Grid>
        </Fade>
      </Box>
    </Box>
  );
};

export default CompanyDetailsPage;
