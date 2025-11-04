'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageProps } from '../../../util/imageUrl';

export default function VendorsListPage() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/vendors');
      const json = await res.json();
      if (json.status) setVendors(json.data);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vendors.map(v => (
          <Link key={v.id} href={`/customer/pages/vendors/${v.slug}`} className="block border rounded shadow hover:shadow-lg transition">
            <div className="relative w-full h-32 bg-white">
              <Image width={600} height={200} {...getImageProps(v.banner || v.logo, v.name, { className: 'w-full h-32 object-contain' })} />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Image width={40} height={40} {...getImageProps(v.logo, v.name, { className: 'w-10 h-10 object-contain rounded' })} />
                <h2 className="font-semibold">{v.name}</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{v.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


