"use client";

import Link from "next/link";

export default function ChoosePage() {
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
            <h2
                style={{
                    fontSize: '2.5rem',
                    color: '#fecc07',
                    marginBottom: '30px',
                }}
            >
                Choose Your Option
            </h2>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '30px',
                }}
            >
                <Link href="/carpool">
                    <div
                        style={{
                            backgroundColor: '#fecc07',
                            color: '#255799',
                            width: '250px',
                            height: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, background-color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffd700';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecc07';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Carpool
                    </div>
                </Link>
                <Link href="/travelbuddy">
                    <div
                        style={{
                            backgroundColor: '#fecc07',
                            color: '#255799',
                            width: '250px',
                            height: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, background-color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffd700';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecc07';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Travel Buddy
                    </div>
                </Link>
            </div>
            <Link href="/">
                <button
                    style={{
                        marginTop: '40px',
                        backgroundColor: 'transparent',
                        color: '#fecc07',
                        border: '1px solid #fecc07',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                    }}
                >
                    Close
                </button>
            </Link>
        </div>
    );
}
