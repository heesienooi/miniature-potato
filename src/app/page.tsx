'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import Map from './Map';
import List from './List';
import { Provider } from 'jotai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function Home() {
  return (
    <Provider>
      <APIProvider apiKey={API_KEY}>
        <main>
          <div className="md:grid md:grid-cols-[300px_1fr]">
            <List />
            <Map />
          </div>
        </main>
      </APIProvider>
    </Provider>
  );
}
