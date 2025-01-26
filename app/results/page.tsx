'use client';

import React, { useEffect, useState } from 'react';

type MatchedUser = {
    name: string;
    destination: string;
    mobile: string;
    social: string;
};

export default function Results() {
    const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);

    useEffect(() => {
        // Retrieve the matched users from localStorage
        const data = localStorage.getItem('matchedUsers');
        if (data) {
            setMatchedUsers(JSON.parse(data));
        }
    }, []);

    return (
        <div
            style={{
                backgroundColor: '#255799',
                minHeight: '100vh',
                padding: '20px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h1 style={{ color: '#fecc07', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                Matches Found
            </h1>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1000px',
                }}
            >
                {matchedUsers.map((user, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#fff',
                            color: '#255799',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ddd',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: '10px',
                                }}
                            >
                                {/* Placeholder Avatar */}
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {user.name[0]}
                                </span>
                            </div>
                            <h3 style={{ margin: 0 }}>{user.name}</h3>
                        </div>
                        <p>
                            <strong>Destination:</strong> {user.destination}
                        </p>
                        <p>
                            <strong>Mobile:</strong> {user.mobile}
                        </p>
                        <p>
                            <strong>Social:</strong> {user.social}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
