'use client'
import React, { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';
import PageLoader from '../../../components/PageLoader';

const TopRatedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch('/api/products/topRated');
        const data = await response.json();
        setProducts(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch top-rated products', error);
        setIsLoading(false);
      }
    };

    fetchTopRatedProducts();
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading Top Rated Products..." />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <FilterableTable products={products} />
    </div>
  );
};

export default TopRatedProductsPage;
