'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageProps } from '../../../../util/imageUrl';

export default function VendorStorefrontPage() {
  const params = useParams();
  const slug = params?.slug;
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const vres = await fetch(`/api/vendors/slug/${slug}`);
      const vjson = await vres.json();
      if (!vjson.status) return;
      setVendor(vjson.data);
      const pres = await fetch(`/api/products/by-vendor/${vjson.data.id}`);
      const pjson = await pres.json();
      if (pjson.status) setProducts(pjson.data);
    };
    load();
  }, [slug]);

  if (!vendor) return <div className="container mx-auto p-4">Loading vendor...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="relative w-full h-48 mb-4 bg-white rounded">
        <Image width={1200} height={300} {...getImageProps(vendor.banner || vendor.logo, vendor.name, { className: 'w-full h-48 object-contain' })} />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Image width={60} height={60} {...getImageProps(vendor.logo, vendor.name, { className: 'w-16 h-16 object-contain rounded' })} />
        <div>
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          {vendor.description && <p className="text-gray-600">{vendor.description}</p>}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/customer/pages/products/${p.slug}`} className="block border rounded p-2 bg-white hover:shadow transition">
            <div className="relative w-full h-40">
              <Image width={600} height={400} {...getImageProps((p.images?.[0]?.url), p.name, { className: 'w-full h-40 object-contain' })} />
            </div>
            <div className="mt-2">
              <div className="font-medium line-clamp-1">{p.name}</div>
              <div className="text-blue-600 font-semibold">Rs. {p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


