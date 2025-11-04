'use client';

import React from 'react';

// This layout file is deprecated - the root layout at src/app/vendor/layout.js handles layout
// Keeping this file for backward compatibility but it just returns children
const VendorLayout = ({ children }) => {
  return <>{children}</>;
};

export default VendorLayout;
