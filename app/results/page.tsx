'use client';

import React, { useSyncExternalStore } from 'react';

type RideMatch = {
    rideId: string;
    riderName: string;
    destination: string;
    departureTime: string;
    matchScore: number;
    startDistanceMiles: number;
    endDistanceMiles: number;
    reasons: string[];
    contact?: string;
};

const subscribeToLocalStorage = () => () => undefined;

function parseMatches(serialized: string): RideMatch[] {
    if (!serialized) return [];
    try {
        return JSON.parse(serialized) as RideMatch[];
    } catch {
        return [];
    }
}

export default function Results() {
    const serializedMatches = useSyncExternalStore(
        subscribeToLocalStorage,
        () => localStorage.getItem('matchedRides') ?? '',
        () => '',
    );
    const aiExplanation = useSyncExternalStore(
        subscribeToLocalStorage,
        () => localStorage.getItem('matchExplanation') ?? '',
        () => '',
    );
    const matches = parseMatches(serializedMatches);

    return (
        <div
            style={{
                backgroundColor: '#255799',
                minHeight: '100vh',
                padding: '32px 20px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h1 style={{ color: '#fecc07', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
                Ranked ride matches
            </h1>
            <p style={{ marginBottom: '24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                Every score is computed from route distance, departure time, capacity, and luggage compatibility.
            </p>
            {aiExplanation && (
                <aside
                    style={{
                        backgroundColor: '#e8f1ff',
                        color: '#1f3f6d',
                        padding: '16px 20px',
                        borderRadius: '10px',
                        width: '100%',
                        maxWidth: '1000px',
                        marginBottom: '24px',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <strong>AI-assisted explanation:</strong> {aiExplanation}
                </aside>
            )}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1000px',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {matches.length === 0 && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        No compatible rides were found within the selected detour and time window.
                    </p>
                )}
                {matches.map((match) => (
                    <article
                        key={match.rideId}
                        style={{
                            backgroundColor: '#fff',
                            color: '#1f3f6d',
                            padding: '22px',
                            borderRadius: '12px',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{match.riderName}</h2>
                            <strong style={{ color: '#0f766e', fontSize: '1.2rem' }}>{match.matchScore}%</strong>
                        </div>
                        <p><strong>Destination:</strong> {match.destination}</p>
                        <p><strong>Departure:</strong> {new Date(match.departureTime).toLocaleString()}</p>
                        <p><strong>Pickup distance:</strong> {match.startDistanceMiles} mi</p>
                        <p><strong>Destination distance:</strong> {match.endDistanceMiles} mi</p>
                        <ul style={{ paddingLeft: '20px' }}>
                            {match.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                        </ul>
                        <p><strong>Contact:</strong> {match.contact ?? 'Available after confirmation'}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
