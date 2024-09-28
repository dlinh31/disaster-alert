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
