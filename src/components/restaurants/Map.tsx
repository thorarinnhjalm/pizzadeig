'use client';

import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Restaurant } from '@/types/restaurant';

interface Props {
  restaurants: Restaurant[];
  focusedRestaurantId?: string;
  onMarkerClick?: (id: string) => void;
}

export function Map({ restaurants, focusedRestaurantId, onMarkerClick }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Default to Reykjavik center if no restaurants provided
  const defaultCenter = { lat: 64.1466, lng: -21.9426 };
  const center = restaurants.length > 0 
    ? { lat: restaurants[0].location.latitude, lng: restaurants[0].location.longitude } 
    : defaultCenter;

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[var(--color-bg-secondary)] flex flex-col items-center justify-center text-center p-8 border border-[var(--color-border)] rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=64.1466,-21.9426&zoom=13&size=800x800&key=INVALID')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10 bg-[var(--color-bg-secondary)]/80 p-6 rounded-xl backdrop-blur-sm border border-gray-100 shadow-sm max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
            <span className="text-2xl">🗺️</span>
          </div>
          <p className="text-[var(--color-text-primary)] font-bold text-lg mb-2">Kort vantar API Lykil</p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Til þess að sýna kortið þarf að setja inn <code className="bg-gray-100 px-1 py-0.5 rounded text-[var(--color-brand)]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> í <code className="bg-gray-100 px-1 py-0.5 rounded text-[var(--color-brand)]">.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm bg-gray-100">
      <APIProvider apiKey={apiKey}>
        <GoogleMap
          defaultCenter={center}
          defaultZoom={13}
          mapId="PIZZA_STADIR_MAP"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
        >
          {restaurants.map((r) => {
            const isFocused = r.id === focusedRestaurantId;
            return (
              <AdvancedMarker 
                key={r.id} 
                position={{ lat: r.location.latitude, lng: r.location.longitude }}
                onClick={() => onMarkerClick?.(r.id)}
              >
                <Pin 
                  background={isFocused ? '#E63946' : '#F1FAEE'} 
                  borderColor={isFocused ? '#1D3557' : '#E63946'} 
                  glyphColor={isFocused ? '#fff' : '#E63946'} 
                  scale={isFocused ? 1.4 : 1.1}
                />
              </AdvancedMarker>
            );
          })}
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
