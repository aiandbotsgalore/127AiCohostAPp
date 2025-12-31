import React, { useState, useEffect } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';

export const StatusBarWidget: React.FC = () => {
    const [latency, setLatency] = useState(0);
    const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
    const [processingStatus, setProcessingStatus] = useState({ queueDepth: 0, processingDelay: 0 });
    const [sessionStart] = useState(Date.now());
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Effect to update current time every second for the session duration
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // IPC Listeners
    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(ipc.on('genai:latencyUpdate', (event, data) => {
            void event;
            setLatency(data.totalRoundtrip);
            setLatencyHistory(prev => [...prev, data.totalRoundtrip].slice(-30));
        }));

        unsubscribers.push(ipc.on('processing:status', (event, data) => {
            void event;
            setProcessingStatus(data);
        }));

        return () => {
            unsubscribers.forEach(unsub => unsub && unsub());
        };
    }, []);

    const sessionDuration = Math.floor((currentTime - sessionStart) / 1000);

    return (
        <div style={styles.statusBar}>
            <div style={styles.statusBarItem}>
                <span style={styles.statusBarLabel}>LATENCY</span>
                <span style={{ ...styles.statusBarValue, color: latency < 100 ? '#00ff88' : latency < 200 ? '#ffaa00' : '#ff4444' }}>
                    {latency.toFixed(0)}ms
                </span>
                <div style={styles.miniGraph}>
                    {latencyHistory.slice(-15).map((val, idx) => (
                        <div
                            key={idx}
                            style={{
                                ...styles.miniGraphBar,
                                height: `${(val / 300) * 100}%`,
                                backgroundColor: val < 100 ? '#00ff88' : val < 200 ? '#ffaa00' : '#ff4444'
                            }}
                        />
                    ))}
                </div>
            </div>
            <div style={styles.statusBarItem}>
                <span style={styles.statusBarLabel}>QUEUE DEPTH</span>
                <span style={styles.statusBarValue}>{processingStatus.queueDepth}</span>
            </div>
            <div style={styles.statusBarItem}>
                <span style={styles.statusBarLabel}>PROCESSING DELAY</span>
                <span style={styles.statusBarValue}>{processingStatus.processingDelay.toFixed(0)}ms</span>
            </div>
            <div style={styles.statusBarItem}>
                <span style={styles.statusBarLabel}>SESSION</span>
                <span style={styles.statusBarValue}>{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
            </div>
        </div>
    );
};
