"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Location interface for Prismic Geopoint data
interface Location {
  location_name: string | null;
  location_coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  location_value: string | null;
  location_description: string | null;
}

// Calculate center point of locations for camera focus
function calculateLocationCenter(locations: Location[]): { lat: number; lon: number } {
  if (locations.length === 0) {
    return { lat: 0, lon: 0 };
  }

  const validLocations = locations.filter(
    loc => loc.location_coordinates?.latitude != null && loc.location_coordinates?.longitude != null
  );

  if (validLocations.length === 0) {
    return { lat: 0, lon: 0 };
  }

  const sum = validLocations.reduce(
    (acc, loc) => ({
      lat: acc.lat + (loc.location_coordinates?.latitude || 0),
      lon: acc.lon + (loc.location_coordinates?.longitude || 0),
    }),
    { lat: 0, lon: 0 }
  );

  return {
    lat: sum.lat / validLocations.length,
    lon: sum.lon / validLocations.length,
  };
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Calculate a center direction vector (unit) from a set of locations
function calculateCenterVector(locations: Location[]): THREE.Vector3 {
  const valid = locations.filter(
    (l) => l.location_coordinates &&
      typeof l.location_coordinates.latitude === 'number' &&
      typeof l.location_coordinates.longitude === 'number'
  );

  if (valid.length === 0) {
    // Default to facing Africa-equator (0,0) to avoid NaNs
    return latLonToVector3(0, 0, 1).normalize();
  }

  const sum = valid.reduce((acc, l) => {
    const v = latLonToVector3(
      l.location_coordinates!.latitude,
      l.location_coordinates!.longitude,
      1
    );
    acc.add(v);
    return acc;
  }, new THREE.Vector3(0, 0, 0));

  if (sum.lengthSq() === 0) {
    return latLonToVector3(0, 0, 1).normalize();
  }

  return sum.normalize();
}

// Draw line on globe from GeoJSON coordinates
function drawLine(
  coordinates: number[][],
  scene: THREE.Scene,
  group: THREE.Group,
  radius: number
) {
  const points: THREE.Vector3[] = [];
  
  coordinates.forEach(coord => {
    const [lon, lat] = coord;
    const point = latLonToVector3(lat, lon, radius);
    points.push(point);
  });

  if (points.length > 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }
}

// Parse GeoJSON and draw lines
function drawGeoJSON(geoJson: any, scene: THREE.Scene, group: THREE.Group, radius: number) {
  function processFeature(geometry: any) {
    if (!geometry) return;

    switch (geometry.type) {
      case "LineString":
        drawLine(geometry.coordinates, scene, group, radius);
        break;
      case "Polygon":
        geometry.coordinates.forEach((ring: number[][]) => {
          drawLine(ring, scene, group, radius);
        });
        break;
      case "MultiLineString":
        geometry.coordinates.forEach((line: number[][]) => {
          drawLine(line, scene, group, radius);
        });
        break;
      case "MultiPolygon":
        geometry.coordinates.forEach((polygon: number[][][]) => {
          polygon.forEach((ring: number[][]) => {
            drawLine(ring, scene, group, radius);
          });
        });
        break;
    }
  }

  if (geoJson.type === "Feature") {
    processFeature(geoJson.geometry);
  } else if (geoJson.type === "FeatureCollection") {
    geoJson.features.forEach((feature: any) => {
      processFeature(feature.geometry);
    });
  }
}

// Create starfield
function createStarfield(scene: THREE.Scene) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.5,
    transparent: true,
    opacity: 0.4,
  });

  const starsVertices: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const z = -Math.random() * 50 - 10;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );

  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

// Filter valid locations with coordinates
function getValidLocations(locations: Location[]): Location[] {
  return locations.filter(
    loc => loc.location_coordinates && 
           loc.location_coordinates.latitude !== null && 
           loc.location_coordinates.longitude !== null
  );
}

