/** Random sticker placements for Magic Shuffle (same asset list as the Stickers panel). */
export function generateShuffleDecorations(stickers, countMin = 8, countMax = 12) {
  const accents = ['#ff5aaf', '#5ac8ff', '#b45aff', '#5aff8c', '#ffea5a', '#111111'];
  const imageStickers = stickers.filter((s) => s.endsWith('.png'));
  const textStickers = stickers.filter((s) => !s.endsWith('.png'));
  const newDecos = [];
  const span = Math.max(0, countMax - countMin);
  const count = countMin + (span ? Math.floor(Math.random() * (span + 1)) : 0);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const canPickText = textStickers.length > 0;
    const canPickImage = imageStickers.length > 0;
    let content;
    let isImg;
    if (canPickImage && (!canPickText || Math.random() < 0.82)) {
      content = imageStickers[Math.floor(Math.random() * imageStickers.length)];
      isImg = true;
    } else if (canPickText) {
      content = textStickers[Math.floor(Math.random() * textStickers.length)];
      isImg = false;
    } else {
      content = imageStickers[0];
      isImg = true;
    }

    const randomBg = accents[Math.floor(Math.random() * accents.length)];
    newDecos.push({
      id: `shuffle-${now}-${i}`,
      type: 'sticker',
      content,
      x: 10 + Math.random() * 80,
      y: 6 + Math.random() * 88,
      scaleX: 0.55 + Math.random() * 1.15,
      scaleY: 0.55 + Math.random() * 1.15,
      rotation: -40 + Math.random() * 80,
      isImage: isImg,
      showBg: !isImg,
      bgColor: randomBg,
    });
  }

  return newDecos;
}

export function triggerMagicFlashOnStrip() {
  requestAnimationFrame(() => {
    const strip = document.querySelector('.photo-result');
    if (!strip) return;
    strip.classList.remove('magic-flash');
    void strip.offsetWidth;
    strip.classList.add('magic-flash');
  });
}
