/**
 * Draws the current video frame into canvas with mirror + CSS filter, yields one frame, then returns PNG data URL.
 */
export async function encodeVideoFrameToStrip(canvas, video, mirrorOn, filterCss) {
  canvas.width = video.videoWidth || 900;
  canvas.height = video.videoHeight || 1200;
  const context = canvas.getContext('2d');
  context.save();
  if (mirrorOn) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.filter = filterCss;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.restore();

  await new Promise((r) => requestAnimationFrame(r));

  return canvas.toDataURL('image/png');
}
