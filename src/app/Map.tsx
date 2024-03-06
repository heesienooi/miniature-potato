'use client';

import { Incident, alertTypeColor, incidents } from '@/lib/data';
import { activeMarkerIdAtom, visibleMarkersAtom } from '@/lib/map-atom';
import {
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID as string;
const MELBOURNE_CENTER = {
  lat: -37.8124,
  lng: 144.9623,
};
const DEFAULT_ZOOM = 13;

const calculateSizeBasedOnZoom = (zoom: number) => {
  const zoomMin = 8;
  const zoomMax = 15;
  const sizeMin = 1;
  const sizeMax = 7;

  // Linear interpolation
  let size =
    sizeMin + ((sizeMax - sizeMin) * (zoom - zoomMin)) / (zoomMax - zoomMin);

  size = Math.max(sizeMin, size);
  size = Math.min(sizeMax, size);

  return parseInt(`${size}`);
};

const MarkerWithInfoWindow = ({
  incident,
  zoom = DEFAULT_ZOOM,
}: {
  incident: Incident;
  zoom?: number;
}) => {
  const { id, alert_type, title, description, lat, long } = incident;
  const [activeId, setActiveId] = useAtom(activeMarkerIdAtom);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const size = calculateSizeBasedOnZoom(zoom);

  return (
    <>
      <AdvancedMarker
        key={id}
        position={{ lat: Number(lat), lng: Number(long) }}
        ref={markerRef}
        onClick={() => {
          setActiveId(id);
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: size * 4,
            height: size * 4,
            background: alertTypeColor(alert_type),
            opacity: 0.7,
          }}
        >
          <span className="sr-only">{alert_type}</span>
        </div>
      </AdvancedMarker>
      {activeId === id && (
        <InfoWindow
          maxWidth={300}
          anchor={marker}
          onCloseClick={() => setActiveId(null)}
        >
          <div className="text-base font-semibold text-gray-900">{title}</div>
          <div className="mt truncate text-sm leading-5 text-gray-600">
            {alert_type}
          </div>
          <p className="mt-4 leading-normal text-gray-800">{description}</p>
        </InfoWindow>
      )}
    </>
  );
};

export default function Map() {
  const [zoom, setZoom] = useState<number | undefined>(12);
  const setVisibleMarkers = useSetAtom(visibleMarkersAtom);

  const updateVisibleMarkers = useDebouncedCallback((map: google.maps.Map) => {
    const bounds = map.getBounds();
    const visibleMarkers = incidents.filter(({ lat, long }) =>
      bounds?.contains({ lat: Number(lat), lng: Number(long) }),
    );
    setVisibleMarkers(visibleMarkers);
  }, 300);

  const updateZoom = useDebouncedCallback((zoom?: number) => {
    setZoom(zoom);
  }, 100);

  return (
    <div className="h-screen">
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={MELBOURNE_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        onBoundsChanged={(e) => updateVisibleMarkers(e.map)}
        onZoomChanged={(e) => updateZoom(e.map.getZoom())}
      >
        {incidents.map((incident) => (
          <MarkerWithInfoWindow
            key={incident.id}
            incident={incident}
            zoom={zoom}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
