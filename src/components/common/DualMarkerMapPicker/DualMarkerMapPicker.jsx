import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DualMarkerMapPicker.css';

// Fix default icon paths for Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Create custom icons for start and end markers
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        "></div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
};

const startIcon = createCustomIcon('#06D6A0'); // Green for start
const endIcon = createCustomIcon('#EF476F'); // Red for end

const ClickHandler = ({ onMapClick, mode }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng, mode);
    },
  });
  return null;
};

// Component để tự động fit bounds khi có cả 2 markers
const MapBoundsUpdater = ({ startMarker, endMarker }) => {
  const map = useMap();
  
  useEffect(() => {
    if (startMarker && endMarker) {
      const bounds = L.latLngBounds(
        [startMarker.lat, startMarker.lng],
        [endMarker.lat, endMarker.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startMarker) {
      map.flyTo([startMarker.lat, startMarker.lng], 15, { duration: 1 });
    } else if (endMarker) {
      map.flyTo([endMarker.lat, endMarker.lng], 15, { duration: 1 });
    }
  }, [startMarker, endMarker, map]);
  
  return null;
};

const DualMarkerMapPicker = ({ 
  startLat, 
  startLng, 
  endLat, 
  endLng, 
  onStartChange, 
  onEndChange,
  bounds, 
  height = 400 
}) => {
  const center = {
    lat: bounds ? (bounds.north + bounds.south) / 2 : 16.04708,
    lng: bounds ? (bounds.east + bounds.west) / 2 : 108.20623,
  };

  const [startMarker, setStartMarker] = useState(
    startLat && startLng ? { lat: Number(startLat), lng: Number(startLng) } : null
  );
  const [endMarker, setEndMarker] = useState(
    endLat && endLng ? { lat: Number(endLat), lng: Number(endLng) } : null
  );
  const [clickMode, setClickMode] = useState('start'); // 'start' or 'end'

  // Update markers when props change
  useEffect(() => {
    if (startLat && startLng) {
      setStartMarker({ lat: Number(startLat), lng: Number(startLng) });
    }
  }, [startLat, startLng]);

  useEffect(() => {
    if (endLat && endLng) {
      setEndMarker({ lat: Number(endLat), lng: Number(endLng) });
    }
  }, [endLat, endLng]);

  const handleMapClick = (latlng, mode) => {
    if (mode === 'start') {
      setStartMarker(latlng);
      if (onStartChange) onStartChange(latlng);
      // Auto switch to end mode after setting start
      if (!endMarker) {
        setClickMode('end');
      }
    } else {
      setEndMarker(latlng);
      if (onEndChange) onEndChange(latlng);
    }
  };

  const leafletBounds = bounds 
    ? [[bounds.south, bounds.west], [bounds.north, bounds.east]] 
    : null;

  // Mapbox support
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox/streets-v11';

  const mapboxTileUrl = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
    : null;

  const tileLayerProps = MAPBOX_TOKEN
    ? { 
        url: mapboxTileUrl, 
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>', 
        tileSize: 512, 
        zoomOffset: -1 
      }
    : { 
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
      };

  // Create polyline positions if both markers exist
  const polylinePositions = startMarker && endMarker 
    ? [[startMarker.lat, startMarker.lng], [endMarker.lat, endMarker.lng]]
    : null;

  return (
    <div className="dual-marker-map-picker">
      <div className="map-controls">
        <div className="mode-selector">
          <button
            type="button"
            className={`mode-btn ${clickMode === 'start' ? 'active start' : ''}`}
            onClick={() => setClickMode('start')}
          >
            <span className="marker-indicator start"></span>
            Điểm bắt đầu
          </button>
          <button
            type="button"
            className={`mode-btn ${clickMode === 'end' ? 'active end' : ''}`}
            onClick={() => setClickMode('end')}
          >
            <span className="marker-indicator end"></span>
            Điểm kết thúc
          </button>
        </div>
        <p className="map-hint">
          Chọn chế độ và click trên bản đồ để đặt marker
        </p>
      </div>

      <div className="map-container" style={{ height }}>
        <MapContainer 
          center={[center.lat, center.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }} 
          scrollWheelZoom={true}
        >
          <TileLayer {...tileLayerProps} />
          <ClickHandler onMapClick={handleMapClick} mode={clickMode} />
          <MapBoundsUpdater startMarker={startMarker} endMarker={endMarker} />
          
          {startMarker && (
            <Marker 
              position={[startMarker.lat, startMarker.lng]} 
              icon={startIcon}
            />
          )}
          
          {endMarker && (
            <Marker 
              position={[endMarker.lat, endMarker.lng]} 
              icon={endIcon}
            />
          )}
          
          {polylinePositions && (
            <Polyline 
              positions={polylinePositions} 
              color="#118AB2" 
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      <div className="marker-legend">
        <div className="legend-item">
          <span className="legend-marker start"></span>
          <span>Điểm bắt đầu</span>
          {startMarker && (
            <span className="coords">
              ({startMarker.lat.toFixed(6)}, {startMarker.lng.toFixed(6)})
            </span>
          )}
        </div>
        <div className="legend-item">
          <span className="legend-marker end"></span>
          <span>Điểm kết thúc</span>
          {endMarker && (
            <span className="coords">
              ({endMarker.lat.toFixed(6)}, {endMarker.lng.toFixed(6)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualMarkerMapPicker;
