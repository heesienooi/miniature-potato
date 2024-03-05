import { activeMarkerIdAtom, visibleMarkersAtom } from '@/lib/map-atom';
import { useAtomValue, useSetAtom } from 'jotai';

export default function List() {
  const incidents = useAtomValue(visibleMarkersAtom);
  const setActiveId = useSetAtom(activeMarkerIdAtom);

  return (
    <div className="h-screen overflow-auto p-5">
      List
      <div className="text-xs">
        Showing <span className="font-bold">{incidents.length} incidents</span>{' '}
        on map
      </div>
      <ul className="divide-y divide-gray-100">
        {incidents.map((incident) => {
          const { id, alert_type, title } = incident;
          return (
            <li
              key={id}
              className="flex justify-between gap-x-6 py-5"
              onClick={() => setActiveId(id)}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
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
  );
}
