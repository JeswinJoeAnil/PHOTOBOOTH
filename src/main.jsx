import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Aperture,
  BatteryMedium,
  Camera,
  CassetteTape,
  Check,
  ChevronRight,
  Download,
  Film,
  Flashlight,
  Grid2X2,
  Image as ImageIcon,
  Menu,
  Mic2,
  Minus,
  MousePointer2,
  Move,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  RotateCw,
  Sparkles,
  Sticker,
  Trash2,
  Type,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import './styles.css';
import FooterWebGL from './FooterWebGL';

const asset = (name) => new URL(`../assets/${name}`, import.meta.url).href;

const ASSETS = {
  scrapbook: asset('XLuTGjgtwjWtugfWBkwiLVHNF71_iX5xma4L6mxdq-VImioPV2fqq4TAkvueyEqg1IiNDI35_HvKV8KjpR__xK8UhB74W3ut-1GHsNKK_jjzet8cIi0KKKpYMK6JwdUllaTIG5MwrWg6y-XIFC-9moOd-NQkY-OGnp_zsu63kdSsIdoJ7u7KZ_dzygamVTPX.jpg'),
  collage: asset('1FDV7eh_AR8YMK0FX-wk3cZewoeM_NZTtyX5a6Fu90SGrBSujtYzJtiOF5tJlZa7Ag6RJX8RVqJzMuBST-25aAliIT_40cFFlN9uFVp_F1chjnlFseI2SbuUyO6zbdwCObOqTPZsctXxjejoiXh6QTXTSAuR3KLhXb-m5CUxzzri1Jwj6D4VkIS3a1onqHp3.jpg'),
  cameraWide: asset('54f49c9c7633a07bbc183dc5d7ab7d12.jpg'),
  cameraPoster: asset('5d0962c9a39f4963242a24778a4b332c.jpg'),
  cameraTop: asset('OIP.jpg'),
  y2kGreen: asset('Pecn3dmLyNRtp0rgwH9MRdIph5qeSW5-djVPZtQkxI4cso7bVMImh0gggyyT4MkZwGskMCCUsIWDKsR7AHQT25Kc9OBiHBhWV_XuwJJZIKRUijSXejM30HY9Az5tpp6xiNf5KcHTRunrB_CILdS_yLJRp-p8kZNINCwEiHlDLRp4A8WxyWkTFyjx3cuG5Kx0.jpg'),
  cuteSnaps: asset('Screenshot 2026-05-09 025853.png'),
  doodleStrip: asset('Screenshot 2026-05-09 025918.png'),
  previewDigicam: asset('retro cam.jpg'),
  previewVhs: asset('vhs.jpg'),
  previewGrain: asset('film grain.jpg'),
  previewBloom: asset('dreamy bloom.jpg'),
  previewFlash: asset('soft flash.jpg'),
  previewCrt: asset('crt distory.jpg'),
  previewWarm: asset('warm vintag3.jpg'),
  previewSilver: asset('cool silver.jpg'),
  previewPolaroid: asset('faded polaroid.jpg'),
  playlist: [
    asset('im in love.mp3'),
    asset('midnight pretenders.mp3'),
    asset('plastic love.mp3'),
  ],
  shutter: 'https://www.soundjay.com/mechanical/camera-shutter-click-01.mp3',
};

const assetPhotos = [
  ASSETS.y2kGreen,
  ASSETS.scrapbook,
  ASSETS.collage,
  ASSETS.cameraWide,
  ASSETS.cameraPoster,
  ASSETS.cameraTop,
  ASSETS.cuteSnaps,
  ASSETS.doodleStrip,
];

const filters = [
  { id: 'digicam', name: 'Retro Digicam', css: 'contrast(1.3) saturate(1.45) brightness(1.08) sepia(0.05)', preview: ASSETS.previewDigicam },
  { id: 'vhs', name: 'VHS', css: 'contrast(1.2) saturate(0.6) hue-rotate(-25deg) blur(0.35px) sepia(0.1)', preview: ASSETS.previewVhs },
  { id: 'grain', name: 'Film Grain', css: 'sepia(0.4) contrast(1.5) brightness(0.9) saturate(1.2) hue-rotate(-10deg)', preview: ASSETS.previewGrain },
  { id: 'bloom', name: 'Dreamy Bloom', css: 'brightness(1.3) saturate(1.35) blur(1.1px) contrast(0.8) sepia(0.05)', preview: ASSETS.previewBloom },
  { id: 'flash', name: 'Soft Flash', css: 'brightness(1.5) contrast(0.8) saturate(1.25) sepia(0.08) blur(0.2px)', preview: ASSETS.previewFlash },
  { id: 'crt', name: 'CRT Distort', css: 'contrast(1.6) saturate(1.5) hue-rotate(20deg) brightness(1.15) sepia(0.05)', preview: ASSETS.previewCrt },
  { id: 'warm', name: 'Warm Vintage', css: 'sepia(0.65) saturate(1.35) contrast(0.7) brightness(1.2) hue-rotate(-15deg)', preview: ASSETS.previewWarm },
  { id: 'silver', name: 'Cool Silver', css: 'grayscale(0.9) contrast(1.5) brightness(1.2) hue-rotate(180deg) saturate(0.8)', preview: ASSETS.previewSilver },
  { id: 'polaroid', name: 'Faded Polaroid', css: 'contrast(0.7) saturate(0.5) brightness(1.3) sepia(0.2) hue-rotate(-5deg)', preview: ASSETS.previewPolaroid },
];

const frames = [
  { id: 'korean', name: 'Korean Day', tone: 'rose', description: 'Tall strip, glossy pink edge, tiny chrome charms.' },
  { id: 'scrap', name: 'Scrapbook', tone: 'paper', description: 'Layered tape, notes, paper texture, dreamy margin.' },
  { id: 'chrome', name: 'Silver Y2K', tone: 'chrome', description: 'Chrome shell with camera hardware as the frame.' },
  { id: 'magazine', name: 'Magazine', tone: 'editorial', description: 'Fashion editorial blocks, masthead, date stamp.' },
  { id: 'doodle', name: 'Doodle Strip', tone: 'ink', description: 'Hand-drawn marks and sticker-heavy nostalgia.' },
  { id: 'camera', name: 'Camera Frame', tone: 'camera', description: 'Photos placed directly inside a retro digicam body.' },
];

