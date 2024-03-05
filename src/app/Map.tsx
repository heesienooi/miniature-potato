"use client";

import { Incident, incidents } from "@/lib/data";
import { visibleMarkersAtom } from "@/lib/map-atom";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID as string;
const MELBOURNE_CENTER = {
  lat: -37.8124,
  lng: 144.9623,
};

const IncidentMarker = (incident: Incident) => {
  const { id, alert_type, title, description, lat, long } = incident;
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpened, setInfoOpened] = useState(false);

  // TODO Fix multi open info window
  return (
    <>
      <AdvancedMarker
        key={id}
        position={{ lat: Number(lat), lng: Number(long) }}
        ref={markerRef}
        onClick={() => setInfoOpened(true)}
      />
      {infoOpened && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpened(false)}>
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

export function Map() {
  const setVisibleMarkers = useSetAtom(visibleMarkersAtom);
  console.log("123");

  const updateVisibleMarkers = useDebouncedCallback((map: google.maps.Map) => {
    console.log("updateVisibleMarkers");
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
        {incidents.map((incident) => {
          const { id, alert_type, title, description, lat, long } = incident;
          return <IncidentMarker key={id} {...incident} />;
        })}
      </GoogleMap>
    </div>
  );
}
