import React, { useRef, useEffect, useCallback } from 'react';
import { AudioPlaybackService } from '../../services/audioPlaybackService';
import './DrSnugglesVisualizer.css';

interface VisualizerProps {
    service: AudioPlaybackService | null;
    className?: string;
}

export const DrSnugglesVisualizer: React.FC<VisualizerProps> = ({ service, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current || !service?.isActive) return;

        const ctx = canvas.getContext('2d')!;
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!service?.isActive) {
                // Clear and show idle state
                ctx.fillStyle = 'rgba(30, 60, 114, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return;
            }

            analyser.getByteFrequencyData(dataArray);

            // Fade effect
            ctx.fillStyle = 'rgba(30, 60, 114, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            let avgVolume = 0;

            for (let i = 0; i < bufferLength; i++) {
                avgVolume += dataArray[i];
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
                const scaledHeight = barHeight * (avgVolume / bufferLength > 10 ? 1.5 : 1);

                // Gradient colors (warm to cool)
                const r = Math.min(255, scaledHeight + 100 * (i / bufferLength));
                const g = Math.min(255, 80 + scaledHeight / 3);
                const b = Math.min(255, 100 + (i / bufferLength) * 100);

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, canvas.height - scaledHeight / 2, barWidth, scaledHeight / 2);
                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
    }, [service]);

    useEffect(() => {
        if (!service?.audioContext || !canvasRef.current) return;

        const analyser = service.audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        if (typeof service.connectVisualizer === 'function') {
            service.connectVisualizer(analyser);
        } else {
            console.warn('[Visualizer] connectVisualizer not implemented');
        }

        // Set canvas size
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;

        drawWaveform();

        // Handle resize
        const observer = new ResizeObserver(() => {
            if (canvas.parentElement) {
                canvas.width = canvas.offsetWidth * window.devicePixelRatio;
                canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            }
        });
        observer.observe(canvas.parentElement!);

        return () => {
            observer.disconnect();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            analyserRef.current?.disconnect();
        };
    }, [drawWaveform, service]);

    return (
        <div className={`visualizer-container ${className}`}>
            <div className="visualizer-header">
                <div className={`visualizer-status ${service?.isActive ? 'active' : ''}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">{service?.isActive ? 'Speaking' : 'Idle'}</span>
                </div>
                <span className="visualizer-label">Dr. Snuggles</span>
            </div>
            <canvas ref={canvasRef} className="snuggles-waveform" />
        </div>
    );
};
