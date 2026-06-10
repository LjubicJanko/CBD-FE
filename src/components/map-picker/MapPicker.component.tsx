import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useRef } from 'react';
import * as Styled from './MapPicker.styles';
import theme from '../../styles/theme';

// Vite bundlers strip Leaflet's default icon URLs. Re-bind them once at module
// load so every marker renders with the standard pin instead of a broken image.
type IconDefaultPrototype = { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export type MapPickerProps = {
  lat: number;
  lng: number;
  radiusM: number;
  onChange: (lat: number, lng: number) => void;
};

const ClickHandler: React.FC<{
  onChange: (lat: number, lng: number) => void;
}> = ({ onChange }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Recenters the map when the lat/lng controlled by the parent changes from
// outside (e.g. when the user manually edits the coordinate inputs in the
// dialog).
const Recenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  lat,
  lng,
  radiusM,
  onChange,
}) => {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Styled.MapWrapper className="map-picker">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        <Recenter lat={lat} lng={lng} />
        <Marker
          position={[lat, lng]}
          draggable
          ref={markerRef}
          eventHandlers={{
            dragend: () => {
              const marker = markerRef.current;
              if (!marker) return;
              const pos = marker.getLatLng();
              onChange(pos.lat, pos.lng);
            },
          }}
        />
        <Circle
          center={[lat, lng]}
          radius={radiusM}
          pathOptions={{ color: theme.PRIMARY_2, fillOpacity: 0.15 }}
        />
      </MapContainer>
    </Styled.MapWrapper>
  );
};

export default MapPicker;
