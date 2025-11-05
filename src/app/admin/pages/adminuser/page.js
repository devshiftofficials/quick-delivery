'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FilterableTable from './FilterableTable';
import PageLoader from '../../../components/PageLoader';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin');
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading Admin Users..." />;
  }

  return <FilterableTable data={data} fetchData={fetchData} />;
}
