'use client';

import React, { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

type Coordinates = { lat: number; lng: number };

type MatchingResponse = {
    matches: unknown[];
    aiExplanation?: string | null;
};

function saveMatchingResult(result: MatchingResponse) {
    localStorage.setItem('matchedRides', JSON.stringify(result.matches));
    if (result.aiExplanation) {
        localStorage.setItem('matchExplanation', result.aiExplanation);
    } else {
        localStorage.removeItem('matchExplanation');
    }
}

export default function CarpoolForm() {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return googleMapsApiKey
        ? <GoogleMapsCarpoolForm googleMapsApiKey={googleMapsApiKey} />
        : <DemoCarpoolForm />;
}

function DemoCarpoolForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const runDemo = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    startLabel: 'UC Irvine',
                    endLabel: 'Los Angeles International Airport',
                    start: { lat: 33.6405, lng: -117.8443 },
                    end: { lat: 33.9416, lng: -118.4085 },
                    departureTime: new Date(Date.now() + 3_600_000).toISOString(),
                    preferences: {
                        maxDetourMiles: 5,
                        partySize: 1,
                        luggageCount: 1,
                    },
                }),
            });

            if (!response.ok) throw new Error('Matching service rejected the demo request.');
            saveMatchingResult(await response.json() as MatchingResponse);
            router.push('/results');
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Unable to run the demo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#255799',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
            }}
        >
            <section
                style={{
                    backgroundColor: '#ffffff',
                    color: '#1f3f6d',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.22)',
                    width: '100%',
                    maxWidth: '480px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <h1 style={{ marginTop: 0 }}>ZotPool demo route</h1>
                <p>
                    Google Maps is not configured locally, so you can test the complete
                    matching flow with a prepared UC Irvine to LAX request.
                </p>
                <p><strong>1 rider · 1 bag · departure in 1 hour</strong></p>
                {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
                <button
                    type="button"
                    onClick={runDemo}
                    disabled={isSubmitting}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#fecc07',
                        color: '#255799',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    {isSubmitting ? 'Finding matches...' : 'Run demo match'}
                </button>
            </section>
        </div>
    );
}

function GoogleMapsCarpoolForm({ googleMapsApiKey }: { googleMapsApiKey: string }) {
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        date: '',
        time: '',
        people: '',
        handbag: '',
        cabinBag: '',
        checkInBag: '',
    });
    const [coordinates, setCoordinates] = useState<{
        start: Coordinates | null;
        end: Coordinates | null;
    }>({ start: null, end: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const autocompleteStartRef = useRef<google.maps.places.Autocomplete | null>(null);
    const autocompleteEndRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey,
        libraries: ['places'],
    });

    const router = useRouter();

    const handlePlaceSelect = (field: 'start' | 'end') => {
        const autocomplete = field === 'start' ? autocompleteStartRef.current : autocompleteEndRef.current;
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const address = place?.formatted_address || '';
            const location = place.geometry?.location;
            setFormData((prev) => ({ ...prev, [field]: address }));
            if (location) {
                setCoordinates((prev) => ({
                    ...prev,
                    [field]: { lat: location.lat(), lng: location.lng() },
                }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coordinates.start || !coordinates.end) {
            setError('Select both locations from the Google Maps suggestions.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const luggageCount = Number(formData.handbag || 0)
                + Number(formData.cabinBag || 0)
                + Number(formData.checkInBag || 0);
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    startLabel: formData.start,
                    endLabel: formData.end,
                    start: coordinates.start,
                    end: coordinates.end,
                    departureTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
                    preferences: {
                        maxDetourMiles: 5,
                        partySize: Number(formData.people),
                        luggageCount,
                    },
                }),
            });

            if (!response.ok) throw new Error('Matching service rejected the request.');
            const result = await response.json() as MatchingResponse;
            saveMatchingResult(result);
            router.push('/results');
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : 'Unable to find rides.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isLoaded) return <div>Loading Google Maps...</div>;

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
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    width: '400px',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <h2 style={{ color: '#255799', textAlign: 'center', marginBottom: '20px' }}>
                    Carpool Details
                </h2>
                <p style={{ color: '#4b5563', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Matches are ranked by route proximity, departure time, seats, and luggage capacity.
                </p>

                {/* Start Location */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="start" style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>
                        Start Location
                    </label>
                    <Autocomplete
                        onLoad={(autocompleteInstance) => (autocompleteStartRef.current = autocompleteInstance)}
                        onPlaceChanged={() => handlePlaceSelect('start')}
                    >
                        <input
                            type="text"
                            id="start"
                            name="start"
                            value={formData.start}
                            onChange={handleChange}
                            placeholder="Enter start location"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                color: '#000',
                            }}
                            required
                        />
                    </Autocomplete>
                </div>

                {/* End Location */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="end" style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>
                        End Location
                    </label>
                    <Autocomplete
                        onLoad={(autocompleteInstance) => (autocompleteEndRef.current = autocompleteInstance)}
                        onPlaceChanged={() => handlePlaceSelect('end')}
                    >
                        <input
                            type="text"
                            id="end"
                            name="end"
                            value={formData.end}
                            onChange={handleChange}
                            placeholder="Enter end location"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                color: '#000',
                            }}
                            required
                        />
                    </Autocomplete>
                </div>

                {/* Date */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="date" style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            color: '#000',
                        }}
                        required
                    />
                </div>

                {/* Time */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="time" style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>
                        Time
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            color: '#000',
                        }}
                        required
                    />
                </div>

                {/* Number of People */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="people" style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>
                        Number of People
                    </label>
                    <input
                        type="number"
                        id="people"
                        name="people"
                        value={formData.people}
                        onChange={handleChange}
                        placeholder="Enter number of people"
                        min="1"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            color: '#000',
                        }}
                        required
                    />
                </div>

                {/* Luggage Details */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>Luggage Details</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        {/* Handbag */}
                        <div style={{ textAlign: 'center' }}>
                            <label style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>Handbag</label>
                            <input
                                type="number"
                                name="handbag"
                                value={formData.handbag}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    color: '#000',
                                }}
                            />
                        </div>
                        {/* Cabin Bag */}
                        <div style={{ textAlign: 'center' }}>
                            <label style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>Cabin Bag</label>
                            <input
                                type="number"
                                name="cabinBag"
                                value={formData.cabinBag}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    color: '#000',
                                }}
                            />
                        </div>
                        {/* Check-In Bag */}
                        <div style={{ textAlign: 'center' }}>
                            <label style={{ display: 'block', color: '#255799', marginBottom: '5px' }}>Check-In Bag</label>
                            <input
                                type="number"
                                name="checkInBag"
                                value={formData.checkInBag}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    color: '#000',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p role="alert" style={{ color: '#b91c1c', marginBottom: '12px' }}>
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#fecc07',
                        color: '#255799',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    {isSubmitting ? 'Finding compatible rides…' : 'Find matches'}
                </button>
            </form>
        </div>
    );
}
