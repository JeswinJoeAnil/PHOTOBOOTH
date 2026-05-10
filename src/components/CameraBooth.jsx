import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BatteryMedium,
  Camera,
  Film,
  Flashlight,
  Grid2X2,
  Pause,
  RefreshCcw,
  RotateCw,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react';
import { assetPhotos } from '../constants/assets.js';
import { encodeVideoFrameToStrip } from '../utils/capture.js';
import { getFormattedTimestamp } from '../utils/timestamp.js';
import { CameraOverlay } from './CameraOverlay.jsx';

function CameraBoothComponent({
  isOpen,
  setOpen,
  mode,
  setMode,
  timer,
  setTimer,
  activeFilter,
  captured,
  setCaptured,
  timestamp,
  setTimestamp,
  flashOn,
  setFlashOn,
  mirrorOn,
  setMirrorOn,
  onCapture,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const capturedRef = useRef(captured);
  capturedRef.current = captured;

  const [streaming, setStreaming] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [shotIndex, setShotIndex] = useState(null);
  const [error, setError] = useState('');
  const [shooting, setShooting] = useState(false);
  const shootingRef = useRef(false);
  const [flashFire, setFlashFire] = useState(false);

  const updateTimestamp = useCallback(() => {
    setTimestamp(getFormattedTimestamp());
  }, [setTimestamp]);

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

  const fireFlash = useCallback(() => {
    if (!flashOn) return;
    setFlashFire(true);
    window.setTimeout(() => setFlashFire(false), 480);
  }, [flashOn]);

  const captureOnePhoto = useCallback(async (currentCaptured) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (currentCaptured.length === 0) {
      updateTimestamp();
    }

    if (!canvas || !video || !streaming) {
      const fallback = assetPhotos[currentCaptured.length % assetPhotos.length];
      fireFlash();
      if (onCapture) onCapture();
      return [...currentCaptured, fallback];
    }

    const dataUrl = await encodeVideoFrameToStrip(canvas, video, mirrorOn, activeFilter.css);
    fireFlash();
    if (onCapture) onCapture();
    return [...currentCaptured, dataUrl];
  }, [activeFilter.css, fireFlash, mirrorOn, onCapture, streaming, updateTimestamp]);

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = mode - captured.length;
    if (remainingSlots <= 0) {
      alert(`The photostrip is already full (${mode} photos). Please clear the roll to add more.`);
      return;
    }

    if (captured.length === 0) {
      updateTimestamp();
    }

    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Only the first ${remainingSlots} images were added because the strip is limited to ${mode} photos.`);
    }

    let processedCount = 0;
    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCaptured((list) => [...list, event.target.result]);
        processedCount++;
        if (processedCount === filesToProcess.length && onCapture) {
          onCapture();
        }
      };
      reader.readAsDataURL(file);
    });
  }, [captured.length, mode, onCapture, setCaptured, updateTimestamp]);

  const delay = (ms) => new Promise((r) => window.setTimeout(r, ms));

  const runSingleCapture = useCallback(async () => {
    if (shootingRef.current) return;
    shootingRef.current = true;
    setShooting(true);
    setOpen(true);

    const prevBefore = capturedRef.current;
    const isFull = prevBefore.length >= mode;
    setShotIndex(isFull ? 1 : prevBefore.length + 1);

    if (timer > 0) {
      for (let t = timer; t >= 1; t--) {
        setCountdown(t);
        await delay(1000);
      }
    }
    setCountdown(null);

    const prev = capturedRef.current;
    const base = prev.length >= mode ? [] : prev;
    const next = await captureOnePhoto(base);
    setCaptured(next);

    setShotIndex(null);
    setShooting(false);
    shootingRef.current = false;
    window.setTimeout(() => document.getElementById('memory-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }, [captureOnePhoto, mode, setCaptured, setOpen, timer]);

  const runSequentialCapture = useCallback(async (totalShots) => {
    if (shootingRef.current) return;
    shootingRef.current = true;
    setShooting(true);
    setOpen(true);
    let currentPhotos = [];
    setCaptured([]);

    for (let i = 0; i < totalShots; i++) {
      if (!shootingRef.current) break;
      setShotIndex(i + 1);
      if (timer > 0) {
        for (let t = timer; t >= 1; t--) {
          setCountdown(t);
          await delay(1000);
        }
      }
      setCountdown(null);
      currentPhotos = await captureOnePhoto(currentPhotos);
      setCaptured([...currentPhotos]);
      if (i < totalShots - 1) {
        await delay(800);
        await new Promise((r) => requestAnimationFrame(r));
      }
    }
    setShotIndex(null);
    setShooting(false);
    shootingRef.current = false;
    window.setTimeout(() => document.getElementById('memory-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }, [captureOnePhoto, setCaptured, setOpen, timer]);

  const stopBurst = useCallback(() => {
    shootingRef.current = false;
    setShooting(false);
    setCountdown(null);
    setShotIndex(null);
  }, []);

  const flashPortal = createPortal(
    <AnimatePresence>
      {flashFire && (
        <motion.div className="flash" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.46 }} />
      )}
    </AnimatePresence>,
    document.body,
  );

  return (
    <>
      <motion.section className="booth-card capture-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring' }}>
        <div className="section-title">
          <Sparkles size={18} />
          <span>Live Booth</span>
          {shooting && <span className="shooting-badge">● SHOOTING {shotIndex}/{mode}</span>}
        </div>
        <div className="capture-layout">
          <div className="mode-stack" aria-label="Photo count">
            {[2, 3, 4, 6].map((item) => (
              <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => { if (!shooting) setMode(item); }}>
                <Grid2X2 size={18} />
                <span>{item} shots</span>
              </button>
            ))}
            <button type="button" className="ghost-mode"><Film size={18} /><span>GIF mode</span></button>
          </div>
          <div className="camera-stage">
            <video ref={videoRef} autoPlay playsInline muted className="live-video" style={{ filter: activeFilter.css, transform: mirrorOn ? 'scaleX(-1)' : 'none' }} />
            {!streaming && <img src={assetPhotos[captured.length % assetPhotos.length]} className="live-video fallback-video" style={{ filter: activeFilter.css }} alt="" />}
            <CameraOverlay timestamp={timestamp} />
            <AnimatePresence mode="wait">
              {countdown && <motion.div className="countdown" key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}>{countdown}</motion.div>}
            </AnimatePresence>
            {error && <div className="camera-error">{error}</div>}
          </div>
          <div className="camera-options">
            <button type="button" className={flashOn ? 'opt-active' : ''} onClick={() => setFlashOn((v) => !v)}><Flashlight size={18} /> Flash <span>{flashOn ? 'on' : 'off'}</span></button>
            <button type="button" className={mirrorOn ? 'opt-active' : ''} onClick={() => setMirrorOn((v) => !v)}><RefreshCcw size={18} /> Mirror <span>{mirrorOn ? 'on' : 'off'}</span></button>
            <button
              type="button"
              className={timer > 0 ? 'opt-active' : ''}
              onClick={() => {
                const options = [0, 2, 3, 5, 10];
                const next = options[(options.indexOf(timer) + 1) % options.length];
                setTimer(next);
              }}
            >
              <BatteryMedium size={18} /> Timer <span>{timer === 0 ? 'off' : `${timer}s`}</span>
            </button>
            <button type="button" onClick={() => { if (!shooting) setCaptured((list) => list.slice(0, -1)); }}><RotateCw size={18} /> Retake <span>{captured.length}</span></button>
          </div>
        </div>
        <div className="capture-actions">
          {!shooting ? (
            <>
              <button type="button" className="shutter-large burst-button" onClick={() => runSequentialCapture(mode)}><Zap size={22} /> Burst Mode</button>
              <button type="button" className="shutter-large" onClick={runSingleCapture}><Camera size={24} /> Capture Shot</button>
              <div className="secondary-actions" style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="pill-button" onClick={() => setCaptured([])}>Clear roll</button>
                <button type="button" className="pill-button import-btn" onClick={() => document.getElementById('booth-file-upload').click()}>
                  <Upload size={16} /> Import
                </button>
                <input type="file" id="booth-file-upload" hidden multiple accept="image/*" onChange={handleFileUpload} />
              </div>
            </>
          ) : (
            <button type="button" className="shutter-large stop-button" onClick={stopBurst}><Pause size={22} /> Stop</button>
          )}
        </div>
        <a href="#templates" className="vibe-link"><Sparkles size={16} /> Choose Your Vibe</a>
        <canvas ref={canvasRef} hidden />
      </motion.section>
      {flashPortal}
    </>
  );
}

export const CameraBooth = memo(CameraBoothComponent);
