'use client';

import { Poppins } from 'next/font/google';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';
import store from './store/store';
import './globals.css';
import WhatsAppButton from './customer/components/whatsappbutton';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <html lang="en">
        <body className={poppins.className}>
          <div className='text-black'>
            <div>Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={poppins.className}>
          <div className='text-black'>
          {/* <WhatsAppButton /> Ensure WhatsAppButton is included in the layout */}
          {children}
          </div>
        </body>
      </html>
    </Provider>
  );
}
