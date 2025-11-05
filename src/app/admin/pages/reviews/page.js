'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FilterableReviewTable from './Filterabletable';
import PageLoader from '../../../components/PageLoader';

export default function ReviewsPage() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  if (loading) {
    return <PageLoader message="Loading Reviews..." />;
  }

  return (
    <FilterableReviewTable
      reviews={reviews}
      fetchReviews={fetchReviews}
      products={products}
    />
  );
}
