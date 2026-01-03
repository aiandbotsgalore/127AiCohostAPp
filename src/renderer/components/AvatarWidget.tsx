import React, { useState, useEffect, useRef } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';

interface AvatarWidgetProps {
    vadStatus: { isSpeaking: boolean; isListening: boolean };
    collapsed: boolean;
    onStatusAction: (action: string) => void;
}

export const AvatarWidget: React.FC<AvatarWidgetProps> = ({ vadStatus, collapsed, onStatusAction }) => {
    const [blinkState, setBlinkState] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(0);

    const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
    const smokeParticles = useRef<any[]>([]);
    const blinkTimeout = useRef<NodeJS.Timeout | null>(null);
    const audioLevelRef = useRef(0);
    const vadStatusRef = useRef(vadStatus);

    useEffect(() => {
        vadStatusRef.current = vadStatus;
    }, [vadStatus]);

    // Audio Level Listener - subscribing here avoids re-rendering the parent component
    useEffect(() => {
        const unsubscribe = ipc.on('audio-level', (_event: any, data: { level: number }) => {
            audioLevelRef.current = data.level;
        });
        return () => unsubscribe();
    }, []);

    // Eye blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinkState(true);
            blinkTimeout.current = setTimeout(() => setBlinkState(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => {
            clearInterval(blinkInterval);
            if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
        };
    }, []);

    // Mouth animation based on speaking
    useEffect(() => {
        if (vadStatus.isSpeaking) {
            const mouthInterval = setInterval(() => {
                setMouthOpen(Math.random() * 0.5 + 0.3);
            }, 100);
            return () => clearInterval(mouthInterval);
        } else {
            setMouthOpen(0);
            return undefined;
        }
    }, [vadStatus.isSpeaking]);

    // Smoke particle animation
    useEffect(() => {
        const canvas = smokeCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        canvas.width = 200 * dpr;
        canvas.height = 200 * dpr;
        ctx.scale(dpr, dpr);

        let animationFrameId: number;

        const initParticles = () => {
            const particleCount = vadStatusRef.current.isSpeaking ? 20 : 5;
            while (smokeParticles.current.length < particleCount) {
                smokeParticles.current.push({
                    x: 130 + (Math.random() - 0.5) * 10,
                    y: 80,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -0.5 - Math.random() * 0.5,
                    size: 2 + Math.random() * 3,
                    opacity: 0.3 + Math.random() * 0.4,
                    life: 1.0
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, 200, 200);

            const cigaretteGlow = audioLevelRef.current / 100;

            smokeParticles.current = smokeParticles.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.size += 0.1;
                p.life -= 0.01;
                p.opacity = p.life * 0.4;

                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
                    ctx.fill();
                    return true;
                }
                return false;
            });

            // Cigarette glow
            ctx.beginPath();
            ctx.arc(156, 114, 3 + cigaretteGlow * 2, 0, Math.PI * 2);
            const glowGrad = ctx.createRadialGradient(156, 114, 0, 156, 114, 5 + cigaretteGlow * 3);
            glowGrad.addColorStop(0, `rgba(255, 102, 0, ${0.8 + cigaretteGlow * 0.2})`);
            glowGrad.addColorStop(1, 'rgba(255, 102, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fill();

            initParticles();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [collapsed]);

    if (collapsed) return null;

    return (
        <>
            <div style={styles.avatarContainer}>
                <canvas
                    ref={smokeCanvasRef}
                    style={styles.smokeCanvas}
                />
                <svg viewBox="0 0 200 200" style={styles.avatarSvg}>
                    {/* Status Glow Ring */}
                    <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke={vadStatus.isSpeaking ? '#ff4444' : vadStatus.isListening ? '#ffaa00' : '#00ddff'}
                        strokeWidth="4"
                        opacity="0.6"
                        style={{
                            filter: `drop-shadow(0 0 10px ${vadStatus.isSpeaking ? '#ff4444' : vadStatus.isListening ? '#ffaa00' : '#00ddff'})`
                        }}
                    />

                    {/* Head tilt when listening */}
                    <g transform={vadStatus.isListening ? 'rotate(5 100 100)' : 'rotate(0 100 100)'}>
                        {/* Bear Head */}
                        <circle cx="100" cy="100" r="60" fill="#D4A574" />

                        {/* Ears */}
                        <circle cx="65" cy="60" r="20" fill="#D4A574" />
                        <circle cx="135" cy="60" r="20" fill="#D4A574" />
                        <circle cx="65" cy="60" r="12" fill="#C4956A" />
                        <circle cx="135" cy="60" r="12" fill="#C4956A" />

                        {/* Bandage */}
                        <rect x="80" y="45" width="40" height="12" fill="#FFF" rx="2" />
                        <line x1="85" y1="45" x2="85" y2="57" stroke="#DDD" strokeWidth="1" />
                        <line x1="100" y1="45" x2="100" y2="57" stroke="#DDD" strokeWidth="1" />
                        <line x1="115" y1="45" x2="115" y2="57" stroke="#DDD" strokeWidth="1" />

                        {/* Snout */}
                        <ellipse cx="100" cy="115" rx="35" ry="28" fill="#C4956A" />

                        {/* Nose */}
                        <ellipse cx="100" cy="108" rx="12" ry="10" fill="#3D2817" />

                        {/* Eyes with blink */}
                        {!blinkState ? (
                            <>
                                <ellipse cx="80" cy="90" rx="8" ry="10" fill="#3D2817" />
                                <ellipse cx="120" cy="90" rx="8" ry="10" fill="#3D2817" />
                            </>
                        ) : (
                            <>
                                <line x1="72" y1="90" x2="88" y2="90" stroke="#3D2817" strokeWidth="2" />
                                <line x1="112" y1="90" x2="128" y2="90" stroke="#3D2817" strokeWidth="2" />
                            </>
                        )}
                        <path d="M 72 82 Q 80 85 88 82" stroke="#3D2817" strokeWidth="2" fill="none" />
                        <path d="M 112 82 Q 120 85 128 82" stroke="#3D2817" strokeWidth="2" fill="none" />

                        {/* Mouth with animation */}
                        <path
                            d={`M 80 ${125 + mouthOpen * 10} Q 100 ${122 + mouthOpen * 15} 120 ${125 + mouthOpen * 10}`}
                            stroke="#3D2817"
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Cigarette */}
                        <rect x="125" y="112" width="30" height="4" fill="#FFF" rx="2" />
                        <rect x="152" y="111" width="8" height="6" fill="#D4A574" rx="1" />
                        <circle cx="156" cy="114" r="2" fill="#ff6600" />
                    </g>
                </svg>

                <div style={styles.shirtLabel}>CIA</div>
            </div>

            <div style={styles.statusButtons}>
                <button
                    style={{ ...styles.statusBtn, ...(vadStatus.isSpeaking ? styles.statusBtnActive : {}) }}
                    onClick={() => onStatusAction('speak')}
                    aria-label="Speak"
                >
                    🗣 SPEAK
                </button>
                <button
                    style={{ ...styles.statusBtn, ...(vadStatus.isListening ? styles.statusBtnActive : {}) }}
                    onClick={() => onStatusAction('listen')}
                    aria-label="Listen"
                >
                    👂 LISTEN
                </button>
                <button
                    style={styles.statusBtn}
                    onClick={() => onStatusAction('reset')}
                    aria-label="Reset"
                >
                    🔄 RESET
                </button>
            </div>

            <div style={styles.currentStatus}>
                Status: {vadStatus.isSpeaking ? 'Speaking' : vadStatus.isListening ? 'Listening' : 'Idle'}
            </div>
        </>
    );
};
