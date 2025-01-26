"use client";

import Link from "next/link";

export default function Home() {
    return (
        <div
            style={{
                backgroundColor: '#255799',
                color: '#fecc07',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            {/* Top Right Buttons */}
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <Link href="/login">
                    <button
                        style={{
                            backgroundColor: '#fecc07',
                            color: '#255799',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '10px 15px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        Login
                    </button>
                </Link>
            </div>

            {/* App Name and Tagline */}
            <h1
                style={{
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                }}
            >
                ZotPool
            </h1>
            <p
                style={{
                    fontSize: '2rem',
                    marginTop: '10px',
                    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                }}
            >
                Save Costs, Make Friends, Travel Together!
            </p>

            {/* Get Started Button */}
            <Link href="/choose">
                <button
                    style={{
                        backgroundColor: '#fecc07',
                        color: '#255799',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        marginTop: '20px',
                        cursor: 'pointer',
                    }}
                >
                    Get Started
                </button>
            </Link>
        </div>
    );
}
