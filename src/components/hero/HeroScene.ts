import * as THREE from "three";
import { CAPABILITIES } from "./capabilities";

/**
 * Escena 3D del hero.
 * - Red de nodos y conexiones en profundidad, con partículas y pulsos de datos.
 * - Núcleo central con el símbolo S+N de SIBNOVA.
 * - Con el scroll (progress 0 → 1) el símbolo cede paso a seis capacidades
 *   que emergen del núcleo: AI · APPS · WEB · CLOUD · AUTOMATION · DATA.
 * Pensada para rendimiento: una sola escena, materiales básicos (sin luces),
 * geometrías reutilizadas, DPR limitado y render solo cuando es visible.
 */

export type LabelFrame = { x: number; y: number; alpha: number }[];

type Options = {
  canvas: HTMLCanvasElement;
  logoUrl: string;
  mobile: boolean;
  onFrame?: (labels: LabelFrame) => void;
};

const BLUE = new THREE.Color("#2E7DFF");
const BLUE_2 = new THREE.Color("#779EFF");
const WHITE = new THREE.Color("#F5F7FB");

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function radialTexture(size: number, stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private world = new THREE.Group();
  private core = new THREE.Group();
  private caps = new THREE.Group();
  private logo?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private glow: THREE.Sprite;
  private orb: THREE.Sprite;
  private plate: THREE.Sprite;
  private rings: THREE.Mesh[] = [];
  private capNodes: THREE.Sprite[] = [];
  private capLines: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private pulses: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private pulseState: { a: number; b: number; t: number; speed: number }[] = [];
  private nodePositions: Float32Array;
  private edges: [number, number][] = [];
  private disposables: { dispose: () => void }[] = [];
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private progress = 0;
  private smoothProgress = 0;
  private pointer = new THREE.Vector2();
  private smoothPointer = new THREE.Vector2();
  private width = 1;
  private height = 1;
  private mobile: boolean;
  private onFrame?: (labels: LabelFrame) => void;
  private tmp = new THREE.Vector3();

  constructor({ canvas, logoUrl, mobile, onFrame }: Options) {
    this.mobile = mobile;
    this.onFrame = onFrame;

    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr < 2, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor("#050609", 1);

    this.camera = new THREE.PerspectiveCamera(mobile ? 58 : 42, 1, 0.1, 100);
    this.camera.position.set(0, 0, mobile ? 13 : 11);
    this.scene.fog = new THREE.FogExp2("#050609", mobile ? 0.055 : 0.05);
    this.scene.add(this.world, this.core);

    const dot = radialTexture(64, [[0, "rgba(255,255,255,1)"], [0.35, "rgba(255,255,255,.85)"], [1, "rgba(255,255,255,0)"]]);
    const glowTex = radialTexture(256, [[0, "rgba(46,125,255,.9)"], [0.25, "rgba(46,125,255,.35)"], [0.6, "rgba(46,125,255,.08)"], [1, "rgba(46,125,255,0)"]]);
    this.disposables.push(dot, glowTex);

    // ---- Campo de partículas en profundidad ----
    const count = mobile ? 420 : 1100;
    const pPos = new Float32Array(count * 3);
    const pCol = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 12;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pPos[i * 3 + 2] = r * Math.cos(ph);
      const c = Math.random() < 0.28 ? WHITE : BLUE_2;
      const k = 0.35 + Math.random() * 0.5;
      pCol[i * 3] = c.r * k; pCol[i * 3 + 1] = c.g * k; pCol[i * 3 + 2] = c.b * k;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({ size: mobile ? 0.085 : 0.07, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.world.add(new THREE.Points(pGeo, pMat));
    this.disposables.push(pGeo, pMat);

    // ---- Red de nodos (esfera de Fibonacci) y conexiones ----
    const n = mobile ? 70 : 140;
    const R = 5.4;
    this.nodePositions = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const j = 1 + (Math.random() - 0.5) * 0.18;
      this.nodePositions[i * 3] = Math.cos(th) * rad * R * j;
      this.nodePositions[i * 3 + 1] = y * R * 0.82 * j;
      this.nodePositions[i * 3 + 2] = Math.sin(th) * rad * R * j;
    }
    const seen = new Set<string>();
    for (let i = 0; i < n; i++) {
      const d: [number, number][] = [];
      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const dx = this.nodePositions[i * 3] - this.nodePositions[k * 3];
        const dy = this.nodePositions[i * 3 + 1] - this.nodePositions[k * 3 + 1];
        const dz = this.nodePositions[i * 3 + 2] - this.nodePositions[k * 3 + 2];
        d.push([dx * dx + dy * dy + dz * dz, k]);
      }
      d.sort((a, b) => a[0] - b[0]);
      for (let m = 0; m < 3; m++) {
        const k = d[m][1];
        const key = i < k ? `${i}-${k}` : `${k}-${i}`;
        if (!seen.has(key)) { seen.add(key); this.edges.push([i, k]); }
      }
    }
    const ePos = new Float32Array(this.edges.length * 6);
    this.edges.forEach(([a, b], idx) => {
      ePos.set(this.nodePositions.subarray(a * 3, a * 3 + 3), idx * 6);
      ePos.set(this.nodePositions.subarray(b * 3, b * 3 + 3), idx * 6 + 3);
    });
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    const eMat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending });
    this.world.add(new THREE.LineSegments(eGeo, eMat));
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute("position", new THREE.BufferAttribute(this.nodePositions, 3));
    const nMat = new THREE.PointsMaterial({ size: 0.13, map: dot, color: BLUE_2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    this.world.add(new THREE.Points(nGeo, nMat));
    this.disposables.push(eGeo, eMat, nGeo, nMat);

    // ---- Pulsos de datos que viajan por las conexiones ----
    const pulseCount = mobile ? 12 : 28;
    const puPos = new Float32Array(pulseCount * 3);
    for (let i = 0; i < pulseCount; i++) this.pulseState.push(this.newPulse(Math.random()));
    const puGeo = new THREE.BufferGeometry();
    puGeo.setAttribute("position", new THREE.BufferAttribute(puPos, 3));
    const puMat = new THREE.PointsMaterial({ size: 0.2, map: dot, color: new THREE.Color("#BFD3FF"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    this.pulses = new THREE.Points(puGeo, puMat);
    this.world.add(this.pulses);
    this.disposables.push(puGeo, puMat);

    // ---- Núcleo: brillo, anillos, orbe y símbolo S+N ----
    const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 });
    this.glow = new THREE.Sprite(glowMat);
    this.glow.scale.setScalar(mobile ? 7.5 : 8.5);
    this.core.add(this.glow);
    this.disposables.push(glowMat);

    // Placa de luz detrás del símbolo: permite mostrar el logo original (letras S y N negras) sobre fondo oscuro
    const plateTex = radialTexture(256, [[0, "rgba(245,247,251,1)"], [0.46, "rgba(238,243,255,.97)"], [0.72, "rgba(170,196,255,.32)"], [1, "rgba(46,125,255,0)"]]);
    const plateMat = new THREE.SpriteMaterial({ map: plateTex, transparent: true, depthWrite: false, opacity: 1, fog: false });
    this.plate = new THREE.Sprite(plateMat);
    this.plate.position.z = 0.1;
    this.core.add(this.plate);
    this.disposables.push(plateTex, plateMat);

    const orbMat = new THREE.SpriteMaterial({ map: dot, color: new THREE.Color("#CFE0FF"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    this.orb = new THREE.Sprite(orbMat);
    this.orb.scale.setScalar(0.001);
    this.core.add(this.orb);
    this.disposables.push(orbMat);

    [2.55, 3.05].forEach((r, i) => {
      const g = new THREE.TorusGeometry(r, 0.007, 8, 180);
      const m = new THREE.MeshBasicMaterial({ color: i ? BLUE_2 : BLUE, transparent: true, opacity: i ? 0.28 : 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
      const ring = new THREE.Mesh(g, m);
      ring.rotation.x = i ? 1.15 : 1.35;
      ring.rotation.y = i ? -0.5 : 0.35;
      this.rings.push(ring);
      this.core.add(ring);
      this.disposables.push(g, m);
    });

    new THREE.TextureLoader().load(logoUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const w = mobile ? 3 : 3.5;
      const geo = new THREE.PlaneGeometry(w, w / 2.12);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, fog: false });
      this.logo = new THREE.Mesh(geo, mat);
      this.logo.position.z = 0.2;
      this.core.add(this.logo);
      this.disposables.push(tex, geo, mat);
      if (!this.running) this.renderFrame(0);
    });

    // ---- Seis capacidades que emergen del núcleo ----
    this.core.add(this.caps);
    CAPABILITIES.forEach(() => {
      const m = new THREE.SpriteMaterial({ map: dot, color: BLUE_2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
      const s = new THREE.Sprite(m);
      s.scale.setScalar(0.001);
      this.capNodes.push(s);
      this.caps.add(s);
      this.disposables.push(m);
    });
    const clGeo = new THREE.BufferGeometry();
    clGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(CAPABILITIES.length * 6), 3));
    const clMat = new THREE.LineBasicMaterial({ color: BLUE_2, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    this.capLines = new THREE.LineSegments(clGeo, clMat);
    this.caps.add(this.capLines);
    this.disposables.push(clGeo, clMat);
  }

  private newPulse(t = 0) {
    const [a, b] = this.edges.length ? this.edges[(Math.random() * this.edges.length) | 0] : [0, 0];
    return { a, b, t, speed: 0.25 + Math.random() * 0.45 };
  }

  setProgress(p: number) { this.progress = clamp01(p); }
  setPointer(x: number, y: number) { this.pointer.set(x, y); }

  resize(w: number, h: number) {
    this.width = Math.max(1, w);
    this.height = Math.max(1, h);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    // Encuadre: en escritorio el núcleo se desplaza a la derecha (el texto va a la izquierda);
    // en móvil se sube para dejar el texto abajo.
    if (this.mobile) this.camera.setViewOffset(this.width, this.height, 0, this.height * 0.17, this.width, this.height);
    else this.camera.setViewOffset(this.width, this.height, -this.width * 0.21, 0, this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.renderFrame(this.clock.getDelta());
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Dibuja un único fotograma estático (movimiento reducido). */
  renderStatic(progress: number) {
    this.progress = this.smoothProgress = progress;
    this.renderFrame(0);
  }

  private renderFrame(dt: number) {
    const t = this.clock.elapsedTime;
    this.smoothProgress += (this.progress - this.smoothProgress) * Math.min(1, dt * 6 || 1);
    this.smoothPointer.lerp(this.pointer, Math.min(1, dt * 3 || 1));
    const p = this.smoothProgress;

    // Cámara: acercamiento con el scroll y parallax con el ratón
    const baseZ = this.mobile ? 13 : 11;
    this.camera.position.z = baseZ - easeInOut(range(p, 0, 1)) * (this.mobile ? 2.2 : 2.6);
    this.camera.position.x = this.smoothPointer.x * 0.7;
    this.camera.position.y = this.smoothPointer.y * 0.45 + easeInOut(range(p, 0.55, 1)) * 0.6;
    this.camera.lookAt(0, 0, 0);

    // Red: rotación lenta + rotación ligada al scroll
    this.world.rotation.y = t * 0.035 + p * 1.25;
    this.world.rotation.x = 0.18 + p * 0.22;

    // Pulsos por las conexiones
    const pos = this.pulses.geometry.attributes.position as THREE.BufferAttribute;
    this.pulseState.forEach((s, i) => {
      s.t += dt * s.speed;
      if (s.t >= 1) Object.assign(s, this.newPulse(0));
      const a = s.a * 3, b = s.b * 3, np = this.nodePositions;
      pos.setXYZ(i, np[a] + (np[b] - np[a]) * s.t, np[a + 1] + (np[b + 1] - np[a + 1]) * s.t, np[a + 2] + (np[b + 2] - np[a + 2]) * s.t);
    });
    pos.needsUpdate = true;

    // Núcleo: el símbolo S+N cede paso a las capacidades
    const morph = easeInOut(range(p, 0.28, 0.62));
    const breathe = 1 + Math.sin(t * 1.4) * 0.025;
    this.core.rotation.y = this.smoothPointer.x * 0.25;
    this.core.rotation.x = -this.smoothPointer.y * 0.18;
    if (this.logo) {
      this.logo.material.opacity = 1 - morph * 0.82;
      this.logo.scale.setScalar((1 - morph * 0.3) * breathe);
    }
    const plateW = (this.mobile ? 4 : 4.7) * (1 - morph * 0.3) * breathe;
    this.plate.scale.set(plateW, plateW * 0.62, 1);
    this.plate.material.opacity = 1 - morph;
    this.glow.material.opacity = 0.75 + morph * 0.2 + Math.sin(t * 1.4) * 0.05;
    this.orb.material.opacity = morph * 0.9;
    this.orb.scale.setScalar(0.001 + morph * 0.9 * breathe);
    this.rings[0].rotation.z = t * 0.25 + p * 2;
    this.rings[1].rotation.z = -t * 0.18 - p * 1.6;
    this.rings.forEach((r, i) => r.scale.setScalar(1 + morph * (i ? 0.35 : 0.2)));

    const appear = easeOut(range(p, 0.34, 0.66));
    const radius = (this.mobile ? 2.05 : 3.9) * appear;
    const spin = t * 0.06 + p * 0.9;
    const lp = this.capLines.geometry.attributes.position as THREE.BufferAttribute;
    const labels: LabelFrame = [];
    this.camera.updateMatrixWorld();
    this.core.updateMatrixWorld();
    this.capNodes.forEach((s, i) => {
      const a = spin + (i / this.capNodes.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius * (this.mobile ? 1.12 : 0.62);
      const z = Math.sin(a) * radius * 0.35;
      s.position.set(x, y, z);
      s.scale.setScalar(0.001 + appear * 0.42);
      s.material.opacity = appear;
      lp.setXYZ(i * 2, 0, 0, 0);
      lp.setXYZ(i * 2 + 1, x, y, z);
      this.tmp.set(x, y, z).applyMatrix4(this.core.matrixWorld).project(this.camera);
      labels.push({
        x: (this.tmp.x * 0.5 + 0.5) * this.width,
        y: (-this.tmp.y * 0.5 + 0.5) * this.height,
        alpha: appear * clamp01(1 - range(p, 0.9, 1) * 0.6),
      });
    });
    lp.needsUpdate = true;
    this.capLines.material.opacity = appear * 0.35;

    this.renderer.render(this.scene, this.camera);
    this.onFrame?.(labels);
  }

  dispose() {
    this.stop();
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}
