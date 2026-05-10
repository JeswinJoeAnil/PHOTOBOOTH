import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

export function MobileMenu({ isOpen, onClose, onFeedbackOpen }) {
  const links = [
    { label: 'Booth', href: '#booth' },
    { label: 'Templates', href: '#templates' },
    { label: 'Gallery', href: '#memory-lab' },
    { label: 'Export', href: '#export' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 3000 }}
        >
          <div className="menu-backdrop" onClick={onClose} role="presentation" />
          <motion.div
            className="menu-content"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button type="button" className="close-menu" onClick={onClose}>
              <X size={24} />
            </button>
            <div className="menu-links">
              {links.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileHover={{ x: 10, color: '#ff4090' }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                type="button"
                className="menu-feedback-btn"
                onClick={() => { onClose(); onFeedbackOpen(); }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare size={18} /> Give Feedback
              </motion.button>
            </div>
            <div className="menu-footer">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦ memorie+ photobooth ✦
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
