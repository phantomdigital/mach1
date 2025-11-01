import * as THREE from "three";

interface ConvertedCoords {
  x: number;
  y: number;
  z: number;
}

/**
 * Convert latitude/longitude coordinates to 3D sphere coordinates
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Check if two points need interpolation (distance > 5 degrees)
 */
function needsInterpolation(point1: number[], point2: number[]): boolean {
  const lon1 = point1[0];
  const lat1 = point1[1];
  const lon2 = point2[0];
  const lat2 = point2[1];
  const lonDistance = Math.abs(lon1 - lon2);
  const latDistance = Math.abs(lat1 - lat2);

  return lonDistance > 5 || latDistance > 5;
}

/**
 * Get midpoint between two coordinate points
 */
function getMidpoint(point1: number[], point2: number[]): number[] {
  const midpointLon = (point1[0] + point2[0]) / 2;
  const midpointLat = (point1[1] + point2[1]) / 2;
  return [midpointLon, midpointLat];
}

/**
 * Recursively interpolate points to prevent lines going through the sphere
 */
function interpolatePoints(points: number[][]): number[][] {
  const tempArray: number[][] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const point1 = points[i];
    const point2 = points[i + 1];

    if (needsInterpolation(point1, point2)) {
      tempArray.push(point1);
      tempArray.push(getMidpoint(point1, point2));
    } else {
      tempArray.push(point1);
    }
  }

  tempArray.push(points[points.length - 1]);

  if (tempArray.length > points.length) {
    return interpolatePoints(tempArray);
  }

  return tempArray;
}

/**
 * Create coordinate array with interpolation
 */
function createCoordinateArray(coordinates: number[][]): number[][] {
  const tempArray: number[][] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const point1 = coordinates[i];
    const point2 = coordinates[i - 1];

    if (i > 0) {
      if (needsInterpolation(point2, point1)) {
        const interpolated = interpolatePoints([point2, point1]);
        tempArray.push(...interpolated);
      } else {
        tempArray.push(point1);
      }
    } else {
      tempArray.push(point1);
    }
  }

  return tempArray;
}

/**
 * Parse GeoJSON and convert to line segments for Three.js
 */
export function parseGeoJSON(geoJson: any, radius: number): THREE.Vector3[][] {
  const lines: THREE.Vector3[][] = [];

  function processGeometry(geometry: any) {
    if (!geometry) return;

    switch (geometry.type) {
      case "LineString":
        processLineString(geometry.coordinates);
        break;
      case "Polygon":
        geometry.coordinates.forEach((ring: number[][]) => {
          processLineString(ring);
        });
        break;
      case "MultiLineString":
        geometry.coordinates.forEach((line: number[][]) => {
          processLineString(line);
        });
        break;
      case "MultiPolygon":
        geometry.coordinates.forEach((polygon: number[][][]) => {
          polygon.forEach((ring: number[][]) => {
            processLineString(ring);
          });
        });
        break;
    }
  }

  function processLineString(coordinates: number[][]) {
    const interpolatedCoords = createCoordinateArray(coordinates);
    const points = interpolatedCoords.map(coord =>
      latLonToVector3(coord[1], coord[0], radius)
    );
    if (points.length > 1) {
      lines.push(points);
    }
  }

  if (geoJson.type === "Feature") {
    processGeometry(geoJson.geometry);
  } else if (geoJson.type === "FeatureCollection") {
    geoJson.features.forEach((feature: any) => {
      processGeometry(feature.geometry);
    });
  } else if (geoJson.type === "GeometryCollection") {
    geoJson.geometries.forEach((geometry: any) => {
      processGeometry(geometry);
    });
  }

  return lines;
}

/**
 * Generate random star positions in a sphere
 */
export function generateStarfield(numStars: number = 2000): {
  positions: Float32Array;
  colors: Float32Array;
} {
  const positions: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < numStars; i++) {
    // Random sphere point
    const radius = Math.random() * 10 + 15;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push(x, y, z);

    // Subtle color variation
    const hue = 0.6;
    const color = new THREE.Color().setHSL(hue, 0.2, Math.random() * 0.5 + 0.5);
    colors.push(color.r, color.g, color.b);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

