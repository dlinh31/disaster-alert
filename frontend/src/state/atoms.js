import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Atom to store user location
export const userLocationAtom = atom({ lat: 25.761681, lng: -80.191788 });

// Atom to store selected marker
export const selectedMarkerAtom = atom(null);

export const selectedShelterAtom = atom(null);
export const radiusAtom = atom(5000);
export const isFindRouteAtom = atom(false);

export const userAtom = atomWithStorage('user', {
  id: -1,
  name: 'Ben Dover',
  email: 'bendover@gmail.com',
  phone: '91379912318',
  role: 'provider',
});
