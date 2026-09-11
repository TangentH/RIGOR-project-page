'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { assetUrl } from './asset-url';

const PREVIEW_URL = assetUrl('/media/floor1-0505-run1-preview.ply');

export default function PointCloudViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [status, setStatus] = useState('Scroll to load the 3D preview');

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatus('Loading point cloud…');
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !nearViewport) return;

    let disposed = false;
    let points: THREE.Points | null = null;
    let frame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f6f8');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
    camera.up.set(0, 1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      queueMicrotask(() => { if (!disposed) setStatus('Interactive preview is unavailable in this browser.'); });
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = true;

    const initialCamera = new THREE.Vector3();
    const resetView = () => {
      camera.position.copy(initialCamera);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    const resetButton =
      container.querySelector<HTMLButtonElement>('[data-reset-view]');
    resetButton?.addEventListener('click', resetView);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    new PLYLoader().load(
      PREVIEW_URL,
      (geometry) => {
        if (disposed) {
          geometry.dispose();
          return;
        }
        geometry.computeBoundingSphere();
        const sphere = geometry.boundingSphere;
        if (!sphere || !Number.isFinite(sphere.radius) || sphere.radius <= 0) {
          geometry.dispose();
          setStatus('The point-cloud preview is invalid.');
          return;
        }
        geometry.translate(-sphere.center.x, -sphere.center.y, -sphere.center.z);
        const material = new THREE.PointsMaterial({
          size: Math.max(sphere.radius * 0.0017, 0.012),
          sizeAttenuation: true,
          vertexColors: geometry.hasAttribute('color'),
          color: geometry.hasAttribute('color') ? 0xffffff : 0x4f7294,
        });
        points = new THREE.Points(geometry, material);
        scene.add(points);

        const distance =
          sphere.radius /
          Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.48));
        initialCamera.set(
          distance * 0.72,
          distance * 0.48,
          distance * 0.72,
        );
        camera.near = Math.max(distance / 1000, 0.01);
        camera.far = distance * 12;
        camera.updateProjectionMatrix();
        resetView();
        setStatus('');
      },
      undefined,
      () => setStatus('Could not load the point-cloud preview.'),
    );

    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resetButton?.removeEventListener('click', resetView);
      resizeObserver.disconnect();
      controls.dispose();
      if (points) {
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      }
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [nearViewport]);

  return (
    <div
      className="point-cloud-viewer"
      ref={containerRef}
      aria-label="Interactive reconstruction preview"
    >
      {status && <p className="viewer-status">{status}</p>}
      <div className="viewer-help">
        Drag to rotate · scroll to zoom · right-drag to pan
      </div>
      <button className="viewer-reset" type="button" data-reset-view>
        Reset view
      </button>
    </div>
  );
}