const stickers = ['good vibes', 'Y2K', '2004', 'no bad days', 'xoxo', 'iconic', 'lovely day', 'PM 04:23', 'sticker1.png', 'sticker2_1.png', 'sticker2_2.png', 'sticker2_3.png', 'sticker2_4.png', 'sticker2_5.png', 'sticker2_6.png', 'sticker2_7.png', 'sticker2_8.png', 'sticker2_9.png', 'sticker2_10.png', 'sticker2_11.png', 'sticker2_12.png', 'sticker2_13.png', 'sticker2_14.png', 'sticker2_15.png', 'sticker2_16.png', 'sticker2_17.png', 'sticker2_18.png', 'sticker2_19.png', 'sticker2_20.png', 'sticker2_21.png', 'sticker2_22.png', 'sticker2_23.png', 'sticker2_24.png', 'sticker2_25.png', 'sticker2_26.png', 'sticker2_27.png', 'sticker2_28.png', 'sticker2_29.png', 'sticker2_30.png', 'sticker2_31.png', 'sticker2_32.png', 'sticker2_33.png', 'sticker2_34.png', 'sticker2_35.png', 'sticker2_36.png', 'sticker2_37.png', 'sticker2_38.png', 'sticker2_39.png', 'sticker2_40.png', 'stickers3_1.png', 'stickers3_2.png', 'stickers3_3.png', 'stickers3_4.png', 'stickers3_5.png', 'stickers3_6.png', 'stickers3_7.png', 'stickers3_8.png', 'stickers3_9.png', 'stickers3_10.png', 'stickers3_11.png', 'stickers3_12.png', 'stickers3_13.png', 'stickers3_14.png', 'stickers3_15.png', 'stickers3_16.png', 'stickers3_17.png', 'stickers3_18.png', 'stickers3_19.png', 'stickers3_20.png', 'stickers3_21.png', 'stickers3_22.png', 'stickers3_23.png', 'stickers3_24.png', 'stickers3_25.png', 'stickers3_26.png', 'stickers3_27.png', 'stickers3_28.png', 'stickers3_29.png', 'stickers3_30.png', 'stickers3_31.png', 'stickers3_32.png', 'stickers3_33.png', 'stickers3_34.png', 'stickers3_35.png', 'stickers3_36.png', 'stickers3_37.png', 'stickers3_38.png', 'stickers3_39.png', 'stickers3_40.png', 'stickers3_41.png', 'stickers3_42.png', 'stickers3_43.png', 'stickers3_44.png', 'stickers3_45.png', 'stickers3_46.png', 'stickers3_47.png', 'stickers3_48.png', 'stickers3_49.png', 'stickers3_50.png', 'stickers3_51.png', 'stickers3_52.png', 'stickers3_53.png', 'stickers3_54.png', 'stickers3_55.png', 'stickers3_56.png', 'stickers3_57.png', 'stickers3_58.png', 'stickers3_59.png', 'stickers3_60.png', 'sticker4_1.png'];

function App() {
  const [mode, setMode] = useState(4);
  const [captured, setCaptured] = useState([]);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [frame, setFrame] = useState(frames[0]);
  const [audioOn, setAudioOn] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    } else {
      audioRef.current.pause();
    }
  }, [audioOn, trackIndex]);

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % ASSETS.playlist.length);
  };

  const toggleAudio = () => {
    setAudioOn(!audioOn);
  };

  const playShutter = () => {
    if (!audioOn) return;
    const s = new Audio(ASSETS.shutter);
    s.volume = 0.6;
    s.play().catch(e => console.log(e));
  };

  const [developing, setDeveloping] = useState(null);
  const [flashOn, setFlashOn] = useState(true);
  const [flashFire, setFlashFire] = useState(false);
  const [isBoothOpen, setBoothOpen] = useState(false);
  const [decorations, setDecorations] = useState([
    { id: '1', type: 'text', content: 'lovely day xoxo', x: 56, y: 86, rotation: -2, scale: 1, font: 'Fraunces', color: '#ff5aaf' },
    { id: '2', type: 'sticker', content: 'good vibes', x: 14, y: 64, rotation: -8, scale: 0.8, isSmall: true },
    { id: '3', type: 'sticker', content: 'Y2K', x: 66, y: 18, rotation: 5, scale: 1, isChrome: true }
  ]);
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

  const stripPhotos = useMemo(() => {
    return Array.from({ length: mode }, (_, index) => {
      if (captured[index]) return captured[index];
      return assetPhotos[index % assetPhotos.length];
    });
  }, [captured, mode]);

  const selectedFilter = {
    ...activeFilter,
    css: `${activeFilter.css} contrast(${1 + grain / 420}) brightness(${1 + lightLeak / 600})`,
  };

  return (
    <main>
      <AmbientLayers />
      <Header audioOn={audioOn} toggleAudio={toggleAudio} nextTrack={nextTrack} />
      <audio
        ref={audioRef}
        src={ASSETS.playlist[trackIndex]}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />
      <Hero
        onStart={() => {
          setBoothOpen(true);
          document.querySelector('#booth')?.scrollIntoView({ behavior: 'smooth' });
        }}
        photos={stripPhotos}
        filter={selectedFilter}
      />
      <section id="booth" className="studio-grid">
        <CameraBooth
          isOpen={isBoothOpen}
          setOpen={setBoothOpen}
          mode={mode}
          setMode={setMode}
          activeFilter={selectedFilter}
          captured={captured}
          setCaptured={setCaptured}
          flashOn={flashOn}
          setFlashOn={setFlashOn}
          flashFire={flashFire}
          setFlashFire={setFlashFire}
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
          frame={frame} photos={stripPhotos} filter={selectedFilter} accent={accent}
          decorations={decorations} setDecorations={setDecorations}
          activeDecoId={activeDecoId} setActiveDecoId={setActiveDecoId}
          doodlePaths={doodlePaths} setDoodlePaths={setDoodlePaths}
          doodleBrush={doodleBrush} setDoodleBrush={setDoodleBrush}
          developing={developing} setDeveloping={setDeveloping}
          zoom={zoom} setZoom={setZoom} rotation={rotation} setRotation={setRotation} vignette={vignette}
          stripTab={stripTab} setStripTab={setStripTab} accentColor={accent} setAccentColor={setAccent}
          captured={captured}
        />
      </section>
      <Footer />
      <AnimatePresence>{flashFire && <motion.div className="flash" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.46 }} />}</AnimatePresence>
    </main>
  );
}

