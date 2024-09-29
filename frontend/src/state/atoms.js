import { atom } from 'jotai';

// Atom to store user location
export const userLocationAtom = atom({ lat: 25.761681, lng: -80.191788 });

// Atom to store selected marker
export const selectedMarkerAtom = atom(null);

export const selectedShelterAtom = atom(null);
export const radiusAtom = atom(5000);
export const isFindRouteAtom = atom(false);
