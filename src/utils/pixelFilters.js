/**
 * Dramatic pixel-level effects engine for premium photobooth filters.
 * Effects applied in order: curve → duotone/splitTone → grain →
 * scanlines → glitch → lightleak → dust → letterbox → vignette
 */

// ─── Math helpers ───

function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function lerp(a, b, t) { return a + (b - a) * t; }

function rgbLuminance(r, g, b) {
  return (r * 77 + g * 150 + b * 29) >> 8;
}

// ─── Tone curve ───

function interpolateCurve(value, points) {
  if (value <= points[0][0]) return points[0][1];
  if (value >= points[points.length - 1][0]) return points[points.length - 1][1];
  for (let i = 0; i < points.length - 1; i++) {
    if (value >= points[i][0] && value <= points[i + 1][0]) {
      const t = (value - points[i][0]) / (points[i + 1][0] - points[i][0]);
      return Math.round(points[i][1] + t * (points[i + 1][1] - points[i][1]));
    }
  }
  return value;
}

function buildCurveLUT(points) {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) lut[i] = interpolateCurve(i, points);
  return lut;
}

// ─── Duotone ───

function applyDuotone(d, shadowC, highlightC) {
  const [sr, sg, sb] = shadowC;
  const [hr, hg, hb] = highlightC;
  for (let i = 0; i < d.length; i += 4) {
    const luma = rgbLuminance(d[i], d[i + 1], d[i + 2]);
    const t = luma / 255;
    d[i]     = clamp(lerp(sr, hr, t));
    d[i + 1] = clamp(lerp(sg, hg, t));
    d[i + 2] = clamp(lerp(sb, hb, t));
  }
}

// ─── Split toning (strong version) ───

function applySplitTone(d, shadows, highlights, balance, amount) {
  for (let i = 0; i < d.length; i += 4) {
    const luma = rgbLuminance(d[i], d[i + 1], d[i + 2]);
    const t = luma / 255;
    const sw = Math.max(0, 1 - t / balance) * amount;
    const hw = Math.max(0, (t - balance) / (1 - balance)) * amount;
    d[i]     = clamp(d[i]     + (shadows[0] - d[i]) * sw + (highlights[0] - d[i]) * hw);
    d[i + 1] = clamp(d[i + 1] + (shadows[1] - d[i + 1]) * sw + (highlights[1] - d[i + 1]) * hw);
    d[i + 2] = clamp(d[i + 2] + (shadows[2] - d[i + 2]) * sw + (highlights[2] - d[i + 2]) * hw);
  }
}

// ─── Film grain ───

function applyGrain(d, amount) {
  if (!amount) return;
  const a = 255 * amount;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * a * 2;
    d[i]     = clamp(d[i] + n);
    d[i + 1] = clamp(d[i + 1] + n);
    d[i + 2] = clamp(d[i + 2] + n);
  }
}

// ─── Scanlines ───

function applyScanlines(d, width, height, config) {
  if (!config) return;
  const { opacity = 0.3, rgbShift } = config;
  const rowSize = width * 4;
  for (let y = 0; y < height; y += 2) {
    const off = y * rowSize;
    for (let x = 0; x < rowSize; x += 4) {
      const j = off + x;
      d[j]     = clamp(lerp(d[j], 0, opacity));
      d[j + 1] = clamp(lerp(d[j + 1], 0, opacity));
      d[j + 2] = clamp(lerp(d[j + 2], 0, opacity));
    }
  }
  if (rgbShift) {
    // shift even scanlines red, odd scanlines blue
    const shiftAmt = Math.min(rgbShift, 4);
    for (let y = 0; y < height; y++) {
      const off = y * rowSize;
      for (let x = 0; x < rowSize; x += 4) {
        const i = off + x;
        if (y % 2 === 0) {
          // red shift: pull red from pixel to the right
          const rIdx = Math.min(i + shiftAmt * 4, d.length - 4);
          d[i] = d[rIdx];
        }
      }
    }
  }
}

// ─── Chromatic aberration ───

