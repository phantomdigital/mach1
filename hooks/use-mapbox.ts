"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// Add Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css";

export interface Location {
  address: string;
  name: string;
  type: string;
  phone?: string;
  email?: string;
}

export function useMapbox(locations: Location[], accessToken: string) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Mapbox access token is required");
      setIsLoading(false);
      return;
    }

    if (map.current || !mapContainer.current) return;

    // Set the access token
    mapboxgl.accessToken = accessToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [144.9631, -37.8136], // Default to Melbourne
      zoom: 12, // Closer zoom level
      interactive: false, // Disable all interactions
      dragPan: false, // Disable panning
      scrollZoom: false, // Disable scroll to zoom
      boxZoom: false, // Disable box zoom
      dragRotate: false, // Disable rotation
      keyboard: false, // Disable keyboard shortcuts
      doubleClickZoom: false, // Disable double-click zoom
      touchZoomRotate: false, // Disable touch zoom/rotate
    });

    // Add markers for each location
    const addMarkers = async () => {
      if (!map.current) return;

      try {
        const promises = locations.map(async (location) => {
          // Geocode the address
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              location.address
            )}.json?access_token=${accessToken}&country=AU&limit=1`
          );
          
          if (!response.ok) throw new Error("Geocoding failed");
          
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            
            // Create popup content with MACH1 styling
            const popupContent = `
              <div class="p-4 bg-white" style="background-color: #262626; color: white; border-radius: 8px;">
                <h3 class="font-semibold text-lg mb-2" style="color: #ed1e24;">${location.name}</h3>
                <p class="text-sm mb-2" style="color: #cccccc;">${location.type}</p>
                <p class="text-sm mb-2" style="color: white;">${location.address}</p>
                ${location.phone ? `<p class="text-sm mb-1" style="color: #cccccc;">Phone: <span style="color: #ed1e24;">${location.phone}</span></p>` : ''}
                ${location.email ? `<p class="text-sm" style="color: #cccccc;">Email: <span style="color: #ed1e24;">${location.email}</span></p>` : ''}
              </div>
            `;

            // Create popup with custom styling
            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false, // Remove close button for cleaner look
              closeOnClick: false, // Don't close when clicking
              closeOnMove: false, // Don't close when map moves (not applicable since map is static)
              className: 'mach1-popup'
            }).setHTML(popupContent);

            // Create marker with MACH1 red color
            new mapboxgl.Marker({
              color: "#ed1e24", // MACH1 red color
            })
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            return { lng, lat };
          }
          return null;
        });

        const coordinates = await Promise.all(promises);
        const validCoordinates = coordinates.filter(Boolean) as { lng: number; lat: number }[];

        // Fit map to show all markers
        if (validCoordinates.length > 0) {
          if (validCoordinates.length === 1) {
            // For single location, center and zoom close
            const coord = validCoordinates[0];
            map.current!.setCenter([coord.lng, coord.lat]);
            map.current!.setZoom(15); // Very close zoom for single location
          } else {
            // For multiple locations, fit bounds with closer zoom
            const bounds = new mapboxgl.LngLatBounds();
            validCoordinates.forEach(coord => bounds.extend([coord.lng, coord.lat]));
            
            map.current!.fitBounds(bounds, {
              padding: 40,
              maxZoom: 13, // Closer max zoom
            });
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error adding markers:", err);
        setError("Failed to load location data");
        setIsLoading(false);
      }
    };

    map.current.on("load", addMarkers);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations, accessToken]);

  return { mapContainer, isLoading, error };
}
