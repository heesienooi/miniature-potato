import { activeMarkerIdAtom, visibleMarkersAtom } from '@/lib/map-atom';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

export default function List() {
  const [showList, setShowList] = useState(false);
  const incidents = useAtomValue(visibleMarkersAtom);
  const setActiveId = useSetAtom(activeMarkerIdAtom);

  return (
    <>
      <button
        className="fixed right-2 top-2 z-20 inline-block rounded border border-black bg-white px-3 py-2 text-sm font-medium text-black focus:outline-none focus:ring md:hidden"
        onClick={() => setShowList((v) => !v)}
      >
        {!showList ? `Show List (${incidents.length})` : 'Close'}
      </button>
      <div
        className={clsx(
          showList ? 'block' : 'hidden',
          'fixed bottom-0 z-10 h-screen w-screen  bg-white md:static md:block md:w-auto',
        )}
      >
        <div className="flex h-screen flex-col">
          <div className="p-5 text-xs">
            Showing{' '}
            <span className="font-bold">{incidents.length} incidents</span> on
            map
          </div>
          <div className="flex-1 overflow-auto">
            <ul className="divide-y divide-gray-100">
              {incidents.map((incident) => {
                const { id, alert_type, title } = incident;
                return (
                  <li
                    key={id}
                    className="p-x 5 flex justify-between gap-x-6 px-5 py-5"
                    onClick={() => {
                      setActiveId(id);
                      setShowList(false);
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {title}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {alert_type}
                      </p>
                    </div>
                    <svg
                      className="h-6 w-6 fill-current md:h-8 md:w-8"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                    </svg>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
