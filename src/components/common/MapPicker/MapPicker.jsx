import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix default icon paths for Leaflet (use ES module imports to work with Vite)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component để tự động di chuyển map khi marker thay đổi
const MapUpdater = ({ marker }) => {
  const map = useMap();
  
  useEffect(() => {
    if (marker) {
      map.flyTo([marker.lat, marker.lng], 15, {
        duration: 1
      });
    }
  }, [marker, map]);
  
  return null;
};

const MapPicker = ({ latitude, longitude, onChange, bounds, height = 300 }) => {
  const center = {
    lat: latitude ? Number(latitude) : (bounds ? (bounds.north + bounds.south) / 2 : 16.04708),
    lng: longitude ? Number(longitude) : (bounds ? (bounds.east + bounds.west) / 2 : 108.20623),
  };

  const [marker, setMarker] = useState(latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : null);
  const initialMarkerSet = useRef(false);

  useEffect(() => {
    if (latitude && longitude) {
      const newMarker = { lat: Number(latitude), lng: Number(longitude) };
      setMarker(newMarker);
      
      // Đánh dấu là đã set marker ban đầu
      if (!initialMarkerSet.current) {
        initialMarkerSet.current = true;
      }
    }
  }, [latitude, longitude]);

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    if (onChange) onChange(latlng);
  };

  const leafletBounds = bounds ? [[bounds.south, bounds.west], [bounds.north, bounds.east]] : null;
  // Mapbox support: use Vite env var VITE_MAPBOX_TOKEN and optional VITE_MAPBOX_STYLE
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox/streets-v11';

  // Build TileLayer props depending on whether Mapbox token is present
  const mapboxTileUrl = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
    : null;

  const tileLayerProps = MAPBOX_TOKEN
    ? { url: mapboxTileUrl, attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>', tileSize: 512, zoomOffset: -1 }
    : { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' };

  return (
    <div className="map-picker" style={{ height }}>
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} whenCreated={(map) => {
        if (leafletBounds) map.fitBounds(leafletBounds);
      }}>
        <TileLayer {...tileLayerProps} />
        <ClickHandler onMapClick={handleMapClick} />
        <MapUpdater marker={marker} />
        {marker && <Marker position={[marker.lat, marker.lng]} />}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
