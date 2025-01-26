'use client';

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div
            style={{
                backgroundColor: '#255799',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                <SignIn
                    path="/login"
                    routing="path"
                    signUpUrl="/signup"
                    appearance={{
                        elements: {
                            card: {
                                backgroundColor: '#f9f9f9',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                padding: '30px',
                            },
                            formButtonPrimary: {
                                backgroundColor: '#fecc07',
                                color: '#255799',
                                borderRadius: '5px',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
