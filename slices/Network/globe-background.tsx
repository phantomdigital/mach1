"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Simple spinning globe background component
 * Used as a decorative background element
 */
export default function GlobeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || mounted) return;

    setMounted(true);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - positioned to show full globe coverage
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "0";
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x1b1b1b, 0.6);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // Create radial grid background for visual interest - EXACT copy from globe-3d.tsx
    const gridGroup = new THREE.Group();
    gridGroup.position.z = -10; // Position much further behind for better separation
    gridGroup.scale.set(3.0, 3.0, 3.0); // Larger scale for full viewport coverage
    gridGroupRef.current = gridGroup;
    scene.add(gridGroup);

    // Longitude lines (meridians) - vertical circles with varying opacity
    const longitudeCount = 24; // One every 15 degrees
    for (let i = 0; i < longitudeCount; i++) {
      const angle = (i / longitudeCount) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      const segments = 64;
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI;
        const radius = 5.5; // Slightly larger than globe
        const x = Math.sin(theta) * Math.cos(angle) * radius;
        const y = Math.cos(theta) * radius;
        const z = Math.sin(theta) * Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // Vary opacity - make cardinal directions (0°, 90°, 180°, 270°) slightly brighter
      const isCardinal = i % 6 === 0;
      const material = new THREE.LineBasicMaterial({
        color: isCardinal ? 0x0AAE88 : 0x888888, // Green accent for cardinal directions
        transparent: true,
        opacity: isCardinal ? 0.4 : 0.25, // Increased opacity for better visibility
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      gridGroup.add(line);
    }

    // Latitude lines (parallels) - horizontal circles with varying opacity
    const latitudeCount = 12; // From pole to pole
    for (let i = 1; i < latitudeCount; i++) {
      const lat = (i / latitudeCount) * Math.PI;
      const points: THREE.Vector3[] = [];
      const segments = 64;
      const radius = 5.5; // Slightly larger than globe
      
      for (let j = 0; j <= segments; j++) {
        const lon = (j / segments) * Math.PI * 2;
        const r = Math.sin(lat) * radius;
        const x = r * Math.cos(lon);
        const y = Math.cos(lat) * radius;
        const z = r * Math.sin(lon);
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // Make equator (middle line) slightly brighter
      const isEquator = i === Math.floor(latitudeCount / 2);
      const material = new THREE.LineBasicMaterial({
        color: isEquator ? 0x0AAE88 : 0x888888, // Green accent for equator
        transparent: true,
        opacity: isEquator ? 0.4 : 0.25, // Increased opacity for better visibility
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      gridGroup.add(line);
    }

    // Add concentric circles at different depths for layered effect
    const concentricRings = [4.5, 5.0, 5.5, 6.0];
    concentricRings.forEach((ringRadius, idx) => {
      const points: THREE.Vector3[] = [];
      const segments = 64;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const y = Math.sin(angle) * ringRadius;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x0AAE88,
        transparent: true,
        opacity: 0.15 + (idx * 0.05), // Increased opacity for better visibility
        linewidth: 1,
      });
      const circle = new THREE.Line(geometry, material);
      gridGroup.add(circle);
    });

    // Add radial lines from center for depth effect
    const radialCount = 12;
    for (let i = 0; i < radialCount; i++) {
      const angle = (i / radialCount) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      
      // Line from center outward
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(
        Math.cos(angle) * 6.5,
        Math.sin(angle) * 6.5,
        0
      ));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.2, // Increased opacity for better visibility
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      gridGroup.add(line);
    }

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Continuous rotation of radial grid background - more visible spin
      if (gridGroupRef.current) {
        gridGroupRef.current.rotation.y += 0.005; // Continuous increment for clear rotation
        gridGroupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.05; // Very gentle oscillation
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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && rendererRef.current && rendererRef.current.domElement) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element may already be removed
        }
      }
      rendererRef.current?.dispose();
    };
  }, [mounted]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}

