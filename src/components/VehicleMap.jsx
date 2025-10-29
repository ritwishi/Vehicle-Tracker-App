import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Controls from './Controls';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds to route
function FitBounds({ routeData }) {
  const map = useMap();
  
  useEffect(() => {
    if (routeData && routeData.length > 0) {
      const bounds = L.latLngBounds(routeData.map(point => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeData, map]);
  
  return null;
}

// Initial map center (Hyderabad, India)
const INITIAL_CENTER = [17.385544, 78.487471];

function VehicleMap() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(2000);
  
  const intervalRef = useRef(null);
  
  // Load route data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(import.meta.env.BASE_URL + 'dummy-route.json');

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedData = data.map(point => ({
          lat: point.latitude,
          lng: point.longitude,
          timestamp: point.timestamp
        }));
        
        setRouteData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading route data:", error);
        setError("Failed to load route data. Please check if dummy-route.json exists in the public folder.");
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (isPlaying && routeData.length > 0 && currentIndex < routeData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= routeData.length - 1) {
            setIsPlaying(false);
          }
          return nextIndex;
        });
      }, simulationSpeed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, routeData, simulationSpeed]);
  
  // Control handlers
  const handlePlay = () => {
    if (currentIndex >= routeData.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  
  const handleSpeedChange = (newSpeed) => {
    setSimulationSpeed(newSpeed);
  };
  
  // Custom icons
  const vehicleIcon = L.divIcon({
    className: 'vehicle-marker',
    html: '<div style="font-size: 32px; text-align: center; line-height: 1;">🚗</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
  
  const startIcon = L.divIcon({
    className: 'start-marker',
    html: '<div style="font-size: 28px; text-align: center; line-height: 1;">🔵</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  
  const endIcon = L.divIcon({
    className: 'end-marker',
    html: '<div style="font-size: 28px; text-align: center; line-height: 1;">📍</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  
  const currentPosition = routeData[currentIndex] || routeData[0];
  const fullRouteCoords = routeData.map(point => [point.lat, point.lng]);
  const traveledRouteCoords = routeData
    .slice(0, currentIndex + 1)
    .map(point => [point.lat, point.lng]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!currentPosition || routeData.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No route data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Auto-fit bounds to route */}
        <FitBounds routeData={routeData} />
        
        {/* Complete route path (gray dashed) */}
        {fullRouteCoords.length > 1 && (
          <Polyline
            pathOptions={{ 
              color: '#9ca3af', 
              weight: 4, 
              opacity: 0.6,
              dashArray: '10, 10'
            }}
            positions={fullRouteCoords}
          />
        )}
        
        {/* Traveled route path (red solid) */}
        {traveledRouteCoords.length > 1 && (
          <Polyline
            pathOptions={{ 
              color: '#ef4444', 
              weight: 6, 
              opacity: 0.9 
            }}
            positions={traveledRouteCoords}
          />
        )}
        
        {/* Start marker */}
        {routeData.length > 0 && (
          <Marker
            position={[routeData[0].lat, routeData[0].lng]}
            icon={startIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>Start Point</strong><br />
                {new Date(routeData[0].timestamp).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker */}
        {routeData.length > 1 && (
          <Marker
            position={[routeData[routeData.length - 1].lat, routeData[routeData.length - 1].lng]}
            icon={endIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>End Point</strong><br />
                {new Date(routeData[routeData.length - 1].timestamp).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Current vehicle marker */}
        <Marker
          position={[currentPosition.lat, currentPosition.lng]}
          icon={vehicleIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div className="text-sm">
              <strong>Current Position</strong><br />
              Lat: {currentPosition.lat.toFixed(6)}<br />
              Lng: {currentPosition.lng.toFixed(6)}<br />
              Time: {new Date(currentPosition.timestamp).toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      <Controls
        currentPosition={currentPosition}
        currentIndex={currentIndex}
        routeData={routeData}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
        simulationSpeed={simulationSpeed}
      />
    </div>
  );
}

export default VehicleMap;
