import React, { useEffect, useState } from 'react';
import { styles } from './styles';

export interface InputModalProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  title,
  placeholder,
  confirmText = 'Confirm',
  onClose,
  onSubmit
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) setValue('');
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
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
          <div style={styles.modalButtonRow}>
            <button onClick={onClose} style={styles.modalCancelButton}>
              Cancel
            </button>
            <button onClick={submit} style={styles.modalConfirmButton}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

