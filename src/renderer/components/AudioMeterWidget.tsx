import React, { useEffect, useState } from 'react';

import { ipc } from '../ipc';
import { styles } from './styles';

export const AudioMeterWidget: React.FC = () => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const unsubscribe = ipc.on('audio-level', (_event: any, data: { level: number }) => {
      void _event;
      setAudioLevel(data.level);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={styles.audioMeter}>
      <div style={styles.meterLabel}>INPUT LEVEL</div>
      <div style={styles.meterBar}>
        <div
          style={{
            ...styles.meterFill,
            width: `${audioLevel}%`,
            backgroundColor: audioLevel > 80 ? '#ff4444' : audioLevel > 50 ? '#ffaa00' : '#00ff88'
          }}
        />
      </div>
    </div>
  );
};
