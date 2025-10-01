"use client";

import { useMapbox, type Location } from "@/hooks/use-mapbox";

interface LocationsMapProps {
  locations: Location[];
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const { mapContainer, isLoading, error } = useMapbox(locations, accessToken);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">
            {error === "Mapbox access token is required" 
              ? "Map configuration needed" 
              : "Unable to load map"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
