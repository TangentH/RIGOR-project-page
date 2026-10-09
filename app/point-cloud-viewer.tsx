'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { assetUrl } from './asset-url';

type Method = {
  id: string; label: string; url: string; previewPoints: number;
  detailUrl?: string; detailPoints?: number;
  note?: string;
  metrics?: { chamfer_m: number; fscore_025: number };
};
type Scene = { id: string; label: string; run: string; radius: number; methods: Method[] };
type View = { position: number[]; target: number[]; up: number[] };

// All panels share the exported coordinate frame, camera and scale.
class ViewSync {
  constructor(readonly key: string) {}
  view: View | null = null;
  listeners = new Set<(view: View) => void>();
  publishing = false;
  interactive = false;
  interactionListeners = new Set<(active: boolean) => void>();
  interactionTimer: ReturnType<typeof setTimeout> | undefined;
  setInteraction(active: boolean) {
    clearTimeout(this.interactionTimer);
    const update = () => { this.interactive = active; this.interactionListeners.forEach((listener) => listener(active)); };
    if (active) update(); else this.interactionTimer = setTimeout(update, 180);
  }
  publish(view: View) {
    if (this.publishing) return;
    this.view = view;
    this.publishing = true;
    try { this.listeners.forEach((listener) => listener(view)); }
    finally { this.publishing = false; }
  }
}

