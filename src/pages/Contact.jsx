import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

import frankenthal from '../assets/frankenthal.png';
import blood_meridian from '../assets/blood_meridian.png'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  { label: 'Books', href: '/books' },
  { label: 'Playpen', href: '/playpen' },
];

function Embers({ className = '', count = 10 }) {
  return (
    <div className={`embers ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="ember" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Fire: a real WebGL fragment shader (GLSL simplex noise, fuel-at-bottom
// flame with rising smoke and sparks), not a hand-authored CSS shape.
// The paper's erosion is driven by sampling this same shader's rendered
// brightness per column each frame, so the uneven edge comes from actual
// turbulent noise, not a fixed set of offsets.
// ---------------------------------------------------------------------

const VERTEX_SRC = `
attribute vec3 position;
void main(void) {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec4 mouse;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float prng(in vec2 seed) {
  seed = fract(seed * vec2(5.3983, 5.4427));
  seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
  return fract(seed.x * seed.y);
}

float PI = 3.1415926535897932384626433832795;

float noiseStack(vec3 pos, int octaves, float falloff) {
  float noise = snoise(pos);
  float off = 1.0;
  if (octaves > 1) { pos *= 2.0; off *= falloff; noise = (1.0-off)*noise + off*snoise(pos); }
  if (octaves > 2) { pos *= 2.0; off *= falloff; noise = (1.0-off)*noise + off*snoise(pos); }
  if (octaves > 3) { pos *= 2.0; off *= falloff; noise = (1.0-off)*noise + off*snoise(pos); }
  return (1.0 + noise) / 2.0;
}

vec2 noiseStackUV(vec3 pos, int octaves, float falloff) {
  float a = noiseStack(pos, octaves, falloff);
  float b = noiseStack(pos + vec3(3984.293, 423.21, 5235.19), octaves, falloff);
  return vec2(a, b);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float xpart = fragCoord.x / resolution.x;
  float ypart = fragCoord.y / resolution.y;

  float clip = 210.0;
  float ypartClip = fragCoord.y / clip;
  float ypartClippedFalloff = clamp(2.0 - ypartClip, 0.0, 1.0);
  float ypartClipped = min(ypartClip, 1.0);
  float ypartClippedn = 1.0 - ypartClipped;

  float xfuel = smoothstep(0.0, 1.0, 1.0 - abs(2.0 * xpart - 1.0));

  float realTime = 0.5 * time;
  vec2 offset = mouse.xy + cos(time);

  vec2 coordScaled = 0.01 * fragCoord - 0.02 * vec2(offset.x, 0.0);
  vec3 position = vec3(coordScaled, 0.0) + vec3(1223.0, 6434.0, 8425.0);
  vec3 flow = vec3(4.1*(0.5-xpart)*pow(ypartClippedn,4.0), -2.0*xfuel*pow(ypartClippedn,64.0), 0.0);
  vec3 timing = realTime * vec3(0.0, -1.7, 1.1) + flow;

  vec3 displacePos = vec3(1.0,0.5,1.0)*2.4*position + realTime*vec3(0.01,-0.7,1.3);
  vec3 displace3 = vec3(noiseStackUV(displacePos, 2, 0.4), 0.0);

  vec3 noiseCoord = vec3(2.0,1.0,1.0)*position + timing + 0.4*displace3;
  float noise = noiseStack(noiseCoord, 3, 0.4);

  float flames = pow(ypartClipped, 0.3*xfuel) * pow(noise, 0.3*xfuel);
  float f = ypartClippedFalloff * pow(1.0 - flames*flames*flames, 8.0);
  float fff = f*f*f;
  vec3 fire = 1.5 * vec3(f, fff, fff*fff);

  float smokeNoise = 0.5 + snoise(0.4*position + timing*vec3(1.0,1.0,0.2)) / 2.0;
  // smoke should THIN as it rises, not thicken — strongest just above the
  // flame, fading smoothly toward the top and edges rather than growing
  // into a hazy block.
  float smokeHeightFade = pow(clamp(1.0 - ypart, 0.0, 1.0), 1.7);
  vec3 smoke = vec3(0.32 * pow(xfuel, 2.2) * smokeHeightFade * (smokeNoise + 0.4*(1.0-noise)));

  float sparkGridSize = 30.0;
  vec2 sparkCoord = fragCoord - vec2(2.0*offset.x, 190.0*realTime);
  sparkCoord -= 30.0 * noiseStackUV(0.01*vec3(sparkCoord, 30.0*time), 1, 0.4);
  sparkCoord += 100.0 * flow.xy;
  if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0) sparkCoord.x += 0.5 * sparkGridSize;
  vec2 sparkGridIndex = vec2(floor(sparkCoord / sparkGridSize));
  float sparkRandom = prng(sparkGridIndex);
  float sparkLife = min(10.0*(1.0-min((sparkGridIndex.y+(190.0*realTime/sparkGridSize))/(24.0-20.0*sparkRandom),1.0)),1.0);
  vec3 sparks = vec3(0.0);
  if (sparkLife > 0.0) {
    float sparkSize = xfuel*xfuel*sparkRandom*0.08;
    float sparkRadians = 999.0*sparkRandom*2.0*PI + 2.0*time;
    vec2 sparkCircular = vec2(sin(sparkRadians), cos(sparkRadians));
    vec2 sparkOffset = (0.5-sparkSize)*sparkGridSize*sparkCircular;
    vec2 sparkModulus = mod(sparkCoord+sparkOffset, sparkGridSize) - 0.5*vec2(sparkGridSize);
    float sparkLength = length(sparkModulus);
    float sparksGray = max(0.0, 1.0 - sparkLength/(sparkSize*sparkGridSize));
    sparks = sparkLife * sparksGray * vec3(1.0, 0.3, 0.0);
  }

  vec3 result = max(fire, sparks) + smoke;
  // fade in over the first few pixels at the very bottom of the canvas —
  // without this the flame's base just stops dead at a flat line, which
  // reads as a distinct geometric shape rather than blending away.
  float edgeFade = smoothstep(0.0, 16.0, fragCoord.y);
  // Alpha now tracks actual brightness instead of being pinned to 1.0.
  // With alpha always 1.0, every "black" (unlit) pixel of the canvas was
  // fully opaque black — mix-blend-mode:screen normally makes opaque
  // black look invisible, but .contact-form's  creates its
  // own stacking context, which isolates that blend and can cause the
  // opaque black to paint solid over the background instead of blending
  // away. Real per-pixel transparency sidesteps that entirely: unlit
  // areas are actually transparent now, regardless of stacking context.
  float alpha = clamp(max(result.r, max(result.g, result.b)), 0.0, 1.0);
  gl_FragColor = vec4(result * edgeFade, alpha * edgeFade);
}
`;

const RENDER_W = 200;
const RENDER_H = 260;
const COLS = 40; // paper-erosion sampling columns, grouped from RENDER_W
const MAX_BURN_MS = 2000;
const FINISH_FRACTION = 0.97;
const EROSION_RATE_PER_MS = 1 / 1250; // baseline; per-column rate scales with sampled fire brightness
const FLAME_BAND_PX = 130; // fixed height of the traveling flame band

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

// paper burns top-down, traveling toward the bottom — the fixed-height
// flame band (see FireCanvas positioning below) slides down to track it,
// and its bottom edge always sits at the current front, letting the
// shader's own fuel-at-bottom design work naturally: flame rises from the
// front into the space that's already burned away above it.
function buildMaskImage(erosion) {
  const layers = new Array(COLS);
  for (let c = 0; c < COLS; c++) {
    const eaten = Math.min(100, erosion[c] * 100); // % of column height gone, from the top
    const s0 = Math.max(0, eaten - 1.5).toFixed(2);
    const s1 = (eaten + 0.5).toFixed(2);
    const s2 = (eaten + 1.5).toFixed(2);
    const s3 = (eaten + 3).toFixed(2);
    const solidFrom = (eaten + 5).toFixed(2);
    layers[c] =
      `linear-gradient(to bottom, transparent 0%, transparent ${s0}%, ` +
      `rgba(0,0,0,0.75) ${s1}%, rgba(0,0,0,0.15) ${s2}%, ` +
      `rgba(0,0,0,0.8) ${s3}%, #000 ${solidFrom}%, #000 100%)`;
  }
  return layers.join(', ');
}

function FireCanvas({ glRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return undefined;

    canvas.width = RENDER_W;
    canvas.height = RENDER_H;

    const program = createProgram(gl);
    if (!program) return undefined;
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const mouseLoc = gl.getUniformLocation(program, 'mouse');

    gl.viewport(0, 0, RENDER_W, RENDER_H);

    const start = performance.now();
    let rafId;

    function frame(now) {
      const t = (now - start) / 1000;
      if (resLoc) gl.uniform2f(resLoc, RENDER_W, RENDER_H);
      if (timeLoc) gl.uniform1f(timeLoc, t);
      // gentle automatic wind drift standing in for a pointer — kept
      // small so the flame flickers in place rather than visibly sliding
      if (mouseLoc) gl.uniform4f(mouseLoc, 8 * Math.sin(t * 0.17), 4 * Math.cos(t * 0.13), 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    if (glRef) glRef.current = gl;

    return () => {
      cancelAnimationFrame(rafId);
      if (glRef) glRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="flame-canvas" aria-hidden="true" />;
}

// Drives the paper erosion by sampling the fire canvas's own rendered
// brightness per column each frame — the unevenness comes directly from
// the shader's turbulence, not from any authored offsets. Also positions
// the flame band so it physically travels down the paper as the average
// front advances, rather than sitting fixed in one place.
function usePaperBurn(paperContentRef, flameBandRef, fireCanvasGetter, active, onFinished) {
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const paperEl = paperContentRef.current;
    if (!paperEl) return undefined;

    const sizeStr = new Array(COLS).fill(`${100 / COLS}% 100%`).join(', ');
    const posStr = Array.from({ length: COLS }, (_, c) => `${(c * 100) / COLS}% 0%`).join(', ');
    paperEl.style.maskSize = sizeStr;
    paperEl.style.webkitMaskSize = sizeStr;
    paperEl.style.maskPosition = posStr;
    paperEl.style.webkitMaskPosition = posStr;
    paperEl.style.maskRepeat = 'no-repeat';
    paperEl.style.webkitMaskRepeat = 'no-repeat';

    const erosion = new Float32Array(COLS).fill(0);
    const startTime = performance.now();
    let lastTime = startTime;
    let finished = false;
    let pixelBuf = null;

    function tick(now) {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;

      const gl = fireCanvasGetter();
      let intensity = null;
      if (gl) {
        if (!pixelBuf) pixelBuf = new Uint8Array(RENDER_W * 4);
        // sample a row a few px above the very bottom edge — always
        // within the shader's fueled band, so this reflects real,
        // constantly-shifting turbulence rather than a static value.
        try {
          gl.readPixels(0, 6, RENDER_W, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuf);
          intensity = pixelBuf;
        } catch {
          intensity = null;
        }
      }

      const groupWidth = RENDER_W / COLS;
      let goneCount = 0;
      let sum = 0;
      for (let c = 0; c < COLS; c++) {
        let bright = 0.6; // fallback if readback isn't available yet
        if (intensity) {
          const startPx = Math.floor(c * groupWidth);
          const endPx = Math.floor((c + 1) * groupWidth);
          let brightSum = 0;
          let n = 0;
          for (let px = startPx; px < endPx; px++) {
            const idx = px * 4;
            brightSum += Math.max(intensity[idx], intensity[idx + 1], intensity[idx + 2]) / 255;
            n++;
          }
          bright = n > 0 ? brightSum / n : 0.6;
        }
        // floor kept high enough that even a column sampling zero
        // brightness the whole time (the shader's flame naturally dims
        // toward the left/right edges) still finishes with room to spare
        // inside MAX_BURN_MS — brightness only adds a speed bonus on top,
        // it no longer gates whether a column can complete at all.
        const rate = EROSION_RATE_PER_MS * dt * (0.85 + bright * 0.9);
        erosion[c] = Math.min(1, erosion[c] + rate);
        sum += erosion[c];
        if (erosion[c] >= 1) goneCount++;
      }

      const maskStr = buildMaskImage(erosion);
      paperEl.style.maskImage = maskStr;
      paperEl.style.webkitMaskImage = maskStr;

      // slide the flame band down so its bottom edge tracks the average
      // front — the shader's own fuel-at-bottom flame then rises upward
      // into the area that's already burned away above it.
      const avgProgress = sum / COLS;
      const bandEl = flameBandRef.current;
      if (bandEl) {
        bandEl.style.top = `calc(${avgProgress * 100}% - ${FLAME_BAND_PX}px)`;
      }

      const elapsed = now - startTime;
      if (!finished && (goneCount / COLS >= FINISH_FRACTION || elapsed >= MAX_BURN_MS)) {
        finished = true;
        onFinished();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

export default function ContactPage() {
  // idle | sending | burning | done | error
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);
  const paperContentRef = useRef(null);
  const flameBandRef = useRef(null);
  const fireGLRef = useRef(null);
  const burnoutTimeout = useRef(null);

  const getFireGL = useCallback(() => fireGLRef.current, []);

  const handleBurnFinished = useCallback(() => {
    const formEl = formRef.current;
    if (formEl) formEl.classList.add('is-burnout');
    burnoutTimeout.current = setTimeout(() => {
      if (formEl) formEl.reset();
      setStatus('done');
    }, 340);
  }, []);

  usePaperBurn(paperContentRef, flameBandRef, getFireGL, status === 'burning', handleBurnFinished);

  useEffect(() => {
    return () => {
      if (burnoutTimeout.current) clearTimeout(burnoutTimeout.current);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target);

    // Flip to false when you're ready to actually send to Formspree —
    // while true, this skips the network call entirely (no submissions
    // land in your account) and just simulates a successful send after a
    // short delay, so you can test the burn animation freely.
    const USE_PLACEHOLDER_SUBMIT = false;

    if (USE_PLACEHOLDER_SUBMIT) {
      setTimeout(() => setStatus('burning'), 500);
      return;
    }

    try {
      const res = await fetch('https://formspree.io/f/xqerjrop', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        // Only start the burn once Formspree has actually confirmed —
        // never on click, so nobody sees a "sent" form that failed.
        setStatus('burning');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const formVisible = status !== 'done';

  return (
    <div className="hero-with-form">
      <img src={blood_meridian} className="hero-bg" alt="" />
      <div className="hero-scrim" aria-hidden="true" />

      <nav className="site-nav">
        <Link className="site-nav__brand" to="/">
          <img
            src={frankenthal}
            alt="Sigruna"
            className="site-nav__logo"
          />
        </Link>

        <ul className="site-nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={link.label === 'Contact' ? 'is-active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {formVisible && (
        <form
          ref={formRef}
          className={`contact-form${status === 'sending' ? ' is-sending' : ''}${
            status === 'burning' ? ' is-burning' : ''
          }`}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {status === 'burning' && (
            <div
              ref={flameBandRef}
              className="flame-band"
              style={{ top: `-${FLAME_BAND_PX}px`, height: `${FLAME_BAND_PX}px` }}
            >
              <FireCanvas glRef={fireGLRef} />
              <Embers className="embers--burn" />
            </div>
          )}

          <div ref={paperContentRef} className="contact-form__paper-content">
            <fieldset
              disabled={status === 'sending' || status === 'burning'}
              className="contact-form__fields"
            >
              <p className="contact-form__eyebrow">Contact me</p>
              <h2>Submit a form if ya want</h2>

              <div className="contact-form__divider" aria-hidden="true">
                <span />
                <i>&#10022;</i>
                <span />
              </div>

              <p className="contact-form__lead"></p>

              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" autoComplete="off" required />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" autoComplete="off" required />

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" autoComplete="off" required />

              {/* honeypot field — hidden from real users, traps bots */}
              <input
                type="text"
                name="_gotcha"
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <button type="submit">
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              {status === 'error' && (
                <p className="form-note error">Something went wrong — try again.</p>
              )}
            </fieldset>
          </div>
        </form>
      )}

      {status === 'done' && (
        <div className="ash-panel">
          <Embers className="embers--ambient" count={12} />
          <div className="ash-panel__divider" aria-hidden="true">
            <span />
            <i>&#10022;</i>
            <span />
          </div>
          <h2>Message sent</h2>
          <p>Will get back soon</p>
          <div className="ash-panel__divider" aria-hidden="true">
            <span />
            <i>&#10022;</i>
            <span />
          </div>
          <button
            type="button"
            className="ash-panel__reset"
            onClick={() => setStatus('idle')}
          >
            Send another
          </button>
        </div>
      )}
    </div>
  );
}
