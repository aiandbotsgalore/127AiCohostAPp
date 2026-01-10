import React, { useState, useEffect, useMemo } from 'react';
import { styles } from './styles';
import { factCheckStore } from '../stores/factCheckStore';

export const FactCheckStatsWidget: React.FC = () => {
    const [factChecks, setFactChecks] = useState(factCheckStore.getFactChecks());

    useEffect(() => {
        setFactChecks(factCheckStore.getFactChecks());
        return factCheckStore.subscribe(() => {
            setFactChecks(factCheckStore.getFactChecks());
        });
    }, []);

    const stats = useMemo(() => ({
        total: factChecks.length,
        true: factChecks.filter(c => c.verdict === 'True').length,
        false: factChecks.filter(c => c.verdict === 'False').length,
    }), [factChecks]);

    return (
        <>
            <div style={styles.analyticsRow}>
                <span>Fact Checks:</span>
                <span style={styles.analyticsValue}>{stats.total}</span>
            </div>
            <div style={styles.analyticsRow}>
                <span style={{ color: '#00ff88' }}>✓ True:</span>
                <span style={styles.analyticsValue}>{stats.true}</span>
            </div>
            <div style={styles.analyticsRow}>
                <span style={{ color: '#ff4444' }}>✗ False:</span>
                <span style={styles.analyticsValue}>{stats.false}</span>
            </div>
        </>
    );
};
