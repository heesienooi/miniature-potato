"use client";

import { Incident, incidents } from "@/lib/data";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
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
  return (
    <APIProvider apiKey={API_KEY}>
      <div className="h-screen">
        <GoogleMap
          mapId={MAP_ID}
          defaultCenter={MELBOURNE_CENTER}
          defaultZoom={12}
          disableDefaultUI
          zoomControl
          clickableIcons={false}
          onBoundsChanged={() => {
            console.log("123");
          }}
        >
          {incidents.map((incident) => {
            const { id, alert_type, title, description, lat, long } = incident;
            return <IncidentMarker key={id} {...incident} />;
          })}
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
