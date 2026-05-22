import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  scrollProgress: number;
  activePlanetIdx: number | null;
}

// Track details matching data.ts
const PLANET_DATA = [
  { id: 'ai-ml', name: 'Planet Hyperion', color: 0xe6a640, radius: 1.2 },
  { id: 'web3', name: 'Planet Mann', color: 0x00FAF5, radius: 0.9 },
  { id: 'cybersecurity', name: 'Planet Edmunds', color: 0xff4b91, radius: 1.0 },
  { id: 'sustainability', name: 'Planet Miller', color: 0x00ff87, radius: 1.1 },
  { id: 'open-innovation', name: 'The Tesseract', color: 0xc17dff, radius: 1.3 },
];

export default function ThreeCanvas({ scrollProgress, activePlanetIdx }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Animation state refs for lerping
  const targetCamPos = useRef(new THREE.Vector3(0, 5, 22));
  const currentCamPos = useRef(new THREE.Vector3(0, 15, 45));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Scene, Camera & Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020204, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.copy(currentCamPos.current);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Add Ambient Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xe6a640, 2.5, 100);
    mainLight.position.set(0, 0, 0);
    scene.add(mainLight);

    // 3. Create Supermassive Black Hole & Accretion Disk
    // Singularity (Spherical Core)
    const blackHoleGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
    scene.add(blackHole);

    // Accretion Disk Swirling Particles
    const diskParticleCount = 1800;
    const diskGeo = new THREE.BufferGeometry();
    const diskPositions = new Float32Array(diskParticleCount * 3);
    const diskColors = new Float32Array(diskParticleCount * 3);
    const diskRadii: number[] = [];
    const diskAngles: number[] = [];
    const diskSpeeds: number[] = [];

    const colorAccretion = new THREE.Color(0xe6a640);
    const colorCoreInner = new THREE.Color(0xffaa22);
    const colorEdgePurple = new THREE.Color(0x9a44e6);

    for (let i = 0; i < diskParticleCount; i++) {
      // Accretion particles swirl from radius 3.5 to 11
      const r = 3.5 + Math.random() * 7.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Slanted high-speed gravitational swirling with slight Gaussian vertical offset
      const y = (Math.random() - 0.5) * 0.4 * (1.1 - r / 11);

      diskPositions[i * 3] = x;
      diskPositions[i * 3 + 1] = y;
      diskPositions[i * 3 + 2] = z;

      // Color transition from bright fiery orange inner to soft dusty magenta outer edges
      const ratio = (r - 3.5) / 7.5;
      const finalColor = new THREE.Color();
      if (ratio < 0.4) {
        finalColor.lerpColors(colorCoreInner, colorAccretion, ratio / 0.4);
      } else {
        finalColor.lerpColors(colorAccretion, colorEdgePurple, (ratio - 0.4) / 0.6);
      }

      diskColors[i * 3] = finalColor.r;
      diskColors[i * 3 + 1] = finalColor.g;
      diskColors[i * 3 + 2] = finalColor.b;

      diskRadii.push(r);
      diskAngles.push(angle);
      diskSpeeds.push((0.02 + Math.random() * 0.015) * (4.5 / r)); // Inner tracks orbit faster (Keplerian)
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

    // Custom glowing point material
    const diskMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const accretionDisk = new THREE.Points(diskGeo, diskMat);
    scene.add(accretionDisk);

    // 4. Create Background Starfield (Deep space)
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Scatter randomly inside a vast sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 90 + Math.random() * 160;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      starPos[i * 3] = x;
      starPos[i * 3 + 1] = y;
      starPos[i * 3 + 2] = z;

      // Class-type star color distribution (blue giants, amber dwarfs, cosmic white dwarfs)
      const roll = Math.random();
      let starColor = new THREE.Color(0xffffff);
      if (roll < 0.25) starColor = new THREE.Color(0xaaccff); // cool blue
      else if (roll < 0.45) starColor = new THREE.Color(0xffeedd); // warm yellow
      else if (roll < 0.555) starColor = new THREE.Color(0xc17dff); // soft nebula magenta/purple

      starColors[i * 3] = starColor.r;
      starColors[i * 3 + 1] = starColor.g;
      starColors[i * 3 + 2] = starColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // 5. Build Orbiting Track Planets (The Habitable Planets)
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const planetsList: THREE.Mesh[] = [];

    PLANET_DATA.forEach((data, index) => {
      // Place orbiting the black hole at varying stable boundaries
      const distance = 14 + index * 4.5;
      const angle = (index * (2 * Math.PI)) / PLANET_DATA.length;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Planet sphere body with stylized mesh structure
      const planetGeo = new THREE.SphereGeometry(data.radius, 16, 16);
      const planetMat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.6,
        metalness: 0.4,
        emissive: data.color,
        emissiveIntensity: 0.15,
        wireframe: false,
      });

      const planet = new THREE.Mesh(planetGeo, planetMat);
      planet.position.set(x, 0, z);
      planetGroup.add(planet);
      planetsList.push(planet);

      // Orbital holographic wire rings (elegant Artistic Flair detail)
      const ringGeo = new THREE.RingGeometry(data.radius * 1.35, data.radius * 1.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        opacity: 0.15,
        transparent: true,
      });
      const orbitRing = new THREE.Mesh(ringGeo, ringMat);
      orbitRing.rotation.x = Math.PI / 2;
      planet.add(orbitRing);
    });

    // 6. Handle Container Resize Responsively
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || !entries[0] || !containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    resizeObserver.observe(containerRef.current);

    // 7. Core Animation & Gravitational warping ticks loop
    let clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Slow orbital drift for disk particles
      const posArray = accretionDisk.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < diskParticleCount; i++) {
        diskAngles[i] += diskSpeeds[i] * (1.0 + scrollProgress * 1.5); // Accretion disk speeds up with rocket scroll progress
        const r = diskRadii[i];
        posArray[i * 3] = Math.cos(diskAngles[i]) * r;
        posArray[i * 3 + 2] = Math.sin(diskAngles[i]) * r;
        // Subtle vertical coordinate wave
        posArray[i * 3 + 1] = Math.sin(time + r) * 0.12 * (11 - r) / 7.5;
      }
      accretionDisk.geometry.attributes.position.needsUpdate = true;
      accretionDisk.rotation.y = time * 0.01;

      // Slow drift stars during travel speed
      starfield.rotation.y = time * 0.003 + scrollProgress * 0.05;
      starfield.rotation.x = Math.sin(time * 0.05) * 0.01;

      // Spin planets around their own axes & nudge orbits
      planetsList.forEach((planet, idx) => {
        planet.rotation.y += 0.006 * (idx + 1);
        
        // Orbit update positions
        const distance = 14 + idx * 4.5;
        const currentAngle = (idx * (2 * Math.PI)) / PLANET_DATA.length + time * 0.015;
        planet.position.x = Math.cos(currentAngle) * distance;
        planet.position.z = Math.sin(currentAngle) * distance;
      });

      // Camera path dynamic interpolation (Lerp logic for cinematic spatial transitions)
      if (activePlanetIdx === null) {
        // Deep space orbit coordinate system based on rocket scroll progress
        const offsetRadius = 22 + scrollProgress * 14;
        const orbitAngle = time * 0.018 + scrollProgress * Math.PI;

        targetCamPos.current.set(
          Math.cos(orbitAngle) * offsetRadius,
          5 + scrollProgress * 8 + Math.sin(time * 0.1) * 3,
          Math.sin(orbitAngle) * offsetRadius
        );
        targetLookAt.current.set(0, -1, 0); // Focus on Gargantua accretion center
      } else if (activePlanetIdx >= 0 && activePlanetIdx < planetsList.length) {
        // Space pilot targeting a specific habitable planet track
        const targetPlanet = planetsList[activePlanetIdx];
        if (targetPlanet) {
          const planetWorldPos = new THREE.Vector3();
          targetPlanet.getWorldPosition(planetWorldPos);

          // Position camera slightly offset and slightly elevated looking down holographic planet
          targetCamPos.current.set(
            planetWorldPos.x + 2.8,
            planetWorldPos.y + 1.2,
            planetWorldPos.z + 4.2
          );
          targetLookAt.current.copy(planetWorldPos);
        }
      }

      // Smooth camera movements with cinematic speed decay
      currentCamPos.current.lerp(targetCamPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup WebGL bindings on unmount
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose materials & geometries safely
      blackHoleGeo.dispose();
      blackHoleMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      starGeo.dispose();
      starMat.dispose();

      scene.clear();
      renderer.dispose();
    };
  }, [scrollProgress, activePlanetIdx]);

  return (
    <div 
      id="three-renderer-canvas"
      ref={containerRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#020204]"
      style={{ contentVisibility: 'auto' }}
    />
  );
}
