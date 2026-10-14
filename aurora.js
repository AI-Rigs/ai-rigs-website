/**
 * Photorealistic Aurora Borealis Animation Engine (WebGL)
 *
 * Features:
 * - Volumetric multi-layer drapery curtains with vertical magnetic ray striations
 * - Limb brightening / fold-density simulation for realistic pleated curtains
 * - Atmospheric magnetic field tilt (geomagnetic inclination)
 * - Physical spectral emission (atomic oxygen 557.7nm green -> cyan -> 630.0nm violet/magenta)
 * - Right-heavy spatial distribution (dramatic northern lights dance focused on the right)
 * - Twinkling cosmic starfield with natural atmospheric translucency
 * - Seamless color blend into site background (#070B14)
 * - Pure organic autonomous drift (no mouse reactive parallax)
 * - Performance-optimized with IntersectionObserver and DPR clamping
 */

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed_mult;

  // Exact AI Rigs background color (#070B14)
  const vec3 BG_DARK = vec3(0.02745, 0.04314, 0.07843);

  // Pseudo-random hash functions
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Value noise 2D
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractional Brownian Motion for atmospheric turbulence
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += amp * vnoise(p);
      p = rot * p * 2.05 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return v;
  }

  // Starfield background with atmospheric scintillation
  vec3 renderStars(vec2 uv, float time) {
    vec3 col = vec3(0.0);
    vec2 starGrid = uv * 90.0;
    vec2 id = floor(starGrid);
    vec2 f = fract(starGrid) - 0.5;

    float rnd = hash12(id);
    if (rnd > 0.93) {
      float dist = length(f);
      float rnd2 = hash12(id + 43.17);
      float rnd3 = hash12(id + 91.53);

      // Balanced in-between frequencies with randomized asynchronous phases
      float freq1 = 0.65 + rnd * 1.10;
      float freq2 = 0.40 + rnd2 * 0.75;
      float phase1 = rnd * 6.283;
      float phase2 = rnd2 * 6.283;
      float phase3 = rnd3 * 6.283;

      // Multi-harmonic interference for organic, unpredictable twinkling cycles
      float wave1 = sin(time * freq1 + phase1);
      float wave2 = cos(time * freq2 + phase2);
      float wave3 = sin(time * (freq1 * 0.6 + 0.2) + phase3);
      
      float twinkle = mix(0.50, 1.0, 0.5 + 0.32 * wave1 + 0.18 * wave2 * wave3);
      float star = smoothstep(0.09, 0.0, dist) * twinkle;
      
      // Star spectral classification (blue-white to warm amber)
      vec3 starColor = mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.92, 0.72), hash12(id + 17.0));
      col += star * starColor * (0.35 + 0.65 * rnd);
    }
    return col;
  }

  // Photorealistic Aurora Curtain Layer with Limb Brightening and Field Inclination
  vec4 renderCurtain(
    vec2 p,
    float arcCenterY,
    float arcSlope,
    float curveFreq,
    float curveAmp,
    float speed,
    float t,
    float rightWeight,
    float layerSeed
  ) {
    float ribbonX = p.x;

    // Sweeping parabolic arc path across the night sky
    float arc = arcCenterY + arcSlope * (ribbonX - 0.25) - 0.035 * (ribbonX * ribbonX);

    // Multi-octave harmonic pleated drapery folds
    float fold1 = sin(ribbonX * curveFreq + t * speed * 0.35 + layerSeed);
    float fold2 = cos(ribbonX * (curveFreq * 2.25) - t * speed * 0.22 + fold1 * 0.6) * 0.45;
    float fold3 = sin(ribbonX * (curveFreq * 4.8) + t * speed * 0.5 + fold2 * 0.4) * 0.22;
    float totalWave = (fold1 + fold2 + fold3) * curveAmp;

    // Organic domain warping for atmospheric turbulence
    vec2 warpCoord = vec2(ribbonX * 1.6 + t * speed * 0.12, p.y * 0.9 + layerSeed);
    float warp = (fbm(warpCoord) - 0.5) * 0.20;

    float curtainBase = arc + totalWave + warp;
    float yDist = p.y - curtainBase;

    // Quick rejection
    if (yDist < -0.06 || yDist > 0.78) {
      return vec4(0.0);
    }

    // Geomagnetic field line inclination
    float fieldTilt = (p.x - 0.3) * 0.10 - yDist * 0.07;
    float tiltedX = ribbonX + fieldTilt;

    // High-frequency vertical magnetic ray striations
    float ray1 = sin(tiltedX * 38.0 + t * speed * 1.1 + layerSeed);
    float ray2 = sin(tiltedX * 78.0 - t * speed * 0.75);
    float ray3 = sin(tiltedX * 145.0 + t * speed * 1.6);
    float fineRays = smoothstep(-0.6, 0.9, ray1 * 0.5 + ray2 * 0.35 + ray3 * 0.15);

    // Filament turbulence
    float filamentNoise = vnoise(vec2(tiltedX * 42.0 + t * speed * 0.7, p.y * 1.8));
    float rayModulation = mix(0.75, 1.10, fineRays * 0.65 + filamentNoise * 0.35);

    // Limb brightening: subtle optical depth variation without harsh highlight blowout
    float limbBrightening = 1.0 + 0.18 * abs(cos(ribbonX * curveFreq + t * speed * 0.35));

    // Vertical altitude profile:
    // Sharp lower boundary (100km atomic oxygen activation)
    float baseLimb = smoothstep(-0.05, 0.03, yDist);
    // Exponential upward decay through thinning ionosphere
    float upwardDecay = exp(-yDist * 4.0);
    // Diffuse top fringe
    float upperFade = smoothstep(0.78, 0.30, yDist);

    float density = baseLimb * upwardDecay * upperFade * rayModulation * limbBrightening;

    // Physical Spectral Altitude Palette - soft, gentle luminescence
    vec3 colGreen   = vec3(0.03, 0.65, 0.42); // Soft Emerald Green
    vec3 colAqua    = vec3(0.05, 0.60, 0.65); // Gentle Aqua
    vec3 colViolet  = vec3(0.38, 0.16, 0.65); // Deep Muted Violet
    vec3 colMagenta = vec3(0.55, 0.14, 0.42); // Soft Magenta

    float normAlt = clamp(yDist / 0.65, 0.0, 1.0);
    vec3 spectralColor;
    if (normAlt < 0.20) {
      spectralColor = mix(colGreen, colAqua, normAlt / 0.20);
    } else if (normAlt < 0.58) {
      spectralColor = mix(colAqua, colViolet, (normAlt - 0.20) / 0.38);
    } else {
      spectralColor = mix(colViolet, colMagenta, (normAlt - 0.58) / 0.42);
    }

    // Gentle bottom fold definition without harsh hotspot
    float bottomLine = smoothstep(0.03, 0.0, abs(yDist - 0.015)) * 0.08;
    spectralColor += vec3(0.04, 0.12, 0.07) * bottomLine;

    // Right-heavy focus envelope
    density *= rightWeight;

    return vec4(spectralColor * density, density);
  }

  void main() {
    vec2 uv = v_uv;

    // Consistent horizontal reference coordinates
    vec2 p;
    p.x = (uv.x - 0.5) * 2.2;
    p.y = uv.y;

    // Time scaling with reduced-motion support
    float t = u_time * u_speed_mult;

    // Deep cosmic night sky background (always dark, like a night sky)
    vec3 skyZenith  = vec3(0.012, 0.024, 0.052);
    vec3 skyHorizon = BG_DARK; // Exact match to site background #070B14
    vec3 color = mix(skyHorizon, skyZenith, uv.y);

    // Twinkling stars
    vec3 stars = renderStars(uv, t);
    color += stars;

    // Right-heavy focus distribution:
    float rightWeight1 = smoothstep(0.08, 0.82, uv.x) * 1.30 + smoothstep(0.48, 0.95, uv.x) * 0.75;
    rightWeight1 = clamp(rightWeight1, 0.12, 2.0);

    float rightWeight2 = smoothstep(-0.02, 0.78, uv.x) * 1.0 + smoothstep(0.55, 1.0, uv.x) * 0.80;
    rightWeight2 = clamp(rightWeight2, 0.08, 1.8);

    float rightWeight3 = smoothstep(0.25, 0.92, uv.x) * 1.45;
    rightWeight3 = clamp(rightWeight3, 0.05, 1.85);

    // Layer 1: Primary dramatic foreground curtain
    vec4 curtain1 = renderCurtain(
      p,
      0.30,   // Arc center Y
      0.10,   // Arc slope (higher on right)
      2.0,    // Curve frequency
      0.15,   // Amplitude
      0.48,   // Speed
      t,
      rightWeight1,
      0.0
    );

    // Layer 2: Secondary sweeping background curtain
    vec4 curtain2 = renderCurtain(
      p + vec2(0.32, -0.06),
      0.38,   // Arc center Y
      0.05,   // Arc slope
      2.6,    // Curve frequency
      0.13,   // Amplitude
      0.36,   // Speed
      t + 18.0,
      rightWeight2,
      5.7
    );

    // Layer 3: High-altitude cresting ribbon in upper-right sky
    vec4 curtain3 = renderCurtain(
      p + vec2(-0.25, -0.14),
      0.46,   // Arc center Y
      -0.03,  // Arc slope
      1.7,    // Curve frequency
      0.11,   // Amplitude
      0.30,   // Speed
      t + 35.0,
      rightWeight3,
      12.4
    );

    // Volumetric additive accumulation with enhanced contrast & prominent glow
    vec3 auroraAccum = vec3(0.0);
    auroraAccum += curtain1.rgb * 0.75;
    auroraAccum += curtain2.rgb * 0.55;
    auroraAccum += curtain3.rgb * 0.45;

    // Atmospheric ambient glow: soft diffused light cast into surroundings
    float totalDensity = curtain1.a + curtain2.a * 0.75 + curtain3.a * 0.55;
    vec3 ambientGreenViolet = mix(vec3(0.01, 0.34, 0.24), vec3(0.24, 0.10, 0.38), uv.y);
    auroraAccum += ambientGreenViolet * totalDensity * rightWeight1 * 0.22;

    // Composite aurora onto night sky
    color += auroraAccum;

    // Smooth blend at bottom into exact site background color (#070B14)
    float bottomBlend = smoothstep(0.0, 0.28, uv.y);
    color = mix(BG_DARK, color, bottomBlend);

    // Subtle top vignette to frame header
    float topVignette = smoothstep(1.0, 0.88, uv.y) * 0.10 + 0.90;
    color *= topVignette;

    // Cinematic tone mapping and gamma
    color = color / (1.0 + color * 0.35);
    color = pow(color, vec3(0.95));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export class AuroraEffect {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.animationFrameId = null;
    this.startTime = performance.now();
    this.isVisible = true;
    this.speedMult = 1.0;

    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);

    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.speedMult = 0.12;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'aurora-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.canvas);

    const glOptions = {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    };

    this.gl = this.canvas.getContext('webgl', glOptions) || this.canvas.getContext('experimental-webgl', glOptions);
    if (!this.gl) {
      console.warn('WebGL not supported for Aurora effect, falling back to CSS background.');
      return;
    }

    const vertShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertShader);
    this.gl.attachShader(this.program, fragShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Aurora shader program link error:', this.gl.getProgramInfoLog(this.program));
      return;
    }

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    this.gl.useProgram(this.program);
    const posAttrib = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(posAttrib);
    this.gl.vertexAttribPointer(posAttrib, 2, this.gl.FLOAT, false, 0, 0);

    this.uResolution = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.uTime = this.gl.getUniformLocation(this.program, 'u_time');
    this.uSpeedMult = this.gl.getUniformLocation(this.program, 'u_speed_mult');

    window.addEventListener('resize', this.onResize, { passive: true });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animationFrameId) {
          this.startTime = performance.now() - (this.lastTime || 0);
          this.render();
        }
      });
    }, { threshold: 0.05 });
    this.observer.observe(this.container);

    this.onResize();
    this.render();
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  onResize() {
    if (!this.canvas || !this.gl) return;
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 240);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const displayWidth = Math.floor(width * dpr);
    const displayHeight = Math.floor(height * dpr);

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  render() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    const currentTime = (performance.now() - this.startTime) * 0.001;
    this.lastTime = currentTime * 1000;

    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.uTime, currentTime);
    this.gl.uniform1f(this.uSpeedMult, this.speedMult);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.animationFrameId = requestAnimationFrame(this.render);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

export function initAurora(selector = '.hero-bg') {
  const containers = document.querySelectorAll(selector);
  const instances = [];
  containers.forEach((container) => {
    instances.push(new AuroraEffect(container));
  });
  return instances;
}
