import React, { memo } from 'react';
import { BatteryMedium } from 'lucide-react';

function CameraOverlayComponent({ timestamp }) {
  return (
    <div className="cam-overlay" aria-hidden="true">
      <span className="rec">REC</span>
      <span className="timer">00:00:08</span>
      <span className="battery"><BatteryMedium size={24} /></span>
      <span className="timestamp">{timestamp.time}<br />{timestamp.date}</span>
      <span className="focus-corner one" />
      <span className="focus-corner two" />
      <span className="focus-corner three" />
      <span className="focus-corner four" />
    </div>
  );
}

export const CameraOverlay = memo(CameraOverlayComponent);
