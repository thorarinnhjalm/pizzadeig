'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

interface GalleryPhoto {
  id: string;
  image_url: string;
  user_name: string;
  created_at: Timestamp;
}

interface Props {
  recipeId: string;
  locale: 'is' | 'en';
}

export function UserGallery({ recipeId, locale }: Props) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'gallery_photos'),
        where('recipe_id', '==', recipeId),
        orderBy('created_at', 'desc'),
        limit(12)
      );
      const snap = await getDocs(q);
      setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryPhoto)));
    } catch (e) {
      console.warn('Gallery fetch error:', e);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(locale === 'is' ? 'Mynd má ekki vera stærri en 5MB' : 'Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `gallery/${recipeId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'gallery_photos'), {
        recipe_id: recipeId,
        user_uid: user.uid,
        user_name: user.displayName || 'Anonymous',
        image_url: downloadURL,
        created_at: serverTimestamp(),
      });

      await fetchPhotos();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-secondary border border-border rounded-2xl p-6 md:p-8 mb-12 shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 border-b border-border/50 pb-6">
        <div>
           <h3 className="font-display font-bold text-3xl text-foreground">
             {locale === 'is' ? 'Ég gerði þessa pizzu 📸' : 'I made this! 📸'}
           </h3>
           <p className="text-muted-foreground mt-1 font-body">
             {locale === 'is' ? 'Deildu afrakstrinum með samfélaginu.' : 'Share the result with the community.'}
           </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button 
            className="btn-secondary whitespace-nowrap"
            onClick={() => user ? fileInputRef.current?.click() : alert(locale === 'is' ? 'Skráðu þig inn fyrst' : 'Please log in first')}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Camera className="w-5 h-5 mr-2" />}
            {locale === 'is' ? 'Bæta við mynd' : 'Add photo'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <div className="aspect-square relative rounded-xl overflow-hidden bg-muted border border-dashed border-border/50 group cursor-pointer hover:bg-secondary transition-colors flex flex-col items-center justify-center"
               onClick={() => user && fileInputRef.current?.click()}>
             <Camera className="w-8 h-8 text-muted-foreground mb-2" />
             <span className="font-bold text-sm text-muted-foreground px-4 text-center">
               {locale === 'is' ? 'Vertu fyrstur!' : 'Be the first!'}
             </span>
          </div>
        ) : (
          photos.map((photo) => (
            <div 
              key={photo.id} 
              className="aspect-square relative rounded-xl overflow-hidden cursor-pointer group border border-border/50"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.image_url}
                alt={`Pizza by ${photo.user_name}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-bold truncate">{photo.user_name}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-primary z-10" onClick={() => setSelectedPhoto(null)}>
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-3xl max-h-[80vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image src={selectedPhoto.image_url} alt="Gallery photo" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