function applyChromaticAberration(d, width, height, amount) {
  if (!amount) return;
  const px = Math.max(1, Math.round(amount));
  const copy = new Uint8ClampedArray(d);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const rSrc = Math.max(0, Math.min(width - 1, x + px));
      const bSrc = Math.max(0, Math.min(width - 1, x - px));
      d[i]     = copy[(y * width + rSrc) * 4];
      d[i + 2] = copy[(y * width + bSrc) * 4];
    }
  }
}

// ─── Glitch blocks ───

function applyGlitch(d, width, height, intensity) {
  if (!intensity) return;
  const numBlocks = Math.floor(15 + intensity * 40);
  const copy = new Uint8ClampedArray(d);

  // Block displacement
  for (let b = 0; b < numBlocks; b++) {
    const bh = 3 + Math.floor(Math.random() * 20);
    const by = Math.floor(Math.random() * (height - bh));
    const offsetX = (Math.floor(Math.random() * 60) - 30) * intensity;
    const bw = Math.floor(width * (0.05 + Math.random() * 0.3));
    const bx = Math.floor(Math.random() * (width - bw));
    for (let y = by; y < Math.min(height, by + bh); y++) {
      for (let x = bx; x < Math.min(width, bx + bw); x++) {
        const srcX = Math.max(0, Math.min(width - 1, x + offsetX));
        const si = (y * width + srcX) * 4;
        const di = (y * width + x) * 4;
        d[di] = copy[si]; d[di + 1] = copy[si + 1]; d[di + 2] = copy[si + 2];
      }
    }
  }

  // Channel-swap blocks
  if (intensity > 0.2) {
    const numSwap = Math.floor(5 + intensity * 20);
    for (let b = 0; b < numSwap; b++) {
      const bh = 2 + Math.floor(Math.random() * 12);
      const by = Math.floor(Math.random() * (height - bh));
      const bx = Math.floor(Math.random() * width);
      const bw = Math.floor(width * (0.03 + Math.random() * 0.15));
      for (let y = by; y < Math.min(height, by + bh); y++) {
        for (let x = bx; x < Math.min(width, bx + bw); x++) {
          const i = (y * width + x) * 4;
          const tmp = d[i]; d[i] = d[i + 2]; d[i + 2] = tmp; // swap R & B
        }
      }
    }
  }
}

// ─── Light leak ───

function applyLightLeak(d, width, height, config) {
  if (!config) return;
  const { count = 2, opacity = 0.25, color = [255, 200, 100] } = config;
  for (let l = 0; l < count; l++) {
    const cx = Math.random() * width;
    const cy = height * (0.1 + Math.random() * 0.4);
    const radius = Math.max(width, height) * (0.15 + Math.random() * 0.3);
    const falloff = 0.3 + Math.random() * 0.5;
    const maxDist = radius;
    const [lr, lg, lb] = color.map(c => c * (0.6 + Math.random() * 0.4));
    const alpha = opacity * (0.5 + Math.random() * 0.5);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / radius;
        const dy = (y - cy) / (radius * 0.5);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          const strength = (1 - Math.pow(Math.min(1, dist), falloff)) * alpha;
          if (strength > 0.01) {
            const i = (y * width + x) * 4;
            d[i]     = clamp(lerp(d[i], lr, strength));
            d[i + 1] = clamp(lerp(d[i + 1], lg, strength));
            d[i + 2] = clamp(lerp(d[i + 2], lb, strength));
          }
        }
      }
    }
  }
}

// ─── Dust & scratches ───

function applyDust(d, width, height, amount) {
  if (!amount) return;
  const totalPx = width * height;
  const specks = Math.floor(totalPx * amount * 0.02);
  for (let i = 0; i < specks; i++) {
    const idx = Math.floor(Math.random() * totalPx) * 4;
    const v = Math.random() > 0.5 ? 255 : Math.floor(180 + Math.random() * 60);
    d[idx] = v; d[idx + 1] = v; d[idx + 2] = v;
  }
  const scratches = Math.floor(amount * 5);
  for (let i = 0; i < scratches; i++) {
    let sx = Math.floor(Math.random() * width);
    let sy = Math.floor(Math.random() * height);
    const len = 15 + Math.floor(Math.random() * 50);
    for (let j = 0; j < len; j++) {
      sx = Math.min(width - 1, Math.max(0, sx + Math.floor(Math.random() * 3 - 1)));
      sy = Math.min(height - 1, Math.max(0, sy + (Math.random() > 0.7 ? 1 : 0)));
      const idx = (sy * width + sx) * 4;
      const v = 220 + Math.floor(Math.random() * 35);
      d[idx] = v; d[idx + 1] = v; d[idx + 2] = v;
    }
  }
}

