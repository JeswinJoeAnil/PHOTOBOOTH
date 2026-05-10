import React, { memo } from 'react';
import { motion } from 'framer-motion';

function DraggablePhotoComponent({ photo, filter, index, zoom, rotation, fitMode }) {
  return (
    <motion.div className="photo-slot" drag dragMomentum={false} whileDrag={{ scale: 1.035, zIndex: 5 }} style={{ rotate: rotation + (index % 2 ? 1.5 : -1.2) }}>
      <img
        src={photo}
        style={{
          filter: filter.css,
          transform: `scale(${zoom})`,
          objectFit: fitMode === 'contain' ? 'contain' : 'cover',
          background: '#000',
        }}
        alt=""
      />
      <span>{String(index + 1).padStart(2, '0')}</span>
    </motion.div>
  );
}

export const DraggablePhoto = memo(DraggablePhotoComponent);
