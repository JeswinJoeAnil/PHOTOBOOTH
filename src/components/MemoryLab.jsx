import React, { memo, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Download,
  Film,
  Grid2X2,
  Image as ImageIcon,
  Sparkles,
  Video,
} from 'lucide-react';
import { renderExport } from '../utils/exportCanvas.js';
import { DevelopingOverlay } from './DevelopingOverlay.jsx';
import { PhotoResult } from './PhotoResult.jsx';
import { StripEditor } from './StripEditor.jsx';

function MemoryLabComponent(props) {
  const {
    frame,
    photos,
    filter,
    accent,
    decorations,
    setDecorations,
    activeDecoId,
    setActiveDecoId,
    doodlePaths,
    setDoodlePaths,
    doodleBrush,
    setDoodleBrush,
    developing,
    setDeveloping,
    zoom,
    setZoom,
    rotation,
    setRotation,
    vignette,
    stripTab,
    setStripTab,
    accentColor,
    captured,
    fitSettings,
    setFitSettings,
    timestamp,
    mode,
    onShuffle,
  } = props;

  const exportRef = useRef(null);

  const exportCanvas = useCallback(async (type) => {
    setDeveloping(type);
    await new Promise((resolve) => window.setTimeout(resolve, 1350));
    if (type === 'png' || type === 'jpg') {
      const canvas = await renderExport({
        frame,
        photos,
        filter,
        accent,
        decorations,
        doodlePaths,
        zoom,
        rotation,
        vignette,
        fitSettings,
        timestamp,
      });
      const link = document.createElement('a');
      link.download = `memorie-${frame.id}.${type === 'png' ? 'png' : 'jpg'}`;
      link.href = canvas.toDataURL(type === 'png' ? 'image/png' : 'image/jpeg', 0.92);
      link.click();
    }
    setDeveloping(null);
  }, [accent, decorations, doodlePaths, filter, fitSettings, frame, photos, rotation, setDeveloping, timestamp, vignette, zoom]);

  return (
    <section id="memory-lab" className="memory-lab">
      {onShuffle && (
        <div className="lab-header">
          <button type="button" className="magic-btn" onClick={onShuffle}>
            <span className="sparkle-icon">✦</span>
            MAGIC SHUFFLE
          </button>
        </div>
      )}
      <div className="result-wrap" ref={exportRef}>
        <PhotoResult
          frame={frame}
          photos={photos}
          filter={filter}
          accent={accent}
          decorations={decorations}
          setDecorations={setDecorations}
          activeDecoId={activeDecoId}
          setActiveDecoId={setActiveDecoId}
          doodlePaths={doodlePaths}
          setDoodlePaths={setDoodlePaths}
          doodleBrush={doodleBrush}
          stripTab={stripTab}
          zoom={zoom}
          rotation={rotation}
          vignette={vignette}
          fitSettings={fitSettings}
          timestamp={timestamp}
        />
      </div>

      <StripEditor
        decorations={decorations}
        setDecorations={setDecorations}
        activeDecoId={activeDecoId}
        setActiveDecoId={setActiveDecoId}
        doodlePaths={doodlePaths}
        setDoodlePaths={setDoodlePaths}
        doodleBrush={doodleBrush}
        setDoodleBrush={setDoodleBrush}
        accentColor={accentColor}
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
        stripTab={stripTab}
        setStripTab={setStripTab}
        fitSettings={fitSettings}
        setFitSettings={setFitSettings}
        mode={mode}
        onShuffle={onShuffle}
      />

      <div className="memory-sidebar">
        <div id="export" className="export-panel">
          <div className="paper-note">All set! <Sparkles size={16} /></div>
          <p>Export your memory</p>
          <div className="export-grid">
            <button type="button" onClick={() => exportCanvas('png')}><ImageIcon size={18} /> Photo Strip <span>PNG</span><Download size={16} /></button>
            <button type="button" onClick={() => exportCanvas('jpg')}><Grid2X2 size={18} /> Collage <span>JPG</span><Download size={16} /></button>
            <button type="button" onClick={() => exportCanvas('gif')}><Film size={18} /> Animated GIF <span>GIF</span><Download size={16} /></button>
            <button type="button" onClick={() => exportCanvas('mp4')}><Video size={18} /> Video Reel <span>MP4</span><Download size={16} /></button>
          </div>
          <div className="share-row">
            <span>Share to</span>
            <button type="button">IG</button>
            <button type="button">TT</button>
            <button type="button">X</button>
            <button type="button">URL</button>
          </div>
          <AnimatePresence>{developing && <DevelopingOverlay type={developing} />}</AnimatePresence>
        </div>

        <div className="memory-roll">
          <div className="section-title"><Film size={16} /><span>Memory Roll</span></div>
          <div className="roll-previews">
            {captured && captured.slice(-4).reverse().map((img, i) => (
              <div key={i} className="roll-item">
                <img src={img} alt="" />
                <button type="button" className="roll-dl"><Download size={12} /></button>
              </div>
            ))}
            {(!captured || captured.length === 0) && (
              <div className="roll-empty">Capture moments to fill your roll...</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoryLab = memo(MemoryLabComponent);
