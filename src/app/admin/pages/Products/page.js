'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';
import PageLoader from '../../../components/PageLoader';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Handle both array and object responses
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.status === false) {
        console.error('API Error:', data.message || data.error);
        setProducts([]);
      } else {
      setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const result = await response.json();

      if (result.status) {
        setSubcategories(result.data); // Extracting data array from result
        console.log('Subcategories:', subcategories); // Logging the fetched subcategories
      } else {
        console.error('Failed to fetch subcategories:', result.message);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSubcategories(),
        fetchColors(),
        fetchSizes()
      ]);
      setIsLoading(false);
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading Products..." />;
  }

  return (
    <FilterableTable
      products={products}
      fetchProducts={fetchProducts}
      categories={categories}
      subcategories={subcategories}
      colors={colors}
      sizes={sizes}
    />
  );
};

export default ProductPage;
