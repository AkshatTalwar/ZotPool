"use client";

import React, { Suspense } from "react";

import { useSearchParams } from "next/navigation";

type Match = {
    name: string;
    origin: string;
    destination: string;
    Airlines?: string; // Optional field
    seat?: string;     // Optional field
};


export default function Results() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}

function ResultsContent() {
    const searchParams = useSearchParams();
    const data = JSON.parse(searchParams.get("data") || "[]");

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
                color: "#255799",
            }}
        >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#fecc07" }}>
                {data.length > 0 ? "Matches Found" : "No Matches Found"}
            </h1>
            {data.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                    }}
                >
                    {data.map((match: Match, index: number) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#fff",
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <h2 style={{ marginBottom: "10px", color: "#255799" }}>{match.name}</h2>
                            <p>
                                <strong>Origin:</strong> {match.origin}
                            </p>
                            <p>
                                <strong>Destination:</strong> {match.destination}
                            </p>
                            {match.Airlines && (
                                <p>
                                    <strong>Airlines:</strong> {match.Airlines}
                                </p>
                            )}
                            {match.seat && (
                                <p>
                                    <strong>Seat:</strong> {match.seat}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: "1.5rem", color: "#255799" }}>
                    Sorry, no matches found for this category.
                </p>
            )}
        </div>
    );
}
