import React, { useRef } from 'react';
import { RotateCw, Sparkles, Trash2 } from 'lucide-react';

export function DecoHandles({ deco, setDecorations, elementRef }) {
  const handleResize = (e) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const startScaleX = deco.scaleX || 1;
    const startScaleY = deco.scaleY || 1;

    const onMove = (moveEvent) => {
      const currentDist = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
      const ratio = currentDist / Math.max(1, startDist);
      setDecorations(prev => prev.map(d => d.id === deco.id ? { 
        ...d, 
        scaleX: Math.max(0.1, startScaleX * ratio),
        scaleY: Math.max(0.1, startScaleY * ratio)
      } : d));
    };
    const onUp = (upEvent) => {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const handleStretch = (e, axis) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleRad = (deco.rotation || 0) * (Math.PI / 180);
    
    const getLocalDist = (clientX, clientY) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      // Unrotate
      const lx = dx * Math.cos(-angleRad) - dy * Math.sin(-angleRad);
      const ly = dx * Math.sin(-angleRad) + dy * Math.cos(-angleRad);
      return axis === 'x' ? Math.abs(lx) : Math.abs(ly);
    };

    const startDist = getLocalDist(e.clientX, e.clientY);
    const startScaleX = deco.scaleX || 1;
    const startScaleY = deco.scaleY || 1;

    const onMove = (moveEvent) => {
      const currentDist = getLocalDist(moveEvent.clientX, moveEvent.clientY);
      const ratio = currentDist / Math.max(1, startDist);
      
      if (axis === 'x') {
        const newScaleX = Math.max(0.05, startScaleX * ratio);
        setDecorations(prev => prev.map(d => d.id === deco.id ? { ...d, scaleX: newScaleX } : d));
      } else {
        const newScaleY = Math.max(0.05, startScaleY * ratio);
        setDecorations(prev => prev.map(d => d.id === deco.id ? { ...d, scaleY: newScaleY } : d));
      }
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

  const invScale = {
    scaleX: 1 / (deco.scaleX || 1),
    scaleY: 1 / (deco.scaleY || 1),
  };

  return (
    <>
      <div className="deco-handle delete-handle" data-tip="Remove" onPointerDown={handleDelete} style={invScale}>
        <Trash2 size={11} />
      </div>
      <div className="deco-handle rotate-handle" data-tip="Rotate" onPointerDown={handleRotate} style={invScale}>
        <RotateCw size={13} />
      </div>
      <div className="deco-handle resize-handle" data-tip="Resize" onPointerDown={handleResize} style={invScale}>
        <Sparkles size={13} />
      </div>

      {/* Side Stretch Handles (The Bars) */}
      <div className="stretch-handle stretch-h stretch-left" onPointerDown={(e) => handleStretch(e, 'x')} style={invScale} />
      <div className="stretch-handle stretch-h stretch-right" onPointerDown={(e) => handleStretch(e, 'x')} style={invScale} />
      <div className="stretch-handle stretch-v stretch-top" onPointerDown={(e) => handleStretch(e, 'y')} style={invScale} />
      <div className="stretch-handle stretch-v stretch-bottom" onPointerDown={(e) => handleStretch(e, 'y')} style={invScale} />

      {/* Corner Dots - also act as uniform resize handles */}
      <div className="deco-corner top-left" onPointerDown={handleResize} style={invScale} />
      <div className="deco-corner top-right" onPointerDown={handleResize} style={invScale} />
      <div className="deco-corner bottom-left" onPointerDown={handleResize} style={invScale} />
      <div className="deco-corner bottom-right" onPointerDown={handleResize} style={invScale} />
    </>
  );
}