function Header({ audioOn, toggleAudio, nextTrack }) {
  return (
    <motion.header className="site-header" initial={{ y: -36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
      <a className="brand" href="#top">memorie<span>+</span></a>
      <nav>
        <a href="#booth">Booth</a>
        <a href="#templates">Templates</a>
        <a href="#memory-lab">Gallery</a>
        <a href="#export">Export</a>
      </nav>
      <div className="header-actions">
        <div className="audio-controls-group">
          <button className="pill-button audio-toggle" onClick={toggleAudio} aria-pressed={audioOn}>
            <CassetteTape size={16} />
            {audioOn ? 'Sound On' : 'Sound Off'}
            <Sparkles size={14} />
          </button>
          {audioOn && (
            <button className="icon-button skip-button" onClick={nextTrack} title="Next track">
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
        <button className="icon-button" aria-label="Open menu"><Menu size={20} /></button>
      </div>
    </motion.header>
  );
}

function Hero({ onStart, photos, filter }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 55, damping: 18 });
  const springY = useSpring(y, { stiffness: 55, damping: 18 });
  const rotate = useTransform(springX, [-80, 80], [-2.4, 2.4]);

  return (
    <section id="top" className="hero" onMouseMove={(event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) / 16);
      y.set((event.clientY - rect.top - rect.height / 2) / 18);
    }}>
      <div className="hero-copy">
        <motion.div className="tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>digital memories, made beautiful</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          your moments,<br />
          <span>but make it</span>
          <em> ICONIC</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          A nostalgic photobooth experience with glossy camera frames, scrapbook strips, cinematic filters, and tiny 2004 feelings polished for now.
        </motion.p>
        <div className="hero-actions">
          <motion.button className="start-button" whileTap={{ scale: 0.95 }} whileHover={{ y: -3 }} onClick={onStart}>
            Start Booth <ChevronRight size={22} />
          </motion.button>
          <span className="scribble-note">press here!</span>
        </div>
      </div>

      <motion.div className="hero-camera" style={{ x: springX, y: springY, rotate }}>
        <div className="camera-shell">
          <div className="camera-screen">
            <PhotoStack photos={photos.slice(0, 3)} filter={filter} />
            <CameraOverlay />
          </div>
          <div className="camera-controls">
            <button><RefreshCcw size={15} /></button>
            <button><Sparkles size={15} /></button>
            <button className="shutter"><Camera size={28} /></button>
            <span>Y2K</span>
          </div>
        </div>
        <div className="tape tape-top" />
        <StickerBubble text="good vibes" className="hero-sticker one" />
        <StickerBubble text="collect beautiful memories" className="hero-sticker two" />
      </motion.div>

      <motion.div className="hero-side-device" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24, type: 'spring' }}>
        <DeviceFrame photos={photos} filter={filter} compact />
      </motion.div>
    </section>
  );
}