// ─── Letterbox ───

function applyLetterbox(d, width, height, fraction) {
  if (!fraction) return;
  const barH = Math.max(1, Math.floor(height * fraction));
  const rowSize = width * 4;
  // top
  for (let y = 0; y < barH; y++) {
    const off = y * rowSize;
    for (let x = 0; x < rowSize; x += 4) {
      d[off + x] = 0; d[off + x + 1] = 0; d[off + x + 2] = 0;
    }
  }
  // bottom
  for (let y = height - barH; y < height; y++) {
    const off = y * rowSize;
    for (let x = 0; x < rowSize; x += 4) {
      d[off + x] = 0; d[off + x + 1] = 0; d[off + x + 2] = 0;
    }
  }
}

// ─── Vignette ───

function applyVignette(d, width, height, strength) {
  if (!strength) return;
  const cx = width / 2, cy = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) * 1.6 / width;
      const dy = (y - cy) * 1.6 / height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.3) {
        const v = Math.min(1, (dist - 0.3) / 0.7 * strength);
        if (v > 0.01) {
          const i = (y * width + x) * 4;
          d[i]     = clamp(lerp(d[i], 0, v));
          d[i + 1] = clamp(lerp(d[i + 1], 0, v));
          d[i + 2] = clamp(lerp(d[i + 2], 0, v));
        }
      }
    }
  }
}

// ─── Overall color tint ───

function applyTint(d, color, strength) {
  if (!color || !strength) return;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = clamp(lerp(d[i], color[0], strength));
    d[i + 1] = clamp(lerp(d[i + 1], color[1], strength));
    d[i + 2] = clamp(lerp(d[i + 2], color[2], strength));
  }
}

// ─── Main entry point ───

export function applyPixelFilter(ctx, pixel, width, height) {
  if (!pixel) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const d = imageData.data;

  // 1. Tone curve
  if (pixel.curve) {
    const lut = buildCurveLUT(pixel.curve);
    for (let i = 0; i < d.length; i += 4) {
      d[i] = lut[d[i]]; d[i + 1] = lut[d[i + 1]]; d[i + 2] = lut[d[i + 2]];
    }
  }

  // 2. Duotone (overrides color completely)
  if (pixel.duotone) {
    applyDuotone(d, pixel.duotone.shadow, pixel.duotone.highlight);
  }

  // 3. Split toning (if no duotone)
  if (pixel.splitTone && !pixel.duotone) {
    const st = pixel.splitTone;
    applySplitTone(d, st.shadows, st.highlights, st.balance ?? 0.5, st.amount ?? 0.3);
  }

  // 4. Overall tint
  if (pixel.tint) {
    applyTint(d, pixel.tint.color, pixel.tint.strength ?? 0.1);
  }

  // 5. Chromatic aberration (before glitch, so glitch can displace it)
  if (pixel.chromaticAberration) {
    applyChromaticAberration(d, width, height, pixel.chromaticAberration);
  }

  // 6. Glitch blocks
  if (pixel.glitch) {
    applyGlitch(d, width, height, pixel.glitch);
  }

  // 7. Scanlines
  if (pixel.scanlines) {
    applyScanlines(d, width, height, pixel.scanlines);
  }

  // 8. Film grain
  if (pixel.grain) {
    applyGrain(d, pixel.grain);
  }

  // 9. Light leak
  if (pixel.lightLeak) {
    applyLightLeak(d, width, height, pixel.lightLeak);
  }

  // 10. Dust & scratches
  if (pixel.dust) {
    applyDust(d, width, height, pixel.dust);
  }

  // 11. Letterbox bars
  if (pixel.letterbox) {
    applyLetterbox(d, width, height, pixel.letterbox);
  }

  // 12. Vignette
  if (pixel.vignette) {
    applyVignette(d, width, height, pixel.vignette);
  }

  ctx.putImageData(imageData, 0, 0);
}
