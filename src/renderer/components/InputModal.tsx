import React, { useEffect, useState, useRef } from 'react';
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
      >
        <div style={styles.settingsPanelHeader}>
          <h2 style={styles.settingsTitle}>{title}</h2>
          <button style={styles.settingsCloseBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={styles.modalContent}>
          {description && (
            <div style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.5' }}>
              {description}
            </div>
          )}

          {placeholder && (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              style={styles.modalInput}
              autoFocus
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
