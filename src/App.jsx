import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS, PRELOAD_IMAGE_URLS, assetPhotos, filters, frames } from './constants/assets.js';
import { getFormattedTimestamp } from './utils/timestamp.js';
import { AmbientLayers } from './components/AmbientLayers.jsx';
import { SiteChrome } from './components/SiteChrome.jsx';
import { Hero } from './components/Hero.jsx';
import { CameraBooth } from './components/CameraBooth.jsx';
import { CameraEditor } from './components/CameraEditor.jsx';
import { TemplateRail } from './components/TemplateRail.jsx';
import { MemoryLab } from './components/MemoryLab.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  const [mode, setMode] = useState(4);
  const [timer, setTimer] = useState(3);
  const [captured, setCaptured] = useState([]);
  const [timestamp, setTimestamp] = useState(() => getFormattedTimestamp());
  const [fitSettings, setFitSettings] = useState({});
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [frame, setFrame] = useState(frames[0]);
  const [audioOn, setAudioOn] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);

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
      <section id="memory" className="memory-lab-section">
        <MemoryLab
          frame={frame}
          photos={stripPhotos}
          filter={selectedFilter}
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
          timestamp={timestamp}
          mode={mode}
        />
      </section>
      <Footer />
    </main>
  );
}
