import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export function FeedbackOverlay({ onClose, ownerEmail }) {
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mpqbybgq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: msg,
          _subject: 'New Feedback from Memory Lab',
          email: 'feedback-bot@memorie.lab',
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(onClose, 2500);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      console.error(err);
      alert('Oops! Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <motion.div className="feedback-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="feedback-backdrop" onClick={onClose} role="presentation" />
      <motion.div
        className="feedback-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <button type="button" className="close-feedback" onClick={onClose}>&times;</button>

        {status === 'success' ? (
          <div className="feedback-success">
            <div className="success-icon">✦</div>
            <h3>Feedback Sent!</h3>
            <p>Sent to {ownerEmail}</p>
          </div>
        ) : (
          <>
            <div className="feedback-header">
              <MessageSquare size={24} />
              <h2>Share Your Thoughts</h2>
            </div>
            <p>Your feedback helps us make the <strong>Memory Lab</strong> even better.</p>

            <form onSubmit={handleSubmit}>
              <textarea
                autoFocus
                placeholder="Type your feedback here..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                disabled={status === 'sending'}
              />
              <button type="submit" className="submit-btn" disabled={status === 'sending' || !msg.trim()}>
                {status === 'sending' ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
