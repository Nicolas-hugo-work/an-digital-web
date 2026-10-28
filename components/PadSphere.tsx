"use client";

/*
  Objeto 3D del hero: esfera cubierta de almohadillas infladas con malla wireframe (inspirada en reference/minot-ref.png).

  Cómo está hecho:
  - Geometría (CPU, una sola vez): icosaedro geodésico de frecuencia F. Cada triángulo pequeño es una almohadilla:
    se subdivide en N×N, cada vértice se proyecta a la esfera y se desplaza hacia fuera con un perfil inflado
    sobre un triángulo interior (margen uniforme δ = membrana): h ∝ (27·b0'·b1'·b2')^0.42, que es la forma de una
    membrana inflada en un triángulo; el umbral pequeño redondea las esquinas. Sin aristas ni puntas.
    Entre almohadillas queda una membrana plana (t = 0).
  - Shader: retícula con fract() + fwidth() en coordenadas locales de cada celda:
    anillos concéntricos + radios sobre las almohadillas; radios en estrella + anillos densos en la membrana.
    Luz difusa envolvente, especular suave, oclusión en la base de cada almohadilla y rim lavanda / cian.
  - Movimiento: rotación lenta, reacción al puntero y parallax con el scroll. Con prefers-reduced-motion: un frame estático.
  - Rendimiento: se monta tras el primer pintado (next/dynamic sin SSR + idle callback), DPR limitado,
    menos segmentos en móvil y pausa con IntersectionObserver / pestaña oculta. Sin WebGL2 se queda el fallback CSS.
*/

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Quality = { F: number; N: number; dpr: number };

