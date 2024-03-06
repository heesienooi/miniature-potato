import data from './incidents.json';

export type Incident = {
  id: number;
  incident_type: string;
  closure_type: string;
  closed_road_name: string | null;
  lga: string | null;
  vic_roads_region: string | null;
  ses_region: string | null;
  lat: string;
  long: string;
  created_at: string;
  updated_at: string;
  alert_type: string;
  melways: string;
  created_date: string;
  start_int_road_name: string;
  start_locality: string;
  updated_date: string | null;
  updated: number;
  locality: string | null;
  region: string | null;
  title: string;
  description: string;
  description_url: string | null;
  locale: string | null;
  near: string;
  list_title: string;
  list_subtitle: string;
  list_extra: string;
};

export const incidents = data.incidents as Incident[];

export const alertTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    tow_allocation: '#14B8A6',
    alert: '#F59E0B',
    emergency: '#EF4444',
    roadworks: '#6366F1',
    event: '#EC4899',
  };

  return colorMap[type] ?? '#6B7280';
};
