import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { asset } from '../constants/assets.js';

function FooterComponent() {
  return (
    <footer className="site-footer">

      <img src={asset('sticker2_34.png')} alt="" className="f-sticker corner-l" />
      <img src={asset('stickers3_35.png')} alt="" className="f-sticker corner-r" />

      <div className="footer-marquee">
        <div className="marquee-content">
          <span>✦ CAPTURE THE CHAOS ✦ NOSTALGIA FOREVER ✦ PRINT YOUR VIBE ✦ Y2K AESTHETIC </span>
          <span>✦ CAPTURE THE CHAOS ✦ NOSTALGIA FOREVER ✦ PRINT YOUR VIBE ✦ Y2K AESTHETIC </span>
        </div>
      </div>

      <div className="footer-left" style={{ position: 'relative', zIndex: 2 }} />

      <div className="footer-center" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transform: 'rotate(-3deg)', pointerEvents: 'none' }}>
          <span className="f-typo">Sweetest Memories</span>
          <span className="f-tagline">keeping moments a little longer, one flash at a time ✦</span>
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

export const Footer = memo(FooterComponent);