// Create location markers from Prismic Geopoint data
function createMarkers(
  scene: THREE.Scene,
  markerGroup: THREE.Group,
  locations: Location[],
  radius: number,
  pulsesRef: React.MutableRefObject<THREE.Mesh[]>,
  labelSpritesRef: React.MutableRefObject<THREE.Sprite[]>,
  leaderLinesRef: React.MutableRefObject<THREE.Line[]>
) {
  // Clear existing markers
  while (markerGroup.children.length > 0) {
    const child = markerGroup.children[0];
    markerGroup.remove(child);
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) {
        child.material.dispose();
      }
    }
    if (child instanceof THREE.Line) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) {
        child.material.dispose();
      }
    }
    if (child instanceof THREE.Sprite) {
      if (child.material instanceof THREE.SpriteMaterial) {
        if (child.material.map) {
          child.material.map.dispose();
        }
        child.material.dispose();
      }
    }
  }

  // Reset pulses
  pulsesRef.current = [];
  labelSpritesRef.current = [];
  leaderLinesRef.current = [];

  const validLocations = getValidLocations(locations);

  validLocations.forEach((location, index) => {
    if (!location.location_coordinates) return;

    const position = latLonToVector3(
      location.location_coordinates.latitude,
      location.location_coordinates.longitude,
      radius
    );

    // Main marker sphere (scaled up)
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xed1e24,
      transparent: true,
      opacity: 1,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);
    markerGroup.add(marker);

    // Outer glow (pulsing)
    const glowGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xed1e24,
      transparent: true,
      opacity: 0.5,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    ;(glow as any).userData.pulseOffset = Math.random() * Math.PI * 2;
    pulsesRef.current.push(glow);
    markerGroup.add(glow);

    // Leader line to label above surface: bias toward geographic "up" (north)
    const direction = position.clone().normalize(); // radial normal
    const worldUp = new THREE.Vector3(0, 1, 0);
    // Tangent pointing toward north on the surface
    let northTangent = worldUp.clone().sub(direction.clone().multiplyScalar(worldUp.dot(direction)));
    if (northTangent.lengthSq() < 1e-6) {
      // Fallback near poles: use east-west axis
      const worldEast = new THREE.Vector3(1, 0, 0);
      northTangent = worldEast.clone().sub(direction.clone().multiplyScalar(worldEast.dot(direction)));
    }
    northTangent.normalize();

    // Reduce radial push, increase upward (along tangent) lift
    const outward = 0.5; // smaller push away from sphere
    const upLift = 1.0;  // stronger lift toward north
    const end = position.clone().add(direction.multiplyScalar(outward)).add(northTangent.clone().multiplyScalar(upLift));
    const lineGeom = new THREE.BufferGeometry().setFromPoints([position, end]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xed1e24, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(lineGeom, lineMat);
    markerGroup.add(line);
    leaderLinesRef.current.push(line);

    // Label sprite with location name (if present)
    if (location.location_name) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 64px Inter, Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const text = location.location_name;
        const metrics = ctx.measureText(text);
        const pad = 50;
        const h = 80;
        const y = canvas.height / 2;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(0, y - h/2, metrics.width + pad, h);
        ctx.fillStyle = '#111111';
        ctx.fillText(text, 25, y);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      // Place label slightly further along the north tangent to clear the dot
      sprite.position.copy(end.clone().add(northTangent.clone().multiplyScalar(0.35)));
      sprite.scale.set(2.0, 0.5, 1);
      markerGroup.add(sprite);
      labelSpritesRef.current.push(sprite);
    }
  });
}