function buildPadGeometry({ F, N }: Quality) {
  // Icosaedro base
  const t = (1 + Math.sqrt(5)) / 2;
  const base = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((v) => new THREE.Vector3(...(v as [number, number, number])).normalize());
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  // Triángulos geodésicos (cada uno = una almohadilla)
  const pads: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [];
  const lat = (A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3, i: number, j: number) =>
    new THREE.Vector3()
      .addScaledVector(A, (F - i - j) / F)
      .addScaledVector(B, i / F)
      .addScaledVector(C, j / F)
      .normalize();
  for (const [a, b, c] of faces) {
    const A = base[a], B = base[b], C = base[c];
    for (let i = 0; i < F; i++) {
      for (let j = 0; j < F - i; j++) {
        pads.push([lat(A, B, C, i, j), lat(A, B, C, i + 1, j), lat(A, B, C, i, j + 1)]);
        if (i + j < F - 1) pads.push([lat(A, B, C, i + 1, j), lat(A, B, C, i + 1, j + 1), lat(A, B, C, i, j + 1)]);
      }
    }
  }

  const vPerPad = ((N + 1) * (N + 2)) / 2;
  const total = pads.length * vPerPad;
  const pos = new Float32Array(total * 3);
  const bary = new Float32Array(total * 3);
  const tAttr = new Float32Array(total);
  const hAttr = new Float32Array(total);
  const local = new Float32Array(total * 2);
  const rand = new Float32Array(total);
  const index = new Uint32Array(pads.length * N * N * 3);

  // Perfil de la almohadilla: triángulo interior con margen DELTA (membrana de ancho uniforme)
  // f = 27·b0'·b1'·b2' vale 1 en el centro y 0 en el borde del triángulo interior
  const DELTA = 0.012;
  const GAP = 0.13; // umbral que redondea las esquinas (almohadilla en forma de triángulo muy redondeado)
  const H = (0.62 * 1.1) / F; // altura de las almohadillas respecto al radio
  // Disposición 2D equilátera para las coordenadas locales (centro en 0, esquinas a radio 1)
  const L2 = [[0, 1], [-0.866, -0.5], [0.866, -0.5]];

  let seed = 1234567;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const s = new THREE.Vector3();
  let v = 0;
  let k = 0;
  pads.forEach(([P0, P1, P2], p) => {
    const pr = rnd();
    const tilt = rnd() * Math.PI * 2;
    const tx = Math.cos(tilt), ty = Math.sin(tilt);
    const amp = 0.85 + rnd() * 0.3;
    const first = v;
    for (let a = 0; a <= N; a++) {
      for (let b = 0; b <= N - a; b++) {
        const c = N - a - b;
        const b0 = c / N, b1 = a / N, b2 = b / N;
        s.set(0, 0, 0).addScaledVector(P0, b0).addScaledVector(P1, b1).addScaledVector(P2, b2).normalize();
        const i0 = (b0 - DELTA) / (1 - 3 * DELTA), i1 = (b1 - DELTA) / (1 - 3 * DELTA), i2 = (b2 - DELTA) / (1 - 3 * DELTA);
        const f = i0 > 0 && i1 > 0 && i2 > 0 ? 27 * i0 * i1 * i2 : 0;
        const tt = Math.min(1, Math.max(0, (f - GAP) / (1 - GAP)));
        const lx = b0 * L2[0][0] + b1 * L2[1][0] + b2 * L2[2][0];
        const ly = b0 * L2[0][1] + b1 * L2[1][1] + b2 * L2[2][1];
        // perfil inflado (sube rápido desde la membrana y se redondea arriba) + leve asimetría tipo gota
        const h0 = Math.pow(tt, 0.42);
        const h = h0 * amp * (1 + 0.24 * (lx * tx + ly * ty));
        const r = 1 + H * h;
        pos[v * 3] = s.x * r; pos[v * 3 + 1] = s.y * r; pos[v * 3 + 2] = s.z * r;
        bary[v * 3] = b0; bary[v * 3 + 1] = b1; bary[v * 3 + 2] = b2;
        tAttr[v] = tt;
        hAttr[v] = h0;
        local[v * 2] = lx; local[v * 2 + 1] = ly;
        rand[v] = pr;
        v++;
      }
    }
    // índices de la retícula triangular de la celda
    const row = (a: number) => first + (a * (2 * N + 3 - a)) / 2; // índice del primer vértice de la fila a
    for (let a = 0; a < N; a++) {
      for (let b = 0; b < N - a; b++) {
        const i0 = row(a) + b, i1 = row(a) + b + 1, i2 = row(a + 1) + b;
        index[k++] = i0; index[k++] = i2; index[k++] = i1;
        if (b < N - a - 1) {
          const i3 = row(a + 1) + b + 1;
          index[k++] = i1; index[k++] = i2; index[k++] = i3;
        }
      }
    }
    void p;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aBary", new THREE.BufferAttribute(bary, 3));
  geo.setAttribute("aT", new THREE.BufferAttribute(tAttr, 1));
  geo.setAttribute("aH", new THREE.BufferAttribute(hAttr, 1));
  geo.setAttribute("aLocal", new THREE.BufferAttribute(local, 2));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  geo.setIndex(new THREE.BufferAttribute(index.subarray(0, k), 1));
  geo.computeVertexNormals();
  return geo;
}

const vertexShader = /* glsl */ `
  attribute vec3 aBary;
  attribute float aT;
  attribute float aH;
  attribute vec2 aLocal;
  attribute float aRand;
  varying vec3 vN;
  varying vec3 vView;
  varying vec3 vBary;
  varying float vT;
  varying float vH;
  varying vec2 vLocal;
  varying float vRand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vBary = aBary;
    vT = aT;
    vH = aH;
    vLocal = aLocal;
    vRand = aRand;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLight;
  varying vec3 vN;
  varying vec3 vView;
  varying vec3 vBary;
  varying float vT;
  varying float vH;
  varying vec2 vLocal;
  varying float vRand;

  // Línea antialiasada con fwidth; si las líneas se juntan demasiado se funden en un tono medio (sin moiré)
  float gridLine(float x, float width) {
    float fw = max(fwidth(x), 1e-4);
    float g = abs(fract(x - 0.5) - 0.5) / fw;
    float line = 1.0 - smoothstep(width - 0.5, width + 0.5, g);
    return mix(line, 0.28, smoothstep(0.18, 0.45, fw));
  }

  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(vView);
    vec3 L = normalize(uLight);

    float pad = smoothstep(0.0, 0.03, vT);

    // Luz de estudio: difusa envolvente + especular suave
    float ndl = dot(N, L);
    float diff = clamp((ndl + 0.2) / 1.2, 0.0, 1.0);
    vec3 Hh = normalize(L + V);
    float spec = pow(max(dot(N, Hh), 0.0), 36.0);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    // Oclusión en la base de cada almohadilla (pliegue con la membrana)
    float crease = exp(-pow((vH - 0.1) / 0.16, 2.0));
    // sombra de contacto: la membrana se oscurece junto a la base de cada almohadilla
    // sombra de contacto: la membrana se oscurece junto a la base de cada almohadilla (f ≈ 0.13) y se aclara en las estrellas
    float f = 27.0 * vBary.x * vBary.y * vBary.z;
    float memShade = mix(0.45, 1.0, smoothstep(0.0, 0.09, 0.13 - f));
    float ao = mix(memShade, 1.0, pad) * (1.0 - 0.5 * crease * pad);
    float light = diff * ao;

    // Malla de las almohadillas: retícula de cuadros en coordenadas locales de cada celda (girada al azar por celda)
    // que se "infla" con la altura para seguir la curvatura, como el wireframe de la referencia
    float a = vRand * 6.2831853;
    vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * vLocal;
    q *= 1.0 + 0.4 * vH;
    float padLines = max(gridLine(q.x * 9.5, 0.55), gridLine(q.y * 9.5, 0.55));

    // Membrana: radios en estrella desde cada vértice + anillos densos
    vec3 b = vBary;
    float mx = max(b.x, max(b.y, b.z));
    float sp = b.x >= mx ? b.y / (b.y + b.z + 1e-5) : (b.y >= mx ? b.z / (b.z + b.x + 1e-5) : b.x / (b.x + b.y + 1e-5));
    // los radios solo cerca de cada vértice (estrellas), no a lo largo de toda la arista
    float memLines = max(gridLine(sp * 30.0, 0.5), gridLine((1.0 - mx) * 40.0, 0.5) * 0.35);

    float lines = mix(memLines, padLines, pad);

    // Paleta de la referencia: violeta #5650A0, luces lavanda #786DAE…#C9C2FF, sombras #2A2560
    vec3 shadowCol = vec3(0.10, 0.085, 0.25);
    vec3 fillPad = vec3(0.31, 0.28, 0.66);
    vec3 fillMem = vec3(0.40, 0.37, 0.78);
    vec3 lineLit = vec3(0.82, 0.79, 1.0);

    vec3 fill = mix(fillMem, fillPad, pad);
    vec3 base = mix(shadowCol, fill, light);
    vec3 lineCol = mix(shadowCol * 0.7, lineLit, pow(light, 1.35));
    vec3 col = mix(base, lineCol, lines * mix(0.45, 0.92, pad));

    col += spec * 0.28 * vec3(0.92, 0.9, 1.0) * ao;
    col += fres * 0.30 * vec3(0.62, 0.56, 1.0);
    col += fres * max(-N.y, 0.0) * 0.22 * vec3(0.49, 0.89, 0.96);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function PadSphere() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hero = host.closest(".hero") as HTMLElement | null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 760;
    const quality: Quality = small || coarse ? { F: 7, N: 12, dpr: 1.5 } : { F: 7, N: 18, dpr: 1.75 };

    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let visible = true;
    let cleanup = () => {};

    const start = () => {
      if (disposed) return;
      // Comprobamos WebGL2 nosotros mismos: si no hay, se queda el fallback CSS sin que Three.js llegue a registrar errores
      const canvas = document.createElement("canvas");
      const ctxOpts = { antialias: true, alpha: true, powerPreference: "high-performance" as const };
      const gl = canvas.getContext("webgl2", ctxOpts) as WebGL2RenderingContext | null;
      if (!gl) {
        host.classList.add("is-fallback");
        return;
      }
      try {
        renderer = new THREE.WebGLRenderer({ canvas, context: gl, ...ctxOpts });
      } catch {
        host.classList.add("is-fallback");
        return;
      }
      const r = renderer;
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dpr));
      r.setClearColor(0x000000, 0);
      r.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(r.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
      const geometry = buildPadGeometry(quality);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uLight: { value: new THREE.Vector3(-0.3, 0.78, 0.55).normalize() } },
      });
      const mesh = new THREE.Mesh(geometry, material);
      const pivot = new THREE.Group();
      pivot.add(mesh);
      scene.add(pivot);

      // Encuadre: la esfera llena el fondo a sangre (sale por la derecha y por abajo)
      const base = { x: 0, y: 0, hh: 1 };
      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        r.setSize(w, h, false);
        const aspect = w / h;
        camera.aspect = aspect;
        const fov = THREE.MathUtils.degToRad(camera.fov / 2);
        const wide = aspect >= 1;
        // radio en píxeles y centro en fracciones de la pantalla
        const rp = wide ? Math.max(h * 0.9, w * 0.44) : w * 1.45;
        const cx = wide ? 0.74 : 0.64;
        const cy = wide ? 0.9 : 1.02;
        const hh = (h / 2) / rp; // media altura visible en unidades del radio (R = 1)
        camera.position.set(0, 0, hh / Math.tan(fov) + 0.0);
        camera.updateProjectionMatrix();
        base.x = (cx * 2 - 1) * hh * aspect;
        base.y = (1 - cy * 2) * hh;
        base.hh = hh;
        if (!raf) render(performance.now());
      };

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      let last = performance.now();
      let spin = 0.6;
      const render = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) spin += dt * 0.045;
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        const vh = window.innerHeight || 1;
        const scroll = Math.min(1.5, window.scrollY / vh);
        pivot.position.set(base.x, base.y + scroll * base.hh * 0.55, 0);
        mesh.rotation.set(0.42 + pointer.y * 0.07 + scroll * 0.35, spin + pointer.x * 0.12, 0.1);
        r.render(scene, camera);
      };

      const loop = (now: number) => {
        raf = 0;
        if (!visible || disposed) return;
        render(now);
        raf = requestAnimationFrame(loop);
      };
      const play = () => {
        if (reduce || raf || !visible || document.hidden) return;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      };
      const pause = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      resize();
      requestAnimationFrame(() => host.classList.add("is-ready"));

      const ro = new ResizeObserver(resize);
      ro.observe(host);
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      });
      io.observe(hero ?? host);
      const onVis = () => (document.hidden ? pause() : play());
      document.addEventListener("visibilitychange", onVis);
      if (!reduce && !coarse) window.addEventListener("pointermove", onPointer, { passive: true });
      play();

      cleanup = () => {
        pause();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onPointer);
        geometry.dispose();
        material.dispose();
        r.dispose();
        r.domElement.remove();
      };
    };

    // Después del primer pintado: el texto del hero (LCP) no espera a la geometría
    // (Safari antiguo no tiene requestIdleCallback → setTimeout)
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle ? window.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 120);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup();
    };
  }, []);

  return <div className="hero-3d" ref={hostRef} aria-hidden="true" />;
}
