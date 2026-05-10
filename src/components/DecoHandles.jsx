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
      <div className="deco-handle delete-handle" data-tip="Remove" onPointerDown={handleDelete}>
        <Trash2 size={11} />
      </div>
      <div className="deco-handle rotate-handle" data-tip="Rotate" onPointerDown={handleRotate}>
        <RotateCw size={13} />
      </div>
      <div className="deco-handle resize-handle" data-tip="Resize" onPointerDown={handleResize}>
        <Sparkles size={13} />
      </div>

      <div className="deco-corner top-left" />
      <div className="deco-corner top-right" />
      <div className="deco-corner bottom-left" />
      <div className="deco-corner bottom-right" />
    </>
  );
}
