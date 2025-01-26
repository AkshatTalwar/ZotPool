"use client";

import React, { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

type Result = {
    name: string;
    origin: string;
    destination: string;
    seat?: string;
    Airlines?: string;
};

export default function TravelBuddy() {
    const router = useRouter();

    const [selectedOption, setSelectedOption] = useState<string>("");
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        flightNumber: "",
        busNumber: "",
        Airlines: "",
    });

    const [personalityTraits, setPersonalityTraits] = useState({
        ageGroup: "18-25", // Default age group
        extroversion: 50,
        quietness: 50,
        humor: 50,
        flexibility: 50,
    });

    const autocompleteOriginRef = useRef<google.maps.places.Autocomplete | null>(null);
    const autocompleteDestinationRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    const handlePlaceSelect = (field: "origin" | "destination") => {
        const autocomplete =
            field === "origin" ? autocompleteOriginRef.current : autocompleteDestinationRef.current;
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const address = place?.formatted_address || "";
            setFormData({ ...formData, [field]: address });
        }
    };

    const handleSliderChange = (trait: keyof typeof personalityTraits, value: number) => {
        setPersonalityTraits({
            ...personalityTraits,
            [trait]: value,
        });
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value || "", // Ensure no undefined value
        });
    };

    const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPersonalityTraits({
            ...personalityTraits,
            ageGroup: e.target.value,
        });
    };

    const handleSubmit = () => {
        let results: Result[] = [];

        if (selectedOption === "Flights") {
            results = [
                { name: "Alice", origin: formData.origin, destination: formData.destination, seat: "12A", Airlines: formData.Airlines },
                { name: "Bob", origin: formData.origin, destination: formData.destination, seat: "15C", Airlines: formData.Airlines },
                { name: "Charlie", origin: formData.origin, destination: formData.destination, seat: "9B", Airlines: formData.Airlines },
                { name: "Diana", origin: formData.origin, destination: formData.destination, seat: "14D", Airlines: formData.Airlines },
            ];
        } else if (selectedOption === "Trains") {
            results = [
                { name: "Eve", origin: formData.origin, destination: formData.destination, seat: "Window Seat" },
                { name: "Frank", origin: formData.origin, destination: formData.destination, seat: "Aisle Seat" },
            ];
        } else if (selectedOption === "Buses") {
            results = []; // No matches for buses
        }

        router.push(`/travelbuddy-results?data=${encodeURIComponent(JSON.stringify(results))}`);
    };

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                color: "#255799",
                textAlign: "center",
            }}
        >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#fecc07" }}>Travel Buddy</h1>

            {/* Options for Flights, Trains, Buses */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                {["Flights", "Trains", "Buses"].map((option) => (
                    <div
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        style={{
                            backgroundColor: selectedOption === option ? "#fecc07" : "#255799",
                            color: selectedOption === option ? "#255799" : "#fecc07",
                            padding: "20px 40px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        {option}
                    </div>
                ))}
            </div>

            {/* Conditional Form Below */}
            {selectedOption && (
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        maxWidth: "500px",
                        margin: "0 auto",
                        marginBottom: "30px",
                    }}
                >
                    <h2 style={{ marginBottom: "15px", color: "#255799" }}>
                        {selectedOption} Details
                    </h2>

                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>
                            Origin
                        </label>
                        <Autocomplete
                            onLoad={(autocompleteInstance) =>
                                (autocompleteOriginRef.current = autocompleteInstance)
                            }
                            onPlaceChanged={() => handlePlaceSelect("origin")}
                        >
                            <input
                                type="text"
                                placeholder={`Enter ${
                                    selectedOption === "Flights"
                                        ? "Airport"
                                        : selectedOption === "Trains"
                                        ? "Station"
                                        : "Bus Depot"
                                } Origin`}
                                value={formData.origin}
                                onChange={handleFormChange}
                                name="origin"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                        </Autocomplete>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>
                            Destination
                        </label>
                        <Autocomplete
                            onLoad={(autocompleteInstance) =>
                                (autocompleteDestinationRef.current = autocompleteInstance)
                            }
                            onPlaceChanged={() => handlePlaceSelect("destination")}
                        >
                            <input
                                type="text"
                                placeholder={`Enter ${
                                    selectedOption === "Flights"
                                        ? "Airport"
                                        : selectedOption === "Trains"
                                        ? "Station"
                                        : "Bus Depot"
                                } Destination`}
                                value={formData.destination}
                                onChange={handleFormChange}
                                name="destination"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                        </Autocomplete>
                    </div>

                    {/* Additional Inputs for Flight/Bus */}
                    {selectedOption === "Flights" && (
                        <>
                            <input
                                type="text"
                                name="flightNumber"
                                value={formData.flightNumber}
                                onChange={handleFormChange}
                                placeholder="Enter Flight Number"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                            <input
                                type="text"
                                name="Airlines"
                                value={formData.Airlines}
                                onChange={handleFormChange}
                                placeholder="Enter Airlines Name"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                        </>
                    )}
                    {selectedOption === "Buses" && (
                        <input
                            type="text"
                            name="busNumber"
                            value={formData.busNumber}
                            onChange={handleFormChange}
                            placeholder="Enter Bus Number"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    )}
                </div>
            )}

            {/* Personality Traits */}
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    maxWidth: "600px",
                    margin: "0 auto",
                }}
            >
                <h2 style={{ marginBottom: "15px", color: "#255799" }}>
                    Personality Preferences
                </h2>

                {/* Age Group as Dropdown */}
                <div style={{ marginBottom: "20px" }}>
                    <label
                        style={{
                            color: "#255799",
                            marginBottom: "5px",
                            display: "block",
                            fontWeight: "bold",
                        }}
                    >
                        Age Group
                    </label>
                    <select
                        value={personalityTraits.ageGroup}
                        onChange={handleAgeGroupChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                        }}
                    >
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="36-45">36-45</option>
                        <option value="46-60">46-60</option>
                        <option value="60+">60+</option>
                    </select>
                </div>

                {/* Other Personality Traits as Sliders */}
                {[
                    { trait: "extroversion", label: "Extroversion" },
                    { trait: "quietness", label: "Quietness" },
                    { trait: "humor", label: "Humor" },
                    { trait: "flexibility", label: "Flexibility" },
                ].map(({ trait, label }) => (
                    <div key={trait} style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                color: "#255799",
                                marginBottom: "5px",
                                display: "block",
                                fontWeight: "bold",
                            }}
                        >
                            {label}:{" "}
                            {getCategory(personalityTraits[trait as keyof typeof personalityTraits] as number)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={personalityTraits[trait as keyof typeof personalityTraits]}
                            onChange={(e) =>
                                handleSliderChange(
                                    trait as keyof typeof personalityTraits,
                                    parseInt(e.target.value)
                                )
                            }
                            style={{ width: "100%" }}
                        />
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: "20px",
                    backgroundColor: "#fecc07",
                    color: "#255799",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                }}
            >
                Submit
            </button>
        </div>
    );
}

// Helper function to categorize slider values
const getCategory = (value: number): string => {
    if (value < 33) return "Low";
    if (value < 66) return "Medium";
    return "High";
};
