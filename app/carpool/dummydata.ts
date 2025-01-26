type Location = {
    lat: number;
    lng: number;
};

type Luggage = {
    handbag: number;
    cabinBag: number;
    checkInBag: number;
};

export type User = {
    name: string;
    start: Location;
    end: Location;
    luggage: Luggage;
};

export const dummyUsers: User[] = [
    {
        name: "Alice",
        start: { lat: 33.6405, lng: -117.8443 },
        end: { lat: 34.0522, lng: -118.2437 },
        luggage: { handbag: 1, cabinBag: 2, checkInBag: 1 },
    },
    {
        name: "Bob",
        start: { lat: 33.6390, lng: -117.8450 },
        end: { lat: 34.0522, lng: -118.2437 },
        luggage: { handbag: 0, cabinBag: 1, checkInBag: 2 },
    },
];
