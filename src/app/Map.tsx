'use client';

import { Incident, incidents } from '@/lib/data';
import { activeMarkerIdAtom, visibleMarkersAtom } from '@/lib/map-atom';
import {
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useAtom, useSetAtom } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';

const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID as string;
const MELBOURNE_CENTER = {
  lat: -37.8124,
  lng: 144.9623,
};

const MarkerWithInfoWindow = ({ incident }: { incident: Incident }) => {
  const { id, alert_type, title, description, lat, long } = incident;
  const [activeId, setActiveId] = useAtom(activeMarkerIdAtom);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        key={id}
        position={{ lat: Number(lat), lng: Number(long) }}
        ref={markerRef}
        onClick={() => {
          setActiveId(id);
        }}
      />
      {activeId === id && (
        <InfoWindow anchor={marker} onCloseClick={() => setActiveId(null)}>
          {alert_type}
          <br />
          {title}
          <br />
          {description}
        </InfoWindow>
      )}
    </>
  );
};

export default function Map() {
  const setVisibleMarkers = useSetAtom(visibleMarkersAtom);

  const updateVisibleMarkers = useDebouncedCallback((map: google.maps.Map) => {
    console.log('updateVisibleMarkers');
    const bounds = map.getBounds();
    const visibleMarkers = incidents.filter(({ lat, long }) =>
      bounds?.contains({ lat: Number(lat), lng: Number(long) }),
    );
    setVisibleMarkers(visibleMarkers);
  }, 300);

  return (
    <div className="h-screen">
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={MELBOURNE_CENTER}
        defaultZoom={12}
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        onBoundsChanged={(e) => updateVisibleMarkers(e.map)}
      >
        {incidents.map((incident) => (
          <MarkerWithInfoWindow key={incident.id} incident={incident} />
        ))}
      </GoogleMap>
    </div>
  );
}
