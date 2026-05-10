import { asset } from '../constants/assets.js';

export async function renderExport({ frame, photos, filter, accent, decorations, doodlePaths, zoom, rotation, vignette, fitSettings, timestamp }) {
  const baseW = 900;
  const columns = (frame.id === 'magazine' || frame.id === 'chrome' || frame.id === 'camera') ? 2 : 1;
  const gap = 36;
  const margin = 80;
  const topPadding = 110;
  const bottomPadding = 150;

  const slotW = columns === 2 ? (baseW - margin * 2 - gap) / 2 : baseW - margin * 2;
  const slotH = slotW * 0.75;

  const rows = Math.ceil(photos.length / columns);
  const baseH = topPadding + bottomPadding + (gap * (rows - 1)) + (slotH * rows);

  let minX = 0;
  let minY = 0;
  let maxX = baseW;
  let maxY = baseH;

  if (decorations) {
    decorations.forEach(deco => {
      const dx = (deco.x / 100) * baseW;
      const dy = (deco.y / 100) * baseH;
      const buffer = 200 * deco.scale;
      minX = Math.min(minX, dx - buffer);
      minY = Math.min(minY, dy - buffer);
      maxX = Math.max(maxX, dx + buffer);
      maxY = Math.max(maxY, dy + buffer);
    });
  }

  const padding = 60;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const canvas = document.createElement('canvas');
  canvas.width = maxX - minX;
  canvas.height = maxY - minY;
  const ctx = canvas.getContext('2d');

  ctx.save();
  ctx.translate(-minX, -minY);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = frame.id === 'chrome' || frame.id === 'camera' ? '#d6d4cc' : frame.id === 'doodle' ? '#111' : '#f7eee6';
  ctx.fillRect(0, 0, baseW, baseH);
  ctx.restore();

  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.22;
  ctx.fillRect(0, 0, baseW, 70);
  ctx.globalAlpha = 1;

  for (let index = 0; index < photos.length; index += 1) {
    const img = await loadImage(photos[index]);
    const col = columns === 2 ? index % 2 : 0;
    const row = columns === 2 ? Math.floor(index / 2) : index;
    const x = margin + col * (slotW + gap);
    const y = 110 + row * (slotH + gap);
    ctx.save();
    ctx.translate(x + slotW / 2, y + slotH / 2);
    ctx.rotate((rotation + (index % 2 ? 1.5 : -1.2)) * Math.PI / 180);
    ctx.fillStyle = '#151515';
    ctx.shadowColor = 'rgba(0,0,0,.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fillRect(-slotW / 2 - 10, -slotH / 2 - 10, slotW + 20, slotH + 20);
    ctx.shadowColor = 'transparent';
    ctx.filter = filter.css;

    const fit = fitSettings?.[index] || 'cover';
    if (fit === 'contain') {
      const sW = img.width;
      const sH = img.height;
      const r = Math.min(slotW / sW, slotH / sH);
      const dw = sW * r;
      const dh = sH * r;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else {
      drawCover(ctx, img, -slotW / 2, -slotH / 2, slotW, slotH, zoom);
    }

    ctx.filter = 'none';
    ctx.restore();
  }

  const gradient = ctx.createRadialGradient(baseW / 2, baseH / 2, 80, baseW / 2, baseH / 2, baseW / 1.15);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${vignette / 180})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, baseW, baseH);
  ctx.font = '700 54px Georgia';
  ctx.fillStyle = frame.id === 'doodle' ? '#f5f0e7' : '#141414';
  ctx.fillText('memorie+', 58, baseH - 88);
  ctx.font = '24px monospace';
  ctx.fillStyle = frame.id === 'doodle' ? '#f5f0e7' : '#252525';
  ctx.fillText(`${timestamp.time}  ${timestamp.date}`, baseW - 390, baseH - 54);

  const canvasScale = baseW / 380;

  if (decorations) {
    for (const deco of decorations) {
      const baseFontSize = (deco.isSmall ? 10 : 13) * canvasScale;
      const fontSize = baseFontSize * deco.scale;

      if (deco.type === 'text') {
        ctx.save();
        ctx.translate((deco.x / 100) * baseW, (deco.y / 100) * baseH);
        ctx.rotate((deco.rotation * Math.PI) / 180);

        ctx.font = `900 ${fontSize}px ${deco.font || 'Inter'}, sans-serif`;
        if (deco.showBg !== false) {
          ctx.fillStyle = deco.bgColor || '#ff5aaf';
          const textWidth = ctx.measureText(deco.content).width;
          const h = fontSize * 1.5;
          const w = textWidth + (fontSize * 1.2);
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
          ctx.fill();
        }

        ctx.fillStyle = deco.color || '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(deco.content, 0, 0);
        ctx.restore();
      } else if (deco.type === 'sticker') {
        ctx.save();
        ctx.translate((deco.x / 100) * baseW, (deco.y / 100) * baseH);
        ctx.rotate((deco.rotation * Math.PI) / 180);
        if (deco.isImage) {
          const sImg = await loadImage(asset(deco.content));
          const w = 100 * deco.scale * canvasScale;
          const h = (sImg.height / sImg.width) * w;
          if (deco.showBg !== false) {
            ctx.fillStyle = deco.bgColor || '#ff5aaf';
            const bgPadding = 12 * deco.scale * canvasScale;
            ctx.beginPath();
            ctx.roundRect(-w / 2 - bgPadding, -h / 2 - bgPadding, w + bgPadding * 2, h + bgPadding * 2, bgPadding);
            ctx.fill();
          }
          ctx.drawImage(sImg, -w / 2, -h / 2, w, h);
        } else {
          const bubbleFontSize = fontSize;
          ctx.font = `900 ${bubbleFontSize}px Fraunces, serif`;
          if (deco.showBg !== false) {
            ctx.fillStyle = deco.bgColor || '#ff5aaf';
            const textWidth = ctx.measureText(deco.content).width;
            const h = bubbleFontSize * 1.5;
            const w = textWidth + (bubbleFontSize * 1.2);
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
          } else {
            ctx.fillStyle = deco.isChrome ? '#111' : '#4e1534';
          }
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(deco.content, 0, 0);
        }
        ctx.restore();
      }
    }
  }

  if (doodlePaths && doodlePaths.length > 0) {
    doodlePaths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (path.shadow) {
        ctx.shadowBlur = path.shadow;
        ctx.shadowColor = path.color;
      }

      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  ctx.restore();
  return canvas;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export function drawCover(ctx, image, x, y, width, height, zoom = 1) {
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;
  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }
  const z = Math.max(0.7, zoom);
  const zw = width * z;
  const zh = height * z;
  ctx.drawImage(image, sx, sy, sw, sh, x - (zw - width) / 2, y - (zh - height) / 2, zw, zh);
}
