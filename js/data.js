// Central Data Store
const DATA_KEY = 'hotel_management_2025_data';

// Initial Room Data
const initialRooms = [
    { id: 101, number: '101', type: 'Single', price: 100, status: 'available' },
    { id: 102, number: '102', type: 'Double', price: 150, status: 'available' },
    { id: 103, number: '103', type: 'Suite', price: 250, status: 'available' },
    { id: 201, number: '201', type: 'Single', price: 100, status: 'available' },
    { id: 202, number: '202', type: 'Double', price: 150, status: 'available' },
    { id: 203, number: '203', type: 'Suite', price: 300, status: 'available' },
    { id: 301, number: '301', type: 'Double', price: 180, status: 'available' },
    { id: 302, number: '302', type: 'Suite', price: 350, status: 'available' },
];

let state = {
    rooms: [...initialRooms],
    reservations: []
};

// Load data from localStorage if exists
function loadData() {
    const savedData = localStorage.getItem(DATA_KEY);
    if (savedData) {
        state = JSON.parse(savedData);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(state));
}

// Utility to calculate days between dates
function calculateDays(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = d2 - d1;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Initialize
loadData();