function CameraBooth({ isOpen, setOpen, mode, setMode, activeFilter, captured, setCaptured, flashOn, setFlashOn, flashFire, setFlashFire, mirrorOn, setMirrorOn, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [shotIndex, setShotIndex] = useState(null);
  const [error, setError] = useState('');
  const [shooting, setShooting] = useState(false);
  const shootingRef = useRef(false);

  useEffect(() => {
    if (!isOpen || streaming) return;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      })
      .catch(() => {
        setError('Camera blocked. Preview is using the memory roll.');
      });
  }, [isOpen, streaming]);

  const fireFlash = () => {
    if (!flashOn) return;
    setFlashFire(true);
    window.setTimeout(() => setFlashFire(false), 480);
  };

  const captureOnePhoto = (currentCaptured) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !streaming) {
      const fallback = assetPhotos[currentCaptured.length % assetPhotos.length];
      fireFlash();
      return [...currentCaptured, fallback];
    }
    canvas.width = video.videoWidth || 900;
    canvas.height = video.videoHeight || 1200;
    const context = canvas.getContext('2d');
    context.save();
    if (mirrorOn) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.filter = activeFilter.css;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();
    fireFlash();
    if (onCapture) onCapture();
    return [...currentCaptured, canvas.toDataURL('image/png')];
  };

  const delay = (ms) => new Promise((r) => window.setTimeout(r, ms));

  const runSingleCapture = async () => {
    if (shootingRef.current) return;
    shootingRef.current = true;
    setShooting(true);
    setOpen(true);

    const isFull = captured.length >= mode;
    setShotIndex(isFull ? 1 : captured.length + 1);

    for (let t = 3; t >= 1; t--) {
      setCountdown(t);
      await delay(1000);
    }
    setCountdown(null);

    setCaptured((prev) => {
      const base = prev.length >= mode ? [] : prev;
      return captureOnePhoto(base);
    });

    setShotIndex(null);
    setShooting(false);
    shootingRef.current = false;
    window.setTimeout(() => document.getElementById('memory-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  };

  const runSequentialCapture = async (totalShots) => {
    if (shootingRef.current) return;
    shootingRef.current = true;
    setShooting(true);
    setOpen(true);
    let currentPhotos = [];
    setCaptured([]);

    for (let i = 0; i < totalShots; i++) {
      if (!shootingRef.current) break;
      setShotIndex(i + 1);
      for (let t = 3; t >= 1; t--) {
        setCountdown(t);
        await delay(1000);
      }
      setCountdown(null);
      currentPhotos = captureOnePhoto(currentPhotos);
      setCaptured([...currentPhotos]);
      if (i < totalShots - 1) await delay(800);
    }
    setShotIndex(null);
    setShooting(false);
    shootingRef.current = false;
    window.setTimeout(() => document.getElementById('memory-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  };

  const stopBurst = () => {
    shootingRef.current = false;
    setShooting(false);
    setCountdown(null);
    setShotIndex(null);
  };

  return (
    <motion.section className="booth-card capture-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring' }}>
      <div className="section-title">
        <Sparkles size={18} />
        <span>Live Booth</span>
        {shooting && <span className="shooting-badge">● SHOOTING {shotIndex}/{mode}</span>}
      </div>
      <div className="capture-layout">
        <div className="mode-stack" aria-label="Photo count">
          {[2, 4, 6].map((item) => (
            <button key={item} className={mode === item ? 'active' : ''} onClick={() => { if (!shooting) setMode(item); }}>
              <Grid2X2 size={18} />
              <span>{item} shots</span>
            </button>
          ))}
          <button className="ghost-mode"><Film size={18} /><span>GIF mode</span></button>
        </div>
        <div className="camera-stage">
          <video ref={videoRef} autoPlay playsInline muted className="live-video" style={{ filter: activeFilter.css, transform: mirrorOn ? 'scaleX(-1)' : 'none' }} />
          {!streaming && <img src={assetPhotos[captured.length % assetPhotos.length]} className="live-video fallback-video" style={{ filter: activeFilter.css }} alt="" />}
          <CameraOverlay />
          <AnimatePresence mode="wait">
            {countdown && <motion.div className="countdown" key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}>{countdown}</motion.div>}
          </AnimatePresence>
          {error && <div className="camera-error">{error}</div>}
        </div>
        <div className="camera-options">
          <button className={flashOn ? 'opt-active' : ''} onClick={() => setFlashOn((v) => !v)}><Flashlight size={18} /> Flash <span>{flashOn ? 'on' : 'off'}</span></button>
          <button className={mirrorOn ? 'opt-active' : ''} onClick={() => setMirrorOn((v) => !v)}><RefreshCcw size={18} /> Mirror <span>{mirrorOn ? 'on' : 'off'}</span></button>
          <button><BatteryMedium size={18} /> Timer <span>3s</span></button>
          <button onClick={() => { if (!shooting) setCaptured((list) => list.slice(0, -1)); }}><RotateCw size={18} /> Retake <span>{captured.length}</span></button>
        </div>
      </div>
      <div className="capture-actions">
        {!shooting ? (
          <>
            <button className="shutter-large burst-button" onClick={() => runSequentialCapture(mode)}><Zap size={22} /> Burst Mode</button>
            <button className="shutter-large" onClick={runSingleCapture}><Camera size={24} /> Capture Shot</button>
            <button className="pill-button" onClick={() => setCaptured([])}> Clear roll</button>
          </>
        ) : (
          <button className="shutter-large stop-button" onClick={stopBurst}><Pause size={22} /> Stop</button>
        )}
      </div>
      <a href="#templates" className="vibe-link"><Sparkles size={16} /> Choose Your Vibe</a>
      <canvas ref={canvasRef} hidden />
    </motion.section>
  );
}

function StripEditor(props) {
  const {
    decorations, setDecorations, activeDecoId, setActiveDecoId,
    doodlePaths, setDoodlePaths, doodleBrush, setDoodleBrush,
    accentColor, setAccentColor, zoom, setZoom, rotation, setRotation,
    stripTab, setStripTab,
  } = props;

  const tabs = [
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'stickers', icon: Sticker, label: 'Stickers' },
    { id: 'doodle', icon: MousePointer2, label: 'Doodle' },
  ];

  const activeDeco = decorations.find(d => d.id === activeDecoId);

  const handleAddText = () => {
    const newId = Date.now().toString();
    const randomBg = ['#ff5aaf', '#00ffcc', '#ffcc00', '#cc00ff', '#111111', '#ff4444', '#44aaff'][Math.floor(Math.random() * 7)];
    setDecorations([...decorations, { id: newId, type: 'text', content: 'New Text', x: 50, y: 50, rotation: 0, scale: 1, font: 'Inter', color: accentColor, bgColor: randomBg, showBg: false }]);
    setActiveDecoId(newId);
  };

  const handleAddSticker = (stickerContent) => {
    const newId = Date.now().toString();
    const isImg = stickerContent.endsWith('.png');
    const randomBg = ['#ff5aaf', '#00ffcc', '#ffcc00', '#cc00ff', '#111111', '#ff4444', '#44aaff'][Math.floor(Math.random() * 7)];
    setDecorations([...decorations, { id: newId, type: 'sticker', content: stickerContent, isImage: isImg, x: 50, y: 50, rotation: 0, scale: 1, bgColor: randomBg, showBg: !isImg }]);
    setActiveDecoId(newId);
  };

  const updateActiveDeco = (updates) => {
    if (!activeDecoId) return;
    setDecorations(prev => prev.map(d => d.id === activeDecoId ? { ...d, ...updates } : d));
  };

  return (
    <div className="strip-editor">
      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wand2 size={18} /><span>Edit Your Strip</span>
        </div>
        {decorations.length > 0 && (
          <button
            onClick={() => { setDecorations([]); setActiveDecoId(null); }}
            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            Clear Elements
          </button>
        )}
      </div>
      <div className="tool-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={stripTab === tab.id ? 'active' : ''} onClick={() => setStripTab(tab.id)}>
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="editor-tab-content">
        {stripTab === 'text' && (
          <div className="text-row">
            {activeDeco && activeDeco.type === 'text' ? (
              <div className="text-controls" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label><span>Caption</span><input value={activeDeco.content} onChange={(e) => updateActiveDeco({ content: e.target.value })} placeholder="Lovely day..." /></label>
                <div className="text-options" style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1 }}><span>Font</span>
                    <select value={activeDeco.font} onChange={(e) => updateActiveDeco({ font: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--muted)', background: 'transparent' }}>
                      <option value="Inter">Inter</option>
                      <option value="Fraunces">Fraunces</option>
                      <option value="Space Mono">Space Mono</option>
                      <option value="VT323">VT323</option>
                      <option value="Caveat">Caveat</option>
                      <option value="Permanent Marker">Marker</option>
                      <option value="Bebas Neue">Bebas</option>
                      <option value="Playfair Display">Playfair</option>
                    </select>
                  </label>
                  <label><span>Color</span><input type="color" value={activeDeco.color} onChange={(e) => updateActiveDeco({ color: e.target.value })} /></label>
                </div>
              </div>
            ) : (
              <button className="pill-button add-text-btn" onClick={handleAddText} style={{ width: '100%' }}>+ Add Text Sticker</button>
            )}
          </div>
        )}
        {stripTab === 'stickers' && (
          <div className="sticker-panel">
            <p className="panel-hint">Click a sticker to add it to your strip</p>
            <div className="sticker-grid" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stickers.map((s) => (
                <button key={s} className="sticker-chip" onClick={() => handleAddSticker(s)} style={{ padding: s.endsWith('.png') ? '4px' : undefined, minHeight: s.endsWith('.png') ? '80px' : undefined }}>
                  {s.endsWith('.png') ? <img src={asset(s)} style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }} /> : s}
                </button>
              ))}
            </div>
          </div>
        )}
        {stripTab === 'doodle' && (
          <div className="doodle-panel">
            <p className="panel-hint">Pick a brush and draw directly on the strip</p>
            <div className="sticker-grid">
              <button className={`sticker-chip ${doodleBrush.color === '#ff5aaf' ? 'active' : ''}`} onClick={() => setDoodleBrush({ color: '#ff5aaf', size: 6, shadow: 0 })}>Pink</button>
              <button className={`sticker-chip ${doodleBrush.color === '#00ffcc' ? 'active' : ''}`} onClick={() => setDoodleBrush({ color: '#00ffcc', size: 4, shadow: 8 })}>Neon Glow</button>
              <button className={`sticker-chip ${doodleBrush.color === '#ffffff' ? 'active' : ''}`} onClick={() => setDoodleBrush({ color: '#ffffff', size: 3, shadow: 0 })}>White Pen</button>
              <button className={`sticker-chip ${doodleBrush.color === '#000000' ? 'active' : ''}`} onClick={() => setDoodleBrush({ color: '#000000', size: 8, shadow: 0 })}>Black Marker</button>
              <button className="sticker-chip" onClick={() => setDoodlePaths([])} style={{ marginLeft: 'auto' }}>Clear All</button>
            </div>
          </div>
        )}
        {(stripTab === 'text' || stripTab === 'stickers' || stripTab === 'doodle') && (
          <div className="slider-list">
            {activeDeco ? (
              <>
                <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)' }}>
                  <span>Adjusting Selected {activeDeco.type}</span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => {
                      setDecorations(decorations.filter(d => d.id !== activeDecoId));
                      setActiveDecoId(null);
                    }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    <button onClick={() => setActiveDecoId(null)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Deselect</button>
                  </div>
                </div>
                <Slider label="Size" value={Math.round(activeDeco.scale * 100)} setValue={(v) => updateActiveDeco({ scale: v / 100 })} min={10} max={300} />
                <Slider label="Rotate" value={activeDeco.rotation} setValue={(v) => updateActiveDeco({ rotation: v })} min={-180} max={180} />
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: 'var(--fg)' }}>
                    <input type="checkbox" checked={activeDeco.showBg !== false} onChange={(e) => updateActiveDeco({ showBg: e.target.checked })} />
                    Background
                  </label>
                  {activeDeco.showBg !== false && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--fg)' }}>
                      Color: <input type="color" value={activeDeco.bgColor || '#ff5aaf'} onChange={(e) => updateActiveDeco({ bgColor: e.target.value })} style={{ width: '24px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                    </label>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)' }}><span>Adjusting Photos</span></div>
                <Slider label="Zoom" value={Math.round(zoom * 100)} setValue={(v) => setZoom(v / 100)} min={50} max={200} />
                <Slider label="Rotate" value={rotation} setValue={setRotation} min={-45} max={45} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CameraEditor(props) {
  const {
    activeFilter, setActiveFilter, grain, setGrain, lightLeak, setLightLeak, vignette, setVignette,
    editorTab, setEditorTab,
  } = props;

  const tabs = [
    { id: 'filters', icon: Wand2, label: 'Filters' },
    { id: 'adjust', icon: Move, label: 'Adjust' },
  ];

  return (
    <motion.section className="booth-card editor-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.08 }}>
      <div className="section-title"><Sparkles size={18} /><span>Live Effects</span></div>
      <div className="tool-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={editorTab === tab.id ? 'active' : ''} onClick={() => setEditorTab(tab.id)}>
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="editor-tab-content">
        {editorTab === 'filters' && (
          <>
            <div className="filter-grid">
              {filters.map((f) => (
                <button key={f.id} className={activeFilter.id === f.id ? 'active' : ''} onClick={() => setActiveFilter(f)}>
                  <img src={f.preview} style={{ filter: f.css }} alt="" />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
            <p className="panel-hint">Live filters apply instantly to the camera feed</p>
          </>
        )}
        {editorTab === 'adjust' && (
          <div className="slider-list">
            <Slider label="Grain" value={grain} setValue={setGrain} />
            <Slider label="Light Leak" value={lightLeak} setValue={setLightLeak} />
            <Slider label="Vignette" value={vignette} setValue={setVignette} />
          </div>
        )}
      </div>
    </motion.section>
  );
}

function TemplateRail({ frame, setFrame, photos, filter, accent }) {
  return (
    <section id="templates" className="template-section">
      <div className="section-heading">
        <div className="section-title"><Sparkles size={18} /><span>Choose Your Vibe</span></div>
        <button className="pill-button">See all</button>
      </div>
      <div className="template-rail">
        {frames.map((item, index) => (
          <motion.button key={item.id} className={`template-card ${frame.id === item.id ? 'active' : ''}`} onClick={() => setFrame(item)} whileHover={{ y: -8, rotate: index % 2 ? 1.4 : -1.4 }} whileTap={{ scale: 0.98 }}>
            <MiniTemplate frame={item} photos={photos} filter={filter} accent={accent} />
            <span>{item.name}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function MemoryLab(props) {
  const {
    frame, photos, filter, accent,
    decorations, setDecorations, activeDecoId, setActiveDecoId,
    doodlePaths, setDoodlePaths, doodleBrush, setDoodleBrush,
    developing, setDeveloping, zoom, setZoom, rotation, setRotation, vignette,
    stripTab, setStripTab, accentColor, setAccentColor, captured,
  } = props;
  const exportRef = useRef(null);

  const exportCanvas = async (type) => {
    setDeveloping(type);
    await new Promise((resolve) => window.setTimeout(resolve, 1350));
    if (type === 'png' || type === 'jpg') {
      const canvas = await renderExport({ frame, photos, filter, accent, decorations, doodlePaths, zoom, rotation, vignette });
      const link = document.createElement('a');
      link.download = `memorie-${frame.id}.${type === 'png' ? 'png' : 'jpg'}`;
      link.href = canvas.toDataURL(type === 'png' ? 'image/png' : 'image/jpeg', 0.92);
      link.click();
    }
    setDeveloping(null);
  };

  return (
    <section id="memory-lab" className="memory-lab">
      <div className="result-wrap" ref={exportRef}>
        <PhotoResult
          frame={frame} photos={photos} filter={filter} accent={accent}
          decorations={decorations} setDecorations={setDecorations}
          activeDecoId={activeDecoId} setActiveDecoId={setActiveDecoId}
          doodlePaths={doodlePaths} setDoodlePaths={setDoodlePaths} doodleBrush={doodleBrush}
          stripTab={stripTab}
          zoom={zoom} rotation={rotation} vignette={vignette}
        />
      </div>

      <StripEditor
        decorations={decorations} setDecorations={setDecorations}
        activeDecoId={activeDecoId} setActiveDecoId={setActiveDecoId}
        doodlePaths={doodlePaths} setDoodlePaths={setDoodlePaths} doodleBrush={doodleBrush} setDoodleBrush={setDoodleBrush}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
        stripTab={stripTab}
        setStripTab={setStripTab}
      />

      <div className="memory-sidebar">
        <div id="export" className="export-panel">
          <div className="paper-note">All set! <Sparkles size={16} /></div>
          <p>Export your memory</p>
          <div className="export-grid">
            <button onClick={() => exportCanvas('png')}><ImageIcon size={18} /> Photo Strip <span>PNG</span><Download size={16} /></button>
            <button onClick={() => exportCanvas('jpg')}><Grid2X2 size={18} /> Collage <span>JPG</span><Download size={16} /></button>
            <button onClick={() => exportCanvas('gif')}><Film size={18} /> Animated GIF <span>GIF</span><Download size={16} /></button>
            <button onClick={() => exportCanvas('mp4')}><Video size={18} /> Video Reel <span>MP4</span><Download size={16} /></button>
          </div>
          <div className="share-row">
            <span>Share to</span>
            <button>IG</button>
            <button>TT</button>
            <button>X</button>
            <button>URL</button>
          </div>
          <AnimatePresence>{developing && <DevelopingOverlay type={developing} />}</AnimatePresence>
        </div>

        <div className="memory-roll">
          <div className="section-title"><Film size={16} /><span>Memory Roll</span></div>
          <div className="roll-previews">
            {captured && captured.slice(-4).reverse().map((img, i) => (
              <div key={i} className="roll-item">
                <img src={img} alt="" />
                <button className="roll-dl"><Download size={12} /></button>
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

function PhotoResult({ frame, photos, filter, accent, decorations, setDecorations, activeDecoId, setActiveDecoId, doodlePaths, setDoodlePaths, doodleBrush, stripTab, zoom, rotation, vignette }) {
  const wrapperRef = useRef(null);
  const stripRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!wrapperRef.current || !stripRef.current) return;
    const compute = () => {
      const wW = wrapperRef.current.clientWidth  - 32; // 16px padding each side
      const wH = wrapperRef.current.clientHeight - 32;
      const sW = stripRef.current.offsetWidth;
      const sH = stripRef.current.offsetHeight;
      if (!sW || !sH) return;
      const s = Math.min(wW / sW, wH / sH, 1); // never upscale
      setScale(s);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrapperRef.current);
    ro.observe(stripRef.current);
    return () => ro.disconnect();
  }, [photos.length, frame.id]);

  return (
    <div ref={wrapperRef} className="strip-scale-wrapper">
      <div
        ref={stripRef}
        className={`photo-result frame-${frame.id}`}
        style={{
          '--accent': accent,
          '--vignette': `${vignette / 100}`,
          transform: `scale(${scale}) rotate(-1.5deg)`,
          transformOrigin: 'top center',
          // collapse the dead space below the scaled strip
          marginBottom: scale < 1
            ? `${-((stripRef.current?.offsetHeight ?? 0) * (1 - scale))}px`
            : '0px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveDecoId(null);
        }}
      >
        <div className="result-meta">PM 04:23 / MAY. 23 2004</div>
        <div className="photo-slots" onClick={() => setActiveDecoId(null)}>
          {photos.map((photo, index) => (
            <DraggablePhoto key={`${photo}-${index}`} photo={photo} filter={filter} index={index} zoom={zoom} rotation={rotation} />
          ))}
        </div>

        <DoodleCanvas stripTab={stripTab} doodlePaths={doodlePaths} setDoodlePaths={setDoodlePaths} doodleBrush={doodleBrush} />

        <div className="decorations-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
          {decorations.map(deco => (
            <DraggableDeco key={`${deco.id}-${deco.dragKey || 0}`} deco={deco} setDecorations={setDecorations} isActive={activeDecoId === deco.id} onPointerDown={() => setActiveDecoId(deco.id)} />
          ))}
        </div>
        <div className="tape tape-a" />
        <div className="tape tape-b" />
        <div className="result-doodles">✧ ⋆ ˚｡⋆୨୧˚</div>
      </div>
    </div>
  );
}

function DoodleCanvas({ stripTab, doodlePaths, setDoodlePaths, doodleBrush }) {
  const [currentPath, setCurrentPath] = useState(null);
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    if (stripTab !== 'doodle') return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Map to 900px base coordinate system
    const scale = 900 / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    setCurrentPath({ points: [{ x, y }], ...doodleBrush });
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (stripTab !== 'doodle' || !currentPath) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = 900 / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    setCurrentPath(prev => ({ ...prev, points: [...prev.points, { x, y }] }));
  };

  const handlePointerUp = (e) => {
    if (!currentPath) return;
    setDoodlePaths(prev => [...prev, currentPath]);
    setCurrentPath(null);
    e.target.releasePointerCapture(e.pointerId);
  };

  // Calculate dynamic height for viewBox based on the 900px width
  const viewHeight = containerRef.current ? (containerRef.current.offsetHeight * (900 / containerRef.current.offsetWidth)) : 1000;

  return (
    <div
      ref={containerRef}
      className={`doodle-overlay ${stripTab === 'doodle' ? 'active' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 15, pointerEvents: stripTab === 'doodle' ? 'auto' : 'none', touchAction: 'none' }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 900 ${viewHeight}`} style={{ overflow: 'visible' }}>
        {doodlePaths.map((path, i) => (
          <polyline key={i} points={path.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={path.color} strokeWidth={path.size} strokeLinecap="round" strokeLinejoin="round" filter={path.shadow ? `drop-shadow(0px 0px ${path.shadow}px ${path.color})` : 'none'} />
        ))}
        {currentPath && (
          <polyline points={currentPath.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={currentPath.color} strokeWidth={currentPath.size} strokeLinecap="round" strokeLinejoin="round" filter={currentPath.shadow ? `drop-shadow(0px 0px ${currentPath.shadow}px ${currentPath.color})` : 'none'} />
        )}
      </svg>
    </div>
  );
}

function DraggablePhoto({ photo, filter, index, zoom, rotation }) {
  return (
    <motion.div className="photo-slot" drag dragMomentum={false} whileDrag={{ scale: 1.035, zIndex: 5 }} style={{ rotate: rotation + (index % 2 ? 1.5 : -1.2) }}>
      <img src={photo} style={{ filter: filter.css, transform: `scale(${zoom})` }} alt="" />
      <span>{String(index + 1).padStart(2, '0')}</span>
    </motion.div>
  );
}

function DecoHandles({ deco, setDecorations, elementRef }) {
  const handleResize = (e) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const startScale = deco.scale;
    
    const onMove = (moveEvent) => {
       const currentDist = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
       const ratio = currentDist / startDist;
       const newScale = Math.max(0.2, startScale * ratio);
       setDecorations(prev => prev.map(d => d.id === deco.id ? { ...d, scale: newScale } : d));
    };
    const onUp = (upEvent) => {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const startRotation = deco.rotation || 0;
    
    const onMove = (moveEvent) => {
       const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
       let delta = currentAngle - startAngle;
       if (delta > 180) delta -= 360;
       if (delta < -180) delta += 360;
       setDecorations(prev => prev.map(d => d.id === deco.id ? { ...d, rotation: startRotation + delta } : d));
    };
    const onUp = (upEvent) => {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDecorations(prev => prev.filter(d => d.id !== deco.id));
  };

  return (
    <>
      {/* ── Functional handles ── */}
      <div className="deco-handle delete-handle" data-tip="Remove" onPointerDown={handleDelete}>
        <Trash2 size={11} />
      </div>
      <div className="deco-handle rotate-handle" data-tip="Rotate" onPointerDown={handleRotate}>
        <RotateCw size={13} />
      </div>
      <div className="deco-handle resize-handle" data-tip="Resize" onPointerDown={handleResize}>
        <Sparkles size={13} />
      </div>

      {/* ── Corner dots ── */}
      <div className="deco-corner top-left" />
      <div className="deco-corner top-right" />
      <div className="deco-corner bottom-left" />
      <div className="deco-corner bottom-right" />
    </>
  );
}

function DraggableDeco({ deco, setDecorations, isActive, onPointerDown }) {
  const elementRef = useRef(null);

  const handlePointerDown = (e) => {
    // Always trigger the original onPointerDown to set it as active
    onPointerDown(e);

    // If clicking on a handle, do not initiate dragging
    if (e.target.closest('.deco-handle')) return;

    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startDecoX = deco.x;
    const startDecoY = deco.y;

    const parent = elementRef.current?.closest('.decorations-layer');
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();

    const onMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newX = startDecoX + (dx / parentRect.width) * 100;
      const newY = startDecoY + (dy / parentRect.height) * 100;
      
      // Update DOM directly for smooth 60fps dragging without re-renders
      target.style.left = `${newX}%`;
      target.style.top = `${newY}%`;
    };

    const onUp = (upEvent) => {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      
      const dx = upEvent.clientX - startX;
      const dy = upEvent.clientY - startY;
      const newX = startDecoX + (dx / parentRect.width) * 100;
      const newY = startDecoY + (dy / parentRect.height) * 100;

      // Commit the final position to state
      setDecorations(prev => prev.map(d => d.id === deco.id ? {
        ...d,
        x: newX,
        y: newY,
      } : d));
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const style = {
    position: 'absolute',
    top: `${deco.y}%`,
    left: `${deco.x}%`,
    x: '-50%',
    y: '-50%',
    scale: deco.scale,
    rotate: deco.rotation,
    zIndex: isActive ? 20 : 10,
    cursor: 'grab',
    pointerEvents: 'auto',
  };

  const className = `drag-sticker ${isActive ? 'active-deco' : ''} ${deco.isSmall ? 'small' : ''} ${deco.isChrome ? 'chrome' : ''}`;

  if (deco.type === 'text') {
    const bgStyle = deco.showBg !== false ? { background: deco.bgColor || '#ff5aaf', padding: '8px 16px', borderRadius: '99px' } : { background: 'transparent', padding: 0 };
    return (
      <motion.div
        className={className}
        ref={elementRef}
        style={{ ...style, color: deco.color, fontFamily: deco.font, boxShadow: 'none', textShadow: '0 2px 8px rgba(0,0,0,0.1)', ...bgStyle }}
        onPointerDown={handlePointerDown}
        whileTap={{ scale: deco.scale * 1.05 }}
        transition={{ type: 'tween', duration: 0 }}
      >
        {deco.content}
        {isActive && <DecoHandles deco={deco} setDecorations={setDecorations} elementRef={elementRef} />}
      </motion.div>
    );
  } else {
    const bgStyle = deco.showBg !== false ? { background: deco.bgColor || '#ff5aaf', padding: deco.isImage ? '8px' : '8px 16px', borderRadius: deco.isImage ? '12px' : '99px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : { background: 'transparent', padding: 0 };
    return (
      <motion.div
        className={className}
        ref={elementRef}
        style={{ ...style, ...bgStyle, color: deco.showBg !== false ? '#fff' : 'inherit' }}
        onPointerDown={handlePointerDown}
        whileTap={{ scale: deco.scale * 1.05 }}
        transition={{ type: 'tween', duration: 0 }}
      >
        {deco.isImage ? <img src={asset(deco.content)} alt="" style={{ width: 100, display: 'block', pointerEvents: 'none' }} draggable="false" /> : deco.content}
        {isActive && <DecoHandles deco={deco} setDecorations={setDecorations} elementRef={elementRef} />}
      </motion.div>
    );
  }
}

function MiniTemplate({ frame, photos, filter, accent }) {
  return (
    <div className={`mini-template frame-${frame.id}`} style={{ '--accent': accent }}>
      {photos.slice(0, frame.id === 'magazine' ? 3 : 4).map((photo, index) => (
        <img key={index} src={photo} style={{ filter: filter.css }} alt="" />
      ))}
      <span>{frame.name}</span>
    </div>
  );
}

function PhotoStack({ photos, filter }) {
  return (
    <div className="photo-stack">
      {photos.map((photo, index) => (
        <motion.img key={photo} src={photo} style={{ filter: filter.css }} alt="" initial={{ opacity: 0, rotate: -5 + index * 4, x: index * 18, y: index * -8 }} animate={{ opacity: 1, rotate: -5 + index * 4, x: index * 18, y: index * -8 }} transition={{ delay: index * 0.08 }} />
      ))}
    </div>
  );
}

function DeviceFrame({ photos, filter, compact }) {
  return (
    <div className={`device-frame ${compact ? 'compact' : ''}`}>
      <div className="side-icons">
        <span><Grid2X2 size={16} />2 shots</span>
        <span className="active"><Grid2X2 size={16} />4 shots</span>
        <span><Film size={16} />GIF mode</span>
      </div>
      <div className="device-screen">
        <img src={photos[0]} style={{ filter: filter.css }} alt="" />
        <CameraOverlay />
      </div>
      <div className="device-counter">3</div>
    </div>
  );
}

function CameraOverlay() {
  return (
    <div className="cam-overlay" aria-hidden="true">
      <span className="rec">REC</span>
      <span className="timer">00:00:08</span>
      <span className="battery"><BatteryMedium size={24} /></span>
      <span className="timestamp">PM 04:23<br />MAY. 23 2004</span>
      <span className="focus-corner one" />
      <span className="focus-corner two" />
      <span className="focus-corner three" />
      <span className="focus-corner four" />
    </div>
  );
}

function Slider({ label, value, setValue, min = 0, max = 100 }) {
  return (
    <label className="slider-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => setValue(Number(event.target.value))} />
      <output>{value}</output>
    </label>
  );
}

function StickerBubble({ text, className = '' }) {
  return <motion.div className={`sticker-bubble ${className}`} animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity }}>{text}</motion.div>;
}

function DevelopingOverlay({ type }) {
  const label = type === 'png' ? 'polaroid developing' : type === 'jpg' ? 'film rolling' : type === 'gif' ? 'VHS rewinding' : 'cassette loading';
  return (
    <motion.div className="developing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="developing-card">
        <div className="film-roll"><span /></div>
        <strong>{label}</strong>
        <p>Burning soft bloom into the memory...</p>
      </div>
    </motion.div>
  );
}

function AmbientLayers() {
  return (
    <>
      <div className="grain-layer" />
      <div className="vhs-layer" />
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <motion.div className="floating-star star-a" animate={{ y: [0, -24, 0], rotate: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }}>✧</motion.div>
      <motion.div className="floating-star star-b" animate={{ y: [0, 18, 0], rotate: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }}>✦</motion.div>
      <motion.div className="floating-star star-c" animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity }}>☆</motion.div>
    </>
  );
}

function Footer() {
  const [freeze, setFreeze] = useState(false);

  return (
    <footer className="site-footer">
      <FooterWebGL freeze={freeze} />
      
      {/* Corner Stickers */}
      <img src={asset('sticker2_34.png')} alt="" className="f-sticker corner-l" />
      <img src={asset('stickers3_35.png')} alt="" className="f-sticker corner-r" />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <strong>About Memorie</strong>
        <p>Every session becomes a small artifact: camera glow, paper texture, chrome charm, timestamp, memory.</p>
        <button 
          onClick={() => setFreeze(!freeze)} 
          type="button"
          className="footer-freeze-btn"
        >
          {freeze ? 'UNFREEZE FLOWERS' : 'FREEZE FLOWERS'}
        </button>
      </div>

      <div className="footer-center" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transform: 'rotate(-3deg)', pointerEvents: 'none' }}>
          <span className="f-typo">Sweetest Memories</span>
          <span className="f-hint">Press anywhere to add flowers</span>
        </div>
      </div>

      <form style={{ position: 'relative', zIndex: 2 }}>
        <label htmlFor="email">Stay in the loop</label>
        <div>
          <input id="email" placeholder="you@email.com" />
          <button type="button">Join</button>
        </div>
      </form>
    </footer>
  );
}

async function renderExport({ frame, photos, filter, accent, decorations, doodlePaths, zoom, rotation, vignette }) {
  const baseW = 900;
  // Match CSS columns: magazine, chrome, and camera frames use a 2-column grid
  const columns = (frame.id === 'magazine' || frame.id === 'chrome' || frame.id === 'camera') ? 2 : 1;
  const gap = 36;
  const margin = 80;
  const topPadding = 110;
  const bottomPadding = 150;
  
  const slotW = columns === 2 ? (baseW - margin * 2 - gap) / 2 : baseW - margin * 2;
  // Standard 4:3 ratio (0.75) for photos
  const slotH = slotW * 0.75; 
  
  const rows = Math.ceil(photos.length / columns);
  // Calculate baseH dynamically based on rows to ensure all photos fit perfectly
  const baseH = topPadding + bottomPadding + (gap * (rows - 1)) + (slotH * rows);

  // Calculate bounds including photostrip (0,0 to baseW,baseH) and all decorations
  let minX = 0;
  let minY = 0;
  let maxX = baseW;
  let maxY = baseH;

  if (decorations) {
    decorations.forEach(deco => {
      const dx = (deco.x / 100) * baseW;
      const dy = (deco.y / 100) * baseH;
      // Approximate size for bounds (200px buffer)
      const buffer = 200 * deco.scale;
      minX = Math.min(minX, dx - buffer);
      minY = Math.min(minY, dy - buffer);
      maxX = Math.max(maxX, dx + buffer);
      maxY = Math.max(maxY, dy + buffer);
    });
  }

  // Add a bit of extra padding
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

  // Draw a soft drop shadow for the whole strip if it's expanded
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = frame.id === 'chrome' || frame.id === 'camera' ? '#d6d4cc' : frame.id === 'doodle' ? '#111' : '#f7eee6';
  ctx.fillRect(0, 0, baseW, baseH);
  ctx.restore();

  // Accent header
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
    drawCover(ctx, img, -slotW / 2, -slotH / 2, slotW, slotH, zoom);
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
  ctx.fillText('PM 04:23  MAY. 23 2004', baseW - 390, baseH - 54);

  if (decorations) {
    for (const deco of decorations) {
      if (deco.type === 'text') {
        ctx.save();
        ctx.translate((deco.x / 100) * baseW, (deco.y / 100) * baseH);
        ctx.rotate((deco.rotation * Math.PI) / 180);

        ctx.font = `900 ${28 * deco.scale}px ${deco.font || 'Inter'}, sans-serif`;
        if (deco.showBg !== false) {
          ctx.fillStyle = deco.bgColor || '#ff5aaf';
          const textWidth = ctx.measureText(deco.content).width;
          const h = (28 * deco.scale) * 1.5;
          const w = textWidth + h;
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
          const w = 100 * deco.scale;
          const h = (sImg.height / sImg.width) * w;
          if (deco.showBg !== false) {
            ctx.fillStyle = deco.bgColor || '#ff5aaf';
            ctx.beginPath();
            ctx.roundRect(-w / 2 - 12 * deco.scale, -h / 2 - 12 * deco.scale, w + 24 * deco.scale, h + 24 * deco.scale, 12 * deco.scale);
            ctx.fill();
          }
          ctx.drawImage(sImg, -w / 2, -h / 2, w, h);
        } else {
          ctx.font = `900 ${28 * deco.scale}px Fraunces, serif`;
          if (deco.showBg !== false) {
            ctx.fillStyle = deco.bgColor || '#ff5aaf';
            const textWidth = ctx.measureText(deco.content).width;
            const h = (28 * deco.scale) * 1.5;
            const w = textWidth + h;
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

  // Draw Doodles
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCover(ctx, image, x, y, width, height, zoom = 1) {
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

createRoot(document.getElementById('root')).render(<App />);
