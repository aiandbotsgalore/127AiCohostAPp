import React, { useEffect, useState, useRef, useId } from 'react';
import { styles } from './styles';

export interface InputModalProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  description?: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  title,
  placeholder,
  description,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  onClose,
  onSubmit
}) => {
  const [value, setValue] = useState('');
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Use useId if available (React 18+), otherwise fallback to random string
  const uniqueId = useId ? useId() : Math.random().toString(36).substr(2, 9);
  const titleId = `modal-title-${uniqueId}`;
  const descId = `modal-desc-${uniqueId}`;

  useEffect(() => {
    if (isOpen) {
      setValue('');
      if (!placeholder) {
        setTimeout(() => confirmBtnRef.current?.focus(), 50);
      }
    }
  }, [isOpen, placeholder]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = () => {
    if (placeholder) {
      const trimmed = value.trim();
      if (!trimmed) return;
      onSubmit(trimmed);
    } else {
      onSubmit('');
    }
  };

  return (
    <div style={styles.settingsOverlay} onClick={onClose}>
      <div
        style={{ ...styles.settingsPanel, height: 'auto', maxHeight: 'none', width: '400px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        <div style={styles.settingsPanelHeader}>
          <h2 id={titleId} style={styles.settingsTitle}>{title}</h2>
          <button style={styles.settingsCloseBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div style={styles.modalContent}>
          {description && (
            placeholder ? (
              <label id={descId} htmlFor="modal-input" style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>
                {description}
              </label>
            ) : (
              <div id={descId} style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.5' }}>
                {description}
              </div>
            )
          )}

          {placeholder && (
            <input
              id="modal-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              aria-label={title}
              style={styles.modalInput}
              autoFocus
              aria-labelledby={!description ? titleId : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') onClose();
              }}
            />
          )}

          <div style={styles.modalButtonRow}>
            <button onClick={onClose} style={styles.modalCancelButton}>
              Cancel
            </button>
            <button
              ref={confirmBtnRef}
              onClick={submit}
              style={{
                ...styles.modalConfirmButton,
                ...(confirmVariant === 'danger' ? { backgroundColor: '#ff4444' } : {})
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
