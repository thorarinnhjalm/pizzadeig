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
    return null;
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-(--color-border) shadow-sm bg-gray-100">
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
