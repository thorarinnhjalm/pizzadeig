'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

interface KrProduct {
  sku: string;
  name: string;
  price: number;
  thumbnail: string;
  priceInfo?: string;
}

interface Props {
  sku: string | null;
  onLoadPrice?: (price: number) => void;
  lang?: 'is' | 'en';
}

export function KronanBubble({ sku, onLoadPrice, lang = 'is' }: Props) {
  const [product, setProduct] = useState<KrProduct | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sku) return;
    
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/kronan/product?sku=${sku}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProduct(data);
            if (onLoadPrice && data.price) {
              onLoadPrice(data.price);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch Kronan product proxy', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchProduct();
    return () => { isMounted = false; };
  }, [sku]); // Removed onLoadPrice from deps to avoid infinite loops if it changes

  if (!sku) return null;
  if (loading) {
    return <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full inline-block ml-3"></div>;
  }
  if (!product) return null;

  return (
    <a 
      href={`https://kronan.is/leita?q=${sku}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-2 py-1 ml-3 rounded-full border border-yellow-500 shadow-sm transition-transform hover:-translate-y-0.5 text-xs font-bold"
      title={lang === 'is' ? `Fæst í Krónunni: ${product.name}` : `Available in Kronan: ${product.name}`}
    >
      {product.thumbnail && (
         <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0 border border-yellow-300">
           {/* Not using next/image strictly if domain isn't configured, so standard img to be safe */}
           <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
         </div>
      )}
      <span className="truncate max-w-[120px]">{product.name}</span>
      <span className="text-yellow-800 ml-1">{product.price} kr.</span>
    </a>
  );
}
