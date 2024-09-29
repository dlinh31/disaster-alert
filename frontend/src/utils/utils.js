export function calculateArea(coords) {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];

    area += x1 * y2 - x2 * y1;
  }

  //   return area / 2;
  // replace with
  return Math.abs(area) / 2;
}

export const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const computeDistance = (coord1, coord2) => {
  const toRad = value => (value * Math.PI) / 180;

  const lat1 = coord1.lat;
  const lon1 = coord1.lng;
  const lat2 = coord2.lat;
  const lon2 = coord2.lng;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
export const findNearestShelter = (userLocation, shelters) => {
  let minDistance = Infinity;
  let nearestShelter = null;

  shelters.forEach(shelter => {
    const distance = computeDistance(userLocation, shelter.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearestShelter = shelter;
    }
  });

  return nearestShelter;
};