// Main Globe3D component
export default function Globe3D({
  activeRegion,
  allLocations = [],
  activeLocations = [],
}: { 
  activeRegion: string;
  allLocations?: Location[];
  activeLocations?: Location[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isInitialMount = useRef(true);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const linesGroupRef = useRef<THREE.Group | null>(null);
  const pulsesRef = useRef<THREE.Mesh[]>([]);
  const labelSpritesRef = useRef<THREE.Sprite[]>([]);
  const leaderLinesRef = useRef<THREE.Line[]>([]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || mounted) return;

    setMounted(true);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - fixed position looking at the globe center
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Physically-based rendering setup for softer lighting (v150+ defaults)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Make canvas completely independent and free from container constraints
    renderer.domElement.style.position = "relative";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.zIndex = "1";
    
    // Clear any existing children before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom
    controls.enablePan = false;
    controls.autoRotate = false; // No auto-rotation - only animate on tab change
    controlsRef.current = controls;

    // Lights - softer, natural look
    // Hemisphere light for ambient sky/ground fill
    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x1b1b1b, 0.6);
    scene.add(hemi);

    // Single soft key light as "sun"
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(5, 3, 5);
    sun.castShadow = false;
    scene.add(sun);

    // Starfield removed per design request (no background particles)

    // Create globe
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
    // Use Standard material for physically-based shading and softer highlights
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1a1a2e).convertSRGBToLinear(),
      roughness: 0.9, // very matte to avoid cheap shine
      metalness: 0.0,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(sphere);

    // Subtle atmospheric rim glow (adds interest without changing lighting)
    const atmosphereVertex = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragment = `
      varying vec3 vNormal;
      uniform vec3 glowColor;
      uniform float intensity;
      void main() {
        // Strongest at limb (when normal ⟂ view dir)
        float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
        gl_FragColor = vec4(glowColor, rim * intensity);
      }
    `;
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x141433) },
        intensity: { value: 0.45 },
      },
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5.3, 64, 64), atmosphereMaterial);
    globeGroup.add(atmosphere);

    // Create lines group for country borders
    const linesGroup = new THREE.Group();
    linesGroupRef.current = linesGroup;
    globeGroup.add(linesGroup);

    // Create marker group as child of globe so it rotates with the globe
    const markerGroup = new THREE.Group();
    markerGroupRef.current = markerGroup;
    globeGroup.add(markerGroup);

    // Load GeoJSON
    fetch("/geojson/countries.geo.json")
      .then(response => response.json())
      .then(geoJson => {
        drawGeoJSON(geoJson, scene, linesGroup, 5.05);
        // Add a subtle animated dash to country lines
        linesGroup.traverse((obj) => {
          if ((obj as any).isLine) {
            const line = obj as THREE.Line;
            const mat = line.material as THREE.LineBasicMaterial;
            mat.color = new THREE.Color(0x555555);
            mat.opacity = 0.5;
          }
        });
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
      });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
      
      if (controlsRef.current) {
      controlsRef.current.update();
      }

      // Pulse glows
      const time = performance.now() * 0.002;
      if (pulsesRef.current.length) {
        for (const mesh of pulsesRef.current) {
          const offset = (mesh as any).userData?.pulseOffset || 0;
          const s = 1 + 0.15 * Math.sin(time + offset);
          mesh.scale.setScalar(s);
          if ((mesh.material as any).opacity !== undefined) {
            (mesh.material as any).opacity = 0.35 + 0.25 * (0.5 + 0.5 * Math.sin(time * 1.5 + offset));
          }
        }
      }

      // Hide labels/lines when behind the globe (simple dot-product test)
      if (cameraRef.current && globeGroupRef.current) {
        const camDir = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion).normalize();
        const globeWorld = globeGroupRef.current;
        for (let i = 0; i < labelSpritesRef.current.length; i++) {
          const sprite = labelSpritesRef.current[i];
          const toLabel = sprite.getWorldPosition(new THREE.Vector3()).normalize();
          const facing = camDir.dot(toLabel);
          const visible = facing < 0.1; // if label direction points away from camera, hide
          sprite.visible = visible;
          if (leaderLinesRef.current[i]) {
            leaderLinesRef.current[i].visible = visible;
          }
        }
      }
    
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  // Create markers for ALL locations (once on mount, update when allLocations changes)
  useEffect(() => {
    if (!mounted || !sceneRef.current || !markerGroupRef.current) return;

    createMarkers(
      sceneRef.current,
      markerGroupRef.current,
      allLocations,
      5.25,
      pulsesRef,
      labelSpritesRef,
      leaderLinesRef
    );
  }, [allLocations, mounted]);

  // Rotate globe to show active region (quaternion-based; skip animation on initial mount)
  useEffect(() => {
    if (!mounted || !globeGroupRef.current) return;
    // Wait until we have a real coordinate; avoid (0,0) default (Africa)
    const hasValid = activeLocations?.some(
      (l) => l.location_coordinates &&
        typeof l.location_coordinates.latitude === 'number' &&
        typeof l.location_coordinates.longitude === 'number'
    );
    if (!hasValid) return;

    const globe = globeGroupRef.current;

    // Compute direction to face (vector from globe center to region center)
    const targetDir = calculateCenterVector(activeLocations); // unit vector

    // We want the point at targetDir to face the camera (camera looks along -Z at origin)
    // So we rotate the globe so that targetDir aligns with +Z
    const currentQuat = globe.quaternion.clone();
    const targetQuat = new THREE.Quaternion();
    const from = targetDir.clone().normalize();
    const to = new THREE.Vector3(0, 0, 1); // facing camera
    // Create quaternion that rotates 'from' to 'to'
    targetQuat.setFromUnitVectors(from, to);

    if (isInitialMount.current) {
      globe.quaternion.copy(targetQuat);
      isInitialMount.current = false;
      return;
    }

    // Slerp between current and target for smooth motion
    let progress = 0;
    const duration = 1.2;

    function animateRotation() {
      progress += 0.016;
      const t = Math.min(progress / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (globeGroupRef.current) {
        globeGroupRef.current.quaternion.copy(currentQuat).slerp(targetQuat, eased);
      }
      if (t < 1) {
        requestAnimationFrame(animateRotation);
      }
    }

    animateRotation();
  }, [activeRegion, activeLocations, mounted]);

  return (
    <div 
      ref={containerRef} 
      className="relative"
        style={{ 
        width: "150%",
        height: "700px",
        minHeight: "1000px",
        background: "transparent",
        position: "relative",
        marginLeft: "-50%"
      }}
    />
  );
}
