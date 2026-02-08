'use client';

import { useEffect, useRef } from 'react';

export default function BgPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) {
      console.error('WebGL2 not available');
      return;
    }

    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');

    // ── Shader helpers ──
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('GLSL error:', gl.getShaderInfoLog(s));
      return s;
    };
    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        console.error('Link error:', gl.getProgramInfoLog(p));
      return p;
    };
    const u1i = (p: WebGLProgram, n: string, v: number) =>
      gl.uniform1i(gl.getUniformLocation(p, n), v);
    const u1f = (p: WebGLProgram, n: string, v: number) =>
      gl.uniform1f(gl.getUniformLocation(p, n), v);
    const u2f = (p: WebGLProgram, n: string, a: number, b: number) =>
      gl.uniform2f(gl.getUniformLocation(p, n), a, b);

    // ── Shaders ──
    const VS = `#version 300 es
      layout(location=0) in vec2 p;
      out vec2 uv;
      void main() {
        uv = p * 0.5 + 0.5;
        gl_Position = vec4(p, 0.0, 1.0);
      }`;

    // Ripple simulation: R = height, G = velocity
    const updateFS = `#version 300 es
      precision highp float;
      uniform sampler2D uData;
      uniform vec2 uTxl;
      uniform vec2 uMouse;
      uniform float uSpeed;
      uniform float uTime;
      in vec2 uv;
      out vec4 o;
      void main() {
        vec2 d = texture(uData, uv).rg;
        float h = d.r, v = d.g;

        // Sample neighbours
        float hL = texture(uData, uv - vec2(uTxl.x, 0.0)).r;
        float hR = texture(uData, uv + vec2(uTxl.x, 0.0)).r;
        float hT = texture(uData, uv + vec2(0.0, uTxl.y)).r;
        float hB = texture(uData, uv - vec2(0.0, uTxl.y)).r;

        // Smooth, fast wave propagation
        float avg = (hL + hR + hT + hB) * 0.25;
        v += (avg - h) * 6.0;
        v *= 0.955;
        h += v * 0.022;

        // Mouse drag — strong center, wide smooth taper
        float dist = distance(uv, uMouse);
        float falloff = exp(-dist * dist * 350.0);
        h += uSpeed * falloff * 0.25;

        // Subtle ambient undulation
        h += sin(uv.x * 8.0 + uTime * 0.4) * sin(uv.y * 6.0 + uTime * 0.3) * 0.0003;

        o = vec4(h, v, 0.0, 1.0);
      }`;

    // Render: displace image UVs + specular highlights
    const renderFS = `#version 300 es
      precision highp float;
      uniform sampler2D uImg;
      uniform sampler2D uData;
      uniform vec2 uTxl;
      uniform vec2 uMouse;
      in vec2 uv;
      out vec4 o;
      void main() {
        // Wider gradient sample for smoother displacement
        vec2 ts = uTxl * 1.5;
        float hL = texture(uData, uv - vec2(ts.x, 0.0)).r;
        float hR = texture(uData, uv + vec2(ts.x, 0.0)).r;
        float hT = texture(uData, uv + vec2(0.0, ts.y)).r;
        float hB = texture(uData, uv - vec2(0.0, ts.y)).r;
        vec2 disp = vec2(hR - hL, hT - hB) * 0.25;

        vec2 tc = clamp(uv + disp, 0.0, 1.0);
        vec3 c = texture(uImg, tc).rgb;

        // Smooth surface normal (higher z = flatter, gentler highlights)
        vec3 N = normalize(vec3(hL - hR, hB - hT, 0.5));
        vec3 V = vec3(0.0, 0.0, 1.0);
        vec3 L = normalize(vec3(0.4, 0.6, 1.0));
        vec3 H = normalize(L + V);

        // Softer, broader specular
        float spec = pow(max(dot(N, H), 0.0), 40.0) * 0.45;
        c += spec * vec3(0.85, 0.88, 1.0);

        // Secondary fill light
        vec3 L2 = normalize(vec3(-0.5, -0.3, 0.8));
        vec3 H2 = normalize(L2 + V);
        float spec2 = pow(max(dot(N, H2), 0.0), 20.0) * 0.18;
        c += spec2 * vec3(0.6, 0.55, 0.5);

        // Darken troughs
        float h = texture(uData, uv).r;
        c *= 1.0 - clamp(-h * 2.5, 0.0, 0.15);

        // Cursor glow matching wider radius
        float cd = distance(uv, uMouse);
        c += exp(-cd * cd * 350.0) * 0.035;

        o = vec4(c, 1.0);
      }`;

    const updateProg = link(VS, updateFS);
    const renderProg = link(VS, renderFS);

    // ── Geometry ──
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // ── Ripple FBOs (ping-pong) ──
    const S = 512;
    const mkFBO = () => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, S, S, 0, gl.RGBA, gl.FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const f = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      return { t, f };
    };
    const fbo = [mkFBO(), mkFBO()];
    let ci = 0;

    // ── Image texture ──
    const imgTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    const img = new Image();
    img.src = '/bgtest.png';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // ── Mouse state ──
    const m = { x: 0.5, y: 0.5, speed: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / innerWidth;
      const ny = 1 - e.clientY / innerHeight;
      const dx = nx - m.x, dy = ny - m.y;
      m.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 60, 1.0);
      m.x = nx;
      m.y = ny;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const nx = t.clientX / innerWidth;
      const ny = 1 - t.clientY / innerHeight;
      const dx = nx - m.x, dy = ny - m.y;
      m.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 60, 1.0);
      m.x = nx;
      m.y = ny;
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // ── Resize ──
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
    };
    resize();
    addEventListener('resize', resize);

    // ── Render loop ──
    let raf: number;
    let time = 0;

    const SIM_STEPS = 3; // Multiple steps per frame for fast propagation

    const frame = (now: number) => {
      time = now / 1000;
      gl.bindVertexArray(vao);

      // 1. Run multiple simulation steps per frame
      for (let step = 0; step < SIM_STEPS; step++) {
        const dst = 1 - ci;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[dst].f);
        gl.viewport(0, 0, S, S);
        gl.useProgram(updateProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fbo[ci].t);
        u1i(updateProg, 'uData', 0);
        u2f(updateProg, 'uTxl', 1 / S, 1 / S);
        u2f(updateProg, 'uMouse', m.x, m.y);
        u1f(updateProg, 'uSpeed', step === 0 ? m.speed : 0);
        u1f(updateProg, 'uTime', time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        ci = dst;
      }

      // Decay mouse speed
      m.speed *= 0.8;

      // 2. Render image with displacement
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(renderProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      u1i(renderProg, 'uImg', 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fbo[ci].t);
      u1i(renderProg, 'uData', 1);
      u2f(renderProg, 'uTxl', 1 / S, 1 / S);
      u2f(renderProg, 'uMouse', m.x, m.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden" style={{ cursor: 'none' }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
