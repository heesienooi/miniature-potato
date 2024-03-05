import { atom } from 'jotai';
import { Incident } from './data';

export const visibleMarkersAtom = atom<Incident[]>([]);

export const activeMarkerIdAtom = atom<number | null>(null);
