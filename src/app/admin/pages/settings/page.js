'use client';

import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';
import PageLoader from '../../../components/PageLoader';

const SettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings([data]);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading Settings..." />;
  }

  return (
    <div>
      <FilterableTable settings={settings} fetchSettings={fetchSettings} />
    </div>
  );
};

export default SettingsPage;
