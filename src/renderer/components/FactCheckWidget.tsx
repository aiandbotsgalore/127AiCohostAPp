import React, { useState, useEffect, useMemo } from 'react';
import { styles } from './styles';
import { FactCheck, factCheckStore } from '../stores/factCheckStore';
import { InputModal } from './InputModal';

interface FactCheckWidgetProps {
    collapsed: boolean;
    showToast: (message: string, type?: 'error' | 'success') => void;
}

export const FactCheckWidget: React.FC<FactCheckWidgetProps> = ({ collapsed, showToast }) => {
    // Sync state with store
    const [factChecks, setFactChecks] = useState<FactCheck[]>(factCheckStore.getFactChecks());
    const [pinnedClaims, setPinnedClaims] = useState(factCheckStore.getPinnedClaims());

    useEffect(() => {
        // Sync on mount
        setFactChecks(factCheckStore.getFactChecks());
        setPinnedClaims(factCheckStore.getPinnedClaims());

        // Subscribe
        return factCheckStore.subscribe(() => {
            setFactChecks(factCheckStore.getFactChecks());
            setPinnedClaims(factCheckStore.getPinnedClaims());
        });
    }, []);

    const [factCheckFilter, setFactCheckFilter] = useState('All');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        placeholder: undefined as string | undefined,
        description: undefined as string | undefined,
        confirmText: 'Confirm',
        confirmVariant: 'primary' as 'primary' | 'danger',
        type: '' as '' | 'clearFactChecks',
    });

    const togglePinClaim = (id: string) => {
        factCheckStore.togglePin(id);
    };

    const handleClearFactChecks = () => {
        setModalConfig({
            isOpen: true,
            title: 'Clear Fact Checks',
            placeholder: undefined,
            description: 'Are you sure you want to clear all fact checks? This will also unpin all claims.',
            confirmText: 'Clear Facts',
            confirmVariant: 'danger',
            type: 'clearFactChecks',
        });
    };

    const handleExportFactChecks = () => {
        const data = JSON.stringify(factChecks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factchecks-${Date.now()}.json`;
        a.click();
        showToast('Fact checks exported to file');
    };

    const handleModalSubmit = () => {
        if (modalConfig.type === 'clearFactChecks') {
            factCheckStore.clear();
            showToast('Fact checks cleared');
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    // Memoized Calculations
    const filteredFactChecks = useMemo(() => factChecks.filter(claim =>
        factCheckFilter === 'All' || claim.verdict === factCheckFilter
    ), [factChecks, factCheckFilter]);

    const sortedFactChecks = useMemo(() => [...filteredFactChecks].sort((a, b) => {
        const aPinned = pinnedClaims.has(a.id);
        const bPinned = pinnedClaims.has(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
    }), [filteredFactChecks, pinnedClaims]);

    if (collapsed) return null;

    return (
        <>
            <div style={styles.factCheckTools}>
                <select
                    style={styles.factFilterSelect}
                    value={factCheckFilter}
                    onChange={(e) => setFactCheckFilter(e.target.value)}
                    aria-label="Filter fact checks"
                >
                    <option value="All">All</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                    <option value="Misleading">Misleading</option>
                    <option value="Unverified">Unverified</option>
                </select>
                <button
                    style={styles.toolBtn}
                    onClick={handleExportFactChecks}
                    title="Export fact checks"
                    aria-label="Export fact checks"
                >
                    📥
                </button>
                <button
                    style={styles.toolBtn}
                    onClick={handleClearFactChecks}
                    title="Clear all"
                    aria-label="Clear fact checks"
                >
                    🗑️
                </button>
            </div>
            <div style={styles.factCheckFeed}>
                {sortedFactChecks.map((claim) => (
                    <div key={claim.id} style={styles.factCheckItem}>
                        <div style={styles.factCheckHeader}>
                            <span style={{
                                ...styles.verdictBadge,
                                backgroundColor:
                                    claim.verdict === 'True' ? 'rgba(0, 255, 136, 0.2)' :
                                        claim.verdict === 'False' ? 'rgba(255, 68, 68, 0.2)' :
                                            claim.verdict === 'Misleading' ? 'rgba(255, 170, 0, 0.2)' :
                                                'rgba(136, 136, 136, 0.2)',
                                borderColor:
                                    claim.verdict === 'True' ? '#00ff88' :
                                        claim.verdict === 'False' ? '#ff4444' :
                                            claim.verdict === 'Misleading' ? '#ffaa00' :
                                                '#888'
                            }}>
                                {claim.verdict}
                            </span>
                            <span style={styles.confidenceBadge}>{claim.confidence}%</span>
                            <button
                                style={{
                                    ...styles.pinButton,
                                    color: pinnedClaims.has(claim.id) ? '#ffaa00' : '#666'
                                }}
                                onClick={() => togglePinClaim(claim.id)}
                                aria-label={pinnedClaims.has(claim.id) ? 'Unpin claim' : 'Pin claim'}
                            >
                                {pinnedClaims.has(claim.id) ? '📌' : '📍'}
                            </button>
                        </div>
                        <div style={styles.factCheckClaim}>{claim.claim}</div>
                        <div style={styles.factCheckReason}>{claim.reason}</div>
                        <div style={styles.factCheckTime}>
                            {new Date(claim.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <InputModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                placeholder={modalConfig.placeholder}
                description={modalConfig.description}
                confirmText={modalConfig.confirmText}
                confirmVariant={modalConfig.confirmVariant}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onSubmit={handleModalSubmit}
            />
        </>
    );
};
