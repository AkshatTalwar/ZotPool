'use client';

import React, { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

export default function CarpoolForm() {
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

    const autocompleteStartRef = useRef<google.maps.places.Autocomplete | null>(null);
    const autocompleteEndRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places'],
    });

    const router = useRouter();

    const handlePlaceSelect = (field: 'start' | 'end') => {
        const autocomplete = field === 'start' ? autocompleteStartRef.current : autocompleteEndRef.current;
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const address = place?.formatted_address || '';
            setFormData((prev) => ({ ...prev, [field]: address }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Simulate random matched users
        const randomUsers = [
            {
                name: 'Alice',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 123-456-7890',
                social: '@alice123',
            },
            {
                name: 'Bob',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 987-654-3210',
                social: '@bob_99',
            },
            {
                name: 'Charlie',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 555-555-5555',
                social: '@charlie_travels',
            },
            {
                name: 'Diana',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 111-222-3333',
                social: '@diana_91',
            },
            {
                name: 'Eve',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 444-555-6666',
                social: '@eve_loves_travel',
            },
            {
                name: 'Frank',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 777-888-9999',
                social: '@frankie',
            },
            {
                name: 'Grace',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 222-333-4444',
                social: '@grace_notes',
            },
            {
                name: 'Hank',
                destination: 'Los Angeles International Airport (LAX)',
                mobile: '+1 666-777-8888',
                social: '@hank_the_tank',
            },
        ];
    
        // Save the dummy data in localStorage
        localStorage.setItem('matchedUsers', JSON.stringify(randomUsers));
    
        // Navigate to the results page
        router.push('/results');
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
                }}
            >
                <h2 style={{ color: '#255799', textAlign: 'center', marginBottom: '20px' }}>
                    Carpool Details
                </h2>

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

                {/* Submit Button */}
                <button
                    type="submit"
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
                    Submit
                </button>
            </form>
        </div>
    );
}
