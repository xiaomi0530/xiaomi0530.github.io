/* An original, dependency-free studio sculpture. No images or network requests. */
(() => {
  'use strict';

  const canvas = document.getElementById('hero-art');
  if (!canvas) return;

  const TAU = Math.PI * 2;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    width: 1, height: 1, time: 0, last: 0, raf: 0,
    paused: false, visible: true, reduced: motionQuery.matches,
    pointerX: 0, pointerY: 0, x: 0, y: 0, energy: 0,
  };

  const normalize = v => {
    const length = Math.hypot(...v) || 1;
    return v.map(n => n / length);
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  function curve(t) {
    const r = 1.66 + 0.58 * Math.cos(3 * t);
    return [r * Math.cos(2 * t), r * Math.sin(2 * t), 0.68 * Math.sin(3 * t)];
  }

  function sculpture(segments = 240, sides = 36) {
    const positions = [], normals = [], occlusion = [], indices = [];
    const centers = Array.from({ length: segments }, (_, i) => curve(i / segments * TAU));
    for (let i = 0; i <= segments; i++) {
      const t = i / segments * TAU;
      const center = curve(t), before = curve(t - .001), after = curve(t + .001);
      const tangent = normalize(after.map((value, k) => value - before[k]));
      const first = normalize(cross(tangent, [0, 0, 1]));
      const second = normalize(cross(first, tangent));
      for (let j = 0; j <= sides; j++) {
        const a = j / sides * TAU;
        // A subtly oval section catches long, architectural reflections.
        const radius = .345 + .024 * Math.sin(3 * t + .65);
        const normal = normalize(first.map((n, k) => n * Math.cos(a) + second[k] * Math.sin(a) / 1.14));
        const point = center.map((n, k) => n + radius * (first[k] * Math.cos(a) + second[k] * Math.sin(a) * 1.14));
        positions.push(...point);
        normals.push(...normal);
        let shade = 0;
        for (let sample = 0; sample < segments; sample += 8) {
          const separation = Math.min(Math.abs(sample - i), segments - Math.abs(sample - i));
          if (separation < 20) continue;
          const distance = centers[sample].map((n, k) => n - point[k]);
          const length = Math.hypot(...distance);
          shade += Math.max(0, dot(normal, distance) / length) * .115 / (length * length + .07);
        }
        occlusion.push(Math.max(.3, Math.exp(-shade * 1.65)));
        if (i < segments && j < sides) {
          const p = i * (sides + 1) + j;
          indices.push(p, p + sides + 1, p + 1, p + 1, p + sides + 1, p + sides + 2);
        }
      }
    }
    return { positions, normals, occlusion, indices };
  }

  function rotationMatrix(x, y, z) {
    const sx = Math.sin(x), cx = Math.cos(x), sy = Math.sin(y), cy = Math.cos(y), sz = Math.sin(z), cz = Math.cos(z);
    return new Float32Array([
      cy * cz, cy * sz, -sy,
      sx * sy * cz - cx * sz, sx * sy * sz + cx * cz, sx * cy,
      cx * sy * cz + sx * sz, cx * sy * sz - sx * cz, cx * cy,
    ]);
  }

  const vertexSource = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute float aOcclusion;
    uniform mat3 uRotation;
    uniform float uAspect;
    uniform float uLift;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vOcclusion;
    void main() {
      vec3 p = uRotation * aPosition;
      p.y += uLift;
      vPosition = p;
      vNormal = uRotation * aNormal;
      vOcclusion = aOcclusion;
      float depth = 7.6 - p.z;
      float scale = 2.35;
      gl_Position = vec4(p.x * scale / uAspect, p.y * scale, (depth - .2) * 1.0134 - .2, depth);
    }
  `;

  const fragmentSource = `
    precision highp float;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vOcclusion;
    uniform float uEnergy;

    float softbox(vec3 r, vec3 direction, float width, float height, float softness) {
      vec3 right = normalize(cross(direction, vec3(0.0, 1.0, .001)));
      vec3 up = normalize(cross(right, direction));
      float forward = dot(r, direction);
      vec2 p = vec2(dot(r, right), dot(r, up)) / max(.01, forward);
      vec2 edge = smoothstep(vec2(width, height), vec2(width + softness, height + softness), abs(p));
      return (1.0 - edge.x) * (1.0 - edge.y) * smoothstep(.0, .12, forward);
    }

    vec3 environment(vec3 r) {
      float sky = smoothstep(-.7, 1.0, r.y);
      vec3 color = mix(vec3(.018, .023, .020), vec3(.20, .23, .24), sky);
      // The sculpture reflects a virtual photographic studio, with broad
      // panels, a narrow strip light, and a small lime card off to one side.
      color += vec3(2.7, 2.8, 2.72) * softbox(r, normalize(vec3(-.75, .55, 1.0)), .33, 1.35, .045);
      color += vec3(1.70, 1.83, 1.98) * softbox(r, normalize(vec3(.82, .15, .64)), .10, 1.7, .035);
      color += vec3(1.35, 1.40, 1.38) * softbox(r, normalize(vec3(.20, 1.0, -.15)), 1.3, .28, .06);
      color += vec3(.72, .74, .70) * softbox(r, normalize(vec3(-.20, -.8, .65)), .8, .16, .08);
      color += vec3(.33, .41, .09) * softbox(r, normalize(vec3(-1.0, -.30, -.20)), .13, .55, .07) * (0.5 + uEnergy);
      color *= 1.0 - .72 * softbox(r, normalize(vec3(.0, .08, 1.0)), .095, 2.0, .022);
      return color;
    }

    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vec3(0.0, 0.0, 7.6) - vPosition);
      if (!gl_FrontFacing) n = -n;
      vec3 reflected = reflect(-v, n);
      float facing = max(dot(n, v), .0);
      float fresnel = pow(1.0 - facing, 5.0);
      vec3 metal = environment(reflected);
      vec3 light = normalize(vec3(-3.0, 5.0, 5.0));
      float diffuse = max(dot(n, light), .0);
      float highlight = pow(max(dot(n, normalize(light + v)), .0), 140.0);
      vec3 color = metal * mix(.72, 1.06, fresnel) * mix(.40, 1.0, vOcclusion);
      color += vec3(.095, .101, .099) * diffuse * vOcclusion;
      color += vec3(.85) * highlight;
      color += vec3(.028, .034, .026) * fresnel;
      color = color / (color + vec3(.67));
      color = pow(color, vec3(.88));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  let render;
  let gl;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: true, powerPreference: 'low-power', premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL unavailable');

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const mesh = sculpture();
    const bindAttribute = (name, values, size) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    };
    bindAttribute('aPosition', mesh.positions, 3);
    bindAttribute('aNormal', mesh.normals, 3);
    bindAttribute('aOcclusion', mesh.occlusion, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
    const uniforms = Object.fromEntries(['uRotation', 'uAspect', 'uLift', 'uEnergy'].map(name => [name, gl.getUniformLocation(program, name)]));
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0, 0, 0, 0);

    render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const t = state.time;
      const rotation = rotationMatrix(.56 + Math.sin(t * .17) * .07 + state.y * .13, -.35 + t * .095 + state.x * .19, -.24 + Math.sin(t * .11) * .05);
      gl.uniformMatrix3fv(uniforms.uRotation, false, rotation);
      gl.uniform1f(uniforms.uAspect, state.width / state.height);
      gl.uniform1f(uniforms.uLift, .05 + Math.sin(t * .55) * .035);
      gl.uniform1f(uniforms.uEnergy, state.energy);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    };
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      state.paused = true;
      cancelAnimationFrame(state.raf);
    });
  } catch (error) {
    // A WebGL context cannot be changed into a 2D context on the same canvas.
    const fallback = canvas.cloneNode(false);
    canvas.replaceWith(fallback);
    const context = fallback.getContext('2d');
    const mesh = sculpture(112, 18);
    const faces = [];
    for (let i = 0; i < mesh.indices.length; i += 3) faces.push(mesh.indices.slice(i, i + 3));

    render = () => {
      fallback.width = canvas.width;
      fallback.height = canvas.height;
      if (!context) return;
      const width = fallback.width, height = fallback.height;
      context.clearRect(0, 0, width, height);
      const m = rotationMatrix(.56 + state.y * .13, -.35 + state.time * .095 + state.x * .19, -.24);
      const rotate = (source, index) => [0, 1, 2].map(k => m[k] * source[index] + m[k + 3] * source[index + 1] + m[k + 6] * source[index + 2]);
      const projected = [];
      for (let i = 0; i < mesh.positions.length; i += 3) {
        const p = rotate(mesh.positions, i), normal = rotate(mesh.normals, i);
        const scale = height * 1.175 / (7.6 - p[2]);
        projected.push({ x: width / 2 + p[0] * scale, y: height / 2 - p[1] * scale, z: p[2], normal });
      }
      const ordered = faces.map(face => ({ face, z: face.reduce((sum, p) => sum + projected[p].z, 0) / 3 })).sort((a, b) => a.z - b.z);
      const light = normalize([-.5, .65, .8]);
      for (const { face } of ordered) {
        const a = projected[face[0]], b = projected[face[1]], c = projected[face[2]];
        const normal = normalize(a.normal.map((n, k) => (n + b.normal[k] + c.normal[k]) / 3));
        const base = Math.max(0, dot(normal, light));
        const band = Math.pow(Math.max(0, 1 - Math.abs(normal[0] + .32)), 12);
        const rim = Math.pow(1 - Math.abs(normal[2]), 3);
        const luminance = Math.round(Math.min(245, 28 + base * 107 + band * 150 + rim * 53));
        context.fillStyle = `rgb(${luminance},${Math.min(255, luminance + 3)},${Math.min(255, luminance + 2)})`;
        context.strokeStyle = context.fillStyle;
        context.lineWidth = .8;
        context.beginPath();
        context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.lineTo(c.x, c.y); context.closePath();
        context.fill(); context.stroke();
      }
    };
    state.fallback = fallback;
  }

  const activeCanvas = state.fallback || canvas;
  function resize() {
    const rect = activeCanvas.getBoundingClientRect();
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    render();
  }

  function animate(now) {
    state.raf = 0;
    if (state.paused || state.reduced || !state.visible || document.hidden) return;
    const delta = state.last ? Math.min((now - state.last) / 1000, .05) : 0;
    state.last = now;
    state.time += delta * (1 + state.energy * .8);
    state.x += (state.pointerX - state.x) * .045;
    state.y += (state.pointerY - state.y) * .045;
    render();
    state.raf = requestAnimationFrame(animate);
  }

  function resume() {
    cancelAnimationFrame(state.raf);
    state.last = 0;
    render();
    if (!state.paused && !state.reduced && state.visible && !document.hidden) state.raf = requestAnimationFrame(animate);
  }

  activeCanvas.addEventListener('pointermove', event => {
    if (state.reduced) return;
    const rect = activeCanvas.getBoundingClientRect();
    state.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
    state.pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
  }, { passive: true });
  activeCanvas.addEventListener('pointerleave', () => { state.pointerX = 0; state.pointerY = 0; }, { passive: true });

  document.addEventListener('visibilitychange', resume);
  const motionChange = event => { state.reduced = event.matches; resume(); };
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionChange);
  else motionQuery.addListener(motionChange);

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(activeCanvas);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      state.visible = entries[0].isIntersecting;
      resume();
    }, { rootMargin: '120px' }).observe(activeCanvas);
  }

  window.portfolioArt = {
    setPaused(value) { state.paused = Boolean(value); resume(); return state.paused; },
    setEnergy(value) { state.energy = Math.max(0, Math.min(1, Number(value) || 0)); render(); },
    get paused() { return state.paused; },
    get reducedMotion() { return state.reduced; },
  };

  resize();
  resume();
})();
