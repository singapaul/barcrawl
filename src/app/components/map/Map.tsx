import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useEffect, useState, useRef, useCallback } from 'react';

export type MarkerType = {
  name: string;
  lat: number;
  lng: number;
  type?: 'pub' | 'restaurant' | 'bar' | 'default' | 'landmark';
};

export type MapProps = {
  markers: MarkerType[];
  onMarkerClick?: (marker: MarkerType) => void;
  activeMarkerId?: string;
  resetMap?: (fitBoundsCallback: () => void) => void;
};

const DEFAULT_CENTER = { lat: 51.507351, lng: -0.127758 };
const DEFAULT_ZOOM = 12;
const MARKER_ZOOM = 18;

const markerIcons = {
  pub: {
    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    scaledSize: { width: 32, height: 32 },
  },
  landmark: {
    url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    scaledSize: { width: 32, height: 32 },
  },
  bar: {
    url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    scaledSize: { width: 32, height: 32 },
  },
  default: {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: { width: 32, height: 32 },
  },
};

export const Map = ({
  markers,
  onMarkerClick,
  activeMarkerId,
  resetMap,
}: MapProps) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  // Add state for selected marker
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  const boundsTransitionDuration = 1000;

  const getMarkerIcon = (type: MarkerType['type'] = 'default') => {
    const icon = markerIcons[type as keyof typeof markerIcons];
    return {
      url: icon.url,
      scaledSize: new google.maps.Size(
        icon.scaledSize.width,
        icon.scaledSize.height
      ),
    };
  };

  const panToMarker = useCallback((marker: MarkerType) => {
    if (mapRef.current) {
      const position = new google.maps.LatLng(marker.lat, marker.lng);
      mapRef.current.panTo(position);

      const currentZoom = mapRef.current.getZoom() || DEFAULT_ZOOM;
      const steps = 10;
      const zoomDiff = MARKER_ZOOM - currentZoom;
      const stepDuration = boundsTransitionDuration / steps;

      let step = 0;
      const zoomInterval = setInterval(() => {
        if (step < steps && mapRef.current) {
          const newZoom = currentZoom + (zoomDiff * (step + 1)) / steps;
          mapRef.current.setZoom(newZoom);
          step++;
        } else {
          clearInterval(zoomInterval);
        }
      }, stepDuration);
    }
  }, []);

  useEffect(() => {
    if (activeMarkerId && markers.length > 0) {
      const activeMarker = markers[parseInt(activeMarkerId)];
      if (activeMarker) {
        panToMarker(activeMarker);
        setSelectedMarker(activeMarker); // Show InfoWindow for active marker
      }
    }
  }, [activeMarkerId, markers, panToMarker]);

  useEffect(() => {
    setIsBrowser(true);

    if (isBrowser && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation(DEFAULT_CENTER);
        }
      );
    } else if (isBrowser) {
      console.error('Geolocation is not supported by this browser.');
      setUserLocation(DEFAULT_CENTER);
    }
  }, [isBrowser]);

  const fitBounds = useCallback(() => {
    if (mapRef.current && markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      markers.forEach((marker) => {
        bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
      });

      if (userLocation) {
        bounds.extend(
          new google.maps.LatLng(userLocation.lat, userLocation.lng)
        );
      }

      mapRef.current.fitBounds(bounds);

      if (markers.length === 1) {
        const listener = google.maps.event.addListener(
          mapRef.current,
          'idle',
          () => {
            if (mapRef.current) {
              mapRef.current.setZoom(
                Math.min(mapRef.current.getZoom() ?? DEFAULT_ZOOM, 15)
              );
              google.maps.event.removeListener(listener);
            }
          }
        );
      }
    }
  }, [markers, userLocation]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    fitBounds();
  };

  useEffect(() => {
    if (resetMap) {
      // Expose the `fitBounds` function to the parent component
      resetMap(() => fitBounds());
    }
  }, [fitBounds, resetMap]);

  useEffect(() => {
    if (markers.length > 0) {
      const avgLat =
        markers.reduce((acc, marker) => acc + marker.lat, 0) / markers.length;
      const avgLng =
        markers.reduce((acc, marker) => acc + marker.lng, 0) / markers.length;
      setCenter({ lat: avgLat, lng: avgLng });
      fitBounds();
    }
  }, [markers, fitBounds]);

  // Handle marker click
  const handleMarkerClick = (marker: MarkerType) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  if (!isBrowser) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyBiEcw2PRII_LoPXB1ygDnH8uVH5raC91o">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={center || userLocation || DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onLoad}
        onClick={() => setSelectedMarker(null)} // Close InfoWindow when clicking on map
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name}
            icon={getMarkerIcon(marker.type)}
            animation={google.maps.Animation.DROP}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{selectedMarker.name}</h3>
              <p className="text-sm text-gray-600">
                Type: {selectedMarker.type || 'Default'}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
