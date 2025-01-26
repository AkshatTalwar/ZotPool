"use client";

import { useSearchParams } from "next/navigation";

type Result = {
    name: string;
    origin: string;
    destination: string;
    seat?: string;
    Airlines?: string;
    contact?: string;
    instagram?: string;
};

export default function Results() {
    const searchParams = useSearchParams();
    const data: Result[] = JSON.parse(searchParams.get("data") || "[]");

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}
        >
            <h1
                style={{
                    fontSize: "2rem",
                    color: "#fecc07",
                    marginBottom: "20px",
                }}
            >
                Matches Found
            </h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "30px",
                }}
            >
                {data.length > 0 ? (
                    data.map((result, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#fff",
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 16px rgba(0, 0, 0, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                            }}
                        >
                            <h3
                                style={{
                                    fontWeight: "bold",
                                    color: "#255799",
                                    marginBottom: "10px",
                                }}
                            >
                                {result.name}
                            </h3>
                            <p style={{ color: "#333", marginBottom: "5px" }}>
                                <strong>Origin:</strong> {result.origin || "Not provided"}
                            </p>
                            <p style={{ color: "#333", marginBottom: "5px" }}>
                                <strong>Destination:</strong> {result.destination || "Not provided"}
                            </p>
                            {result.Airlines && (
                                <p style={{ color: "#333", marginBottom: "5px" }}>
                                    <strong>Airlines:</strong> {result.Airlines}
                                </p>
                            )}
                            {result.seat && (
                                <p style={{ color: "#333", marginBottom: "5px" }}>
                                    <strong>Seat:</strong> {result.seat}
                                </p>
                            )}
                            <p style={{ color: "#333", marginBottom: "5px" }}>
                                <strong>Contact:</strong> {result.contact || "+1 (123) 456-7890"}
                            </p>
                            <p style={{ color: "#333" }}>
                                <strong>Instagram:</strong>{" "}
                                <a
                                    href={`https://instagram.com/${result.instagram || "default_handle"}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#255799", textDecoration: "none" }}
                                >
                                    @{result.instagram || "default_handle"}
                                </a>
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#255799", fontSize: "1.2rem" }}>
                        No matches found. Please try again.
                    </p>
                )}
            </div>
        </div>
    );
}

