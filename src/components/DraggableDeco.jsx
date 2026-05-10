import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { asset } from '../constants/assets.js';
import { DecoHandles } from './DecoHandles.jsx';

export function DraggableDeco({ deco, setDecorations, isActive, onPointerDown }) {
  const elementRef = useRef(null);

  const handlePointerDown = (e) => {
    onPointerDown(e);

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
  }
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
