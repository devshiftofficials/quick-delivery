'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FilterableCustomerTable from './FilterableCustomerTable';
import PageLoader from '../../../components/PageLoader';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading Customers..." />;
  }

  return (
    <FilterableCustomerTable
      customers={customers}
      fetchCustomers={fetchData}
    />
  );
}
