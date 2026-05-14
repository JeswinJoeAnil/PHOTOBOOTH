import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ASSETS, PRELOAD_IMAGE_URLS, assetPhotos, filters, frames, stickers } from './constants/assets.js';
import { generateShuffleDecorations, triggerMagicFlashOnStrip } from './utils/shuffleDecorations.js';
import { getFormattedTimestamp } from './utils/timestamp.js';
import { AmbientLayers } from './components/AmbientLayers.jsx';
import { SiteChrome } from './components/SiteChrome.jsx';
import { Hero } from './components/Hero.jsx';
import { CameraBooth } from './components/CameraBooth.jsx';
import { CameraEditor } from './components/CameraEditor.jsx';
import { TemplateRail } from './components/TemplateRail.jsx';
import { MemoryLab } from './components/MemoryLab.jsx';
import { Footer } from './components/Footer.jsx';
import { EditorPage } from './components/EditorPage.jsx';

export default function App() {
  // ── Core capture state ──
  const [mode, setMode] = useState(4);
  const [timer, setTimer] = useState(3);
  const [captured, setCaptured] = useState([]);
  const [timestamp, setTimestamp] = useState(() => getFormattedTimestamp());
  const [fitSettings, setFitSettings] = useState({});
  const [photoScales, setPhotoScales] = useState({}); // { [index]: { x: 1, y: 1 } }
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [frame, setFrame] = useState(frames[0]);
  const [audioOn, setAudioOn] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);

  // ── Editor state ──
  const [developing, setDeveloping] = useState(null);
  const [flashOn, setFlashOn] = useState(true);
  const [isBoothOpen, setBoothOpen] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [activeDecoId, setActiveDecoId] = useState(null);
  const [doodlePaths, setDoodlePaths] = useState([]);
  const [doodleBrush, setDoodleBrush] = useState({ color: '#ff5aaf', size: 6, shadow: 0 });
  const [accent, setAccent] = useState('#ff5aaf');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [grain, setGrain] = useState(36);
  const [lightLeak, setLightLeak] = useState(28);
  const [vignette, setVignette] = useState(16);
  const [editorTab, setEditorTab] = useState('filters');
  const [stripTab, setStripTab] = useState('text');
  const [mirrorOn, setMirrorOn] = useState(true);

  // ── Page navigation ──
  // 'capture' = booth page, 'editor' = editing/download page
  const [currentPage, setCurrentPage] = useState('capture');

  useEffect(() => {
    PRELOAD_IMAGE_URLS.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    } else {
      audioRef.current.pause();
    }
  }, [audioOn, trackIndex]);

  const selectedFilter = useMemo(() => ({
    ...activeFilter,
    css: `${activeFilter.css} contrast(${1 + grain / 420}) brightness(${1 + lightLeak / 600})`,
  }), [activeFilter, grain, lightLeak]);

  const stripPhotos = useMemo(() => Array.from({ length: mode }, (_, index) => {
    if (captured[index]) return captured[index];
    return assetPhotos[index % assetPhotos.length];
  }), [captured, mode]);

  const nextTrack = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % ASSETS.playlist.length);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioOn((v) => !v);
  }, []);

  const playShutter = useCallback(() => {
    if (!audioOn) return;
    const s = new Audio(ASSETS.shutter);
    s.volume = 0.6;
    s.play().catch(e => console.log(e));
  }, [audioOn]);

  const onStartBooth = useCallback(() => {
    setBoothOpen(true);
    document.querySelector('#booth')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleShuffle = useCallback(() => {
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];
    setFrame(randomFrame);

    const randomFilter = filters[Math.floor(Math.random() * filters.length)];
    setActiveFilter(randomFilter);

    const accents = ['#ff5aaf', '#5ac8ff', '#b45aff', '#5aff8c', '#ffea5a', '#111111'];
    setAccent(accents[Math.floor(Math.random() * accents.length)]);

    setDecorations(generateShuffleDecorations(stickers));
    setActiveDecoId(null);
    triggerMagicFlashOnStrip();
  }, []);

  // ── Auto-navigate to editor when all photos are captured ──
  const prevCapturedLength = useRef(0);
  useEffect(() => {
    const wasGrowing = captured.length > prevCapturedLength.current;
    const isFull = captured.length >= mode && captured.length > 0;
    prevCapturedLength.current = captured.length;

    if (isFull && wasGrowing && currentPage === 'capture') {
      // Small delay so the user sees the last photo snap
      const t = setTimeout(() => {
        setCurrentPage('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [captured.length, mode, currentPage]);

  // Navigate to editor manually
  const goToEditor = useCallback(() => {
    setCurrentPage('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigate back to booth
  const goToCapture = useCallback(() => {
    setCurrentPage('capture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main>
      <AmbientLayers />
      <SiteChrome
        audioOn={audioOn}
        toggleAudio={toggleAudio}
        nextTrack={nextTrack}
      />
      <audio
        ref={audioRef}
        src={ASSETS.playlist[trackIndex]}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      <AnimatePresence mode="wait">
        {currentPage === 'capture' ? (
          <motion.div
            key="capture-page"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <Hero
              onStart={onStartBooth}
              photos={stripPhotos}
              filter={selectedFilter}
              timestamp={timestamp}
            />
            <section id="booth" className="studio-grid">
              <CameraBooth
                isOpen={isBoothOpen}
                setOpen={setBoothOpen}
                mode={mode}
                setMode={setMode}
                timer={timer}
                setTimer={setTimer}
                activeFilter={selectedFilter}
                captured={captured}
                setCaptured={setCaptured}
                timestamp={timestamp}
                setTimestamp={setTimestamp}
                flashOn={flashOn}
                setFlashOn={setFlashOn}
                mirrorOn={mirrorOn}
                setMirrorOn={setMirrorOn}
                onCapture={playShutter}
              />
              <CameraEditor
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                grain={grain}
                setGrain={setGrain}
                lightLeak={lightLeak}
                setLightLeak={setLightLeak}
                vignette={vignette}
                setVignette={setVignette}
                editorTab={editorTab}
                setEditorTab={setEditorTab}
              />
            </section>
            <TemplateRail frame={frame} setFrame={setFrame} photos={stripPhotos} filter={selectedFilter} accent={accent} />

            {/* Quick-jump to editor if user already has photos */}
            {captured.length > 0 && (
              <motion.div
                className="go-to-editor-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="editor-bar-inner">
                  <div className="editor-bar-info">
                    <span className="editor-bar-count">{captured.length}/{mode}</span>
                    <span>photos captured</span>
                  </div>
                  <button type="button" className="editor-bar-btn" onClick={goToEditor}>
                    Edit & Download →
                  </button>
                </div>
              </motion.div>
            )}
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="editor-page"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <EditorPage
              goToCapture={goToCapture}
              frame={frame}
              setFrame={setFrame}
              photos={stripPhotos}
              filter={selectedFilter}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              accent={accent}
              decorations={decorations}
              setDecorations={setDecorations}
              activeDecoId={activeDecoId}
              setActiveDecoId={setActiveDecoId}
              doodlePaths={doodlePaths}
              setDoodlePaths={setDoodlePaths}
              doodleBrush={doodleBrush}
              setDoodleBrush={setDoodleBrush}
              developing={developing}
              setDeveloping={setDeveloping}
              zoom={zoom}
              setZoom={setZoom}
              rotation={rotation}
              setRotation={setRotation}
              vignette={vignette}
              stripTab={stripTab}
              setStripTab={setStripTab}
              accentColor={accent}
              captured={captured}
              fitSettings={fitSettings}
              setFitSettings={setFitSettings}
              photoScales={photoScales}
              setPhotoScales={setPhotoScales}
              timestamp={timestamp}
              mode={mode}
              onShuffle={handleShuffle}
              grain={grain}
              setGrain={setGrain}
              lightLeak={lightLeak}
              setLightLeak={setLightLeak}
              editorTab={editorTab}
              setEditorTab={setEditorTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