function PointCloudPanel({ method, radius, sync, quality }: {
  method: Method | undefined; radius: number; sync: ViewSync; quality: 'auto' | 'light' | 'high';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Loading point cloud…');
  const [loadedPoints, setLoadedPoints] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !method) return;
    let disposed = false;
    let applying = false;
    let points: THREE.Points | null = null;
    let detailTimer: ReturnType<typeof setTimeout> | undefined;
    let fullCount = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f6f8');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, radius * 40);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch {
      queueMicrotask(() => { if (!disposed) setStatus('Interactive preview is unavailable in this browser.'); });
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    const render = () => { if (!disposed) renderer.render(scene, camera); };
    const applyView = (view: View) => {
      applying = true;
      camera.position.fromArray(view.position);
      camera.up.fromArray(view.up);
      controls.target.fromArray(view.target);
      controls.update();
      applying = false;
      render();
    };
    const defaultView = (): View => {
      const d = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.12 / Math.min(camera.aspect, 1);
      return { position: [d * 0.28, d * 0.91, d * 0.28], target: [0, 0, 0], up: [0, 1, 0] };
    };
    const onChange = () => {
      if (!applying) sync.publish({ position: camera.position.toArray(), target: controls.target.toArray(), up: camera.up.toArray() });
    };
    const onInteraction = (active: boolean) => {
      if (points) points.geometry.setDrawRange(0, active ? Math.min(180000, fullCount) : fullCount);
      render();
    };
    const onStart = () => sync.setInteraction(true);
    const onEnd = () => sync.setInteraction(false);
    sync.interactionListeners.add(onInteraction);
    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    controls.addEventListener('change', onChange);
    sync.listeners.add(applyView);
    const resetView = () => sync.publish(defaultView());
    const resetButton = container.querySelector<HTMLButtonElement>('[data-reset-view]');
    resetButton?.addEventListener('click', resetView);
    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (!sync.view) sync.publish(defaultView());
      else applyView(sync.view);
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    queueMicrotask(() => { if (!disposed) setStatus('Loading point cloud…'); });
    const abort = new AbortController();
    const loadCloud = async (url: string, expectedCount: number) => {
      const response = await fetch(assetUrl(url), { signal: abort.signal });
      if (!response.ok) throw new Error(`PLY request failed (${response.status})`);
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const geometry = new PLYLoader().parse(buffer);
      const positions = geometry.getAttribute('position');
      if (!positions || positions.count !== expectedCount) {
        geometry.dispose();
        throw new Error('Invalid point-cloud preview');
      }
      // Shared origin and scale; exported vertices are shuffled for uniform LOD.
      const material = new THREE.PointsMaterial({
        size: radius * 0.0022, sizeAttenuation: true,
        vertexColors: geometry.hasAttribute('color'),
        color: geometry.hasAttribute('color') ? 0xffffff : 0x4f7294,
      });
      if (points) {
        scene.remove(points);
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      }
      fullCount = positions.count;
      setLoadedPoints(fullCount);
      points = new THREE.Points(geometry, material);
      scene.add(points);
      onInteraction(sync.interactive);
      setStatus('');
      render();
    };
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const highDetail = quality === 'high' || (quality === 'auto' &&
      window.innerWidth >= 650 && (device.deviceMemory ?? 8) >= 4 &&
      !device.connection?.saveData);
    loadCloud(method.url, method.previewPoints)
      .then(() => {
        if (disposed || !highDetail || !method.detailUrl || !method.detailPoints) return;
        // Give the initial cloud a chance to paint before downloading detail.
        const upgrade = () => {
          if (disposed) return;
          if (sync.interactive) { detailTimer = setTimeout(upgrade, 300); return; }
          loadCloud(method.detailUrl!, method.detailPoints!).catch(() => {
            // Keep the usable lightweight cloud if the optional download fails.
          });
        };
        detailTimer = setTimeout(upgrade, 500);
      })
      .catch(() => { if (!disposed) setStatus('Could not load this reconstruction.'); });
    return () => {
      disposed = true;
      abort.abort();
      clearTimeout(detailTimer);
      observer.disconnect();
      sync.interactionListeners.delete(onInteraction);
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      sync.listeners.delete(applyView);
      resetButton?.removeEventListener('click', resetView);
      controls.removeEventListener('change', onChange);
      controls.dispose();
      points?.geometry.dispose();
      if (points) (points.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [method, radius, sync, quality]);

  return (
    <section className="point-cloud-panel" aria-label={`${method?.label ?? 'Baseline'} reconstruction preview`}>
      <div className="point-cloud-stage" ref={containerRef}>
        {(status || !method) && <output className="viewer-status">{method ? status : 'No additional baseline is available for this sequence.'}</output>}
        {method && <button className="viewer-reset" type="button" data-reset-view>Reset all views</button>}
      </div>
      {method?.note && <p className="viewer-method-note">{method.note}</p>}
      {loadedPoints > 0 && <p className="viewer-density">{loadedPoints.toLocaleString('en-US')} points</p>}
      {method?.metrics && <p className="viewer-metrics">CD <strong>{method.metrics.chamfer_m.toFixed(3)} m</strong> · F@25 <strong>{method.metrics.fscore_025.toFixed(3)}</strong></p>}
    </section>
  );
}

function ComparisonViewer() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [baselineId, setBaselineId] = useState('');
  const [quality, setQuality] = useState<'auto' | 'light' | 'high'>('auto');
  const [status, setStatus] = useState('Loading reconstruction comparison…');
  useEffect(() => {
    const abort = new AbortController();
    fetch(assetUrl('/media/comparison/manifest.json'), { signal: abort.signal })
      .then((response) => { if (!response.ok) throw new Error('Manifest unavailable'); return response.json(); })
      .then((data) => {
        const manifest = data as { scenes: Scene[] };
        if (!manifest.scenes?.length || manifest.scenes.some((scene) =>
          !Number.isFinite(scene.radius) || scene.radius <= 0 ||
          !scene.methods.some((method) => method.id === 'ours') ||
          !scene.methods.some((method) => method.id === 'panovggt'))) throw new Error('Invalid comparison manifest');
        setScenes(manifest.scenes);
        setStatus('');
      })
      .catch(() => { if (!abort.signal.aborted) setStatus('Reconstruction comparison is unavailable.'); });
    return () => abort.abort();
  }, []);
  const scene = scenes[0];
  const sync = useMemo(() => new ViewSync('floor5'), []);
  if (!scene) return <output className="section-intro">{status}</output>;
  const baselines = scene.methods.filter((method) => !['ours', 'panovggt'].includes(method.id));
  const baseline = baselines.find((method) => method.id === baselineId) ?? baselines[0];
  const shown = [scene.methods.find((method) => method.id === 'ours'), scene.methods.find((method) => method.id === 'panovggt'), baseline];
  return (
    <div className="point-cloud-viewer-grid" aria-label="Interactive reconstruction comparison">
      <div className="viewer-toolbar">
        <p className="viewer-sequence">{scene.label}</p>
        <label>Detail <select value={quality} onChange={(event) => setQuality(event.target.value as 'auto' | 'light' | 'high')}><option value="auto">Auto</option><option value="light">Lightweight</option><option value="high">High · up to 1 million points</option></select></label>

      </div>
      <div className="point-cloud-columns">
        {shown.map((method, index) => <div className="point-cloud-column" key={`${scene.id}-${index}`}>
          <div className="point-cloud-panel-header">
            {index < 2 ? <h3>{method?.label}</h3> : <label className="viewer-method-picker"><span className="sr-only">Comparison method</span><select aria-label="Comparison method" value={baseline?.id ?? ''} disabled={!baselines.length} onChange={(event) => setBaselineId(event.target.value)}>{baselines.length ? baselines.map((item) => <option key={item.id} value={item.id}>{item.label}</option>) : <option value="">Additional baseline</option>}</select></label>}
          </div>
          <PointCloudPanel method={method} radius={scene.radius} sync={sync} quality={quality} />
        </div>)}
      </div>
      <p className="viewer-help">Drag to rotate · scroll to zoom · right-drag to pan · views move together · full detail returns when you stop moving</p>
      <p className="viewer-protocol">Floor 5 · shared camera and maximum point budget. Ours, PanoVGGT and DA3-Sequential use archived evaluation-region reconstructions. Additional baselines are new full-sequence runs with global trajectory alignment. Partial maps indicate lost tracking. CD is Chamfer distance (lower is better); F@25 is F-score at 25 cm (higher is better). CD and F@25 are archived full-cloud metrics; newly rerun baselines are shown without these scores.</p>
    </div>
  );
}


export default function PointCloudViewer() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '320px' });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className="comparison-container">{visible ? <ComparisonViewer /> : <p className="section-intro">Scroll to explore the reconstructions.</p>}</div>;
}
