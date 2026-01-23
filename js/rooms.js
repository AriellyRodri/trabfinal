function renderRooms(filter = 'all') {
    const container = document.getElementById('roomList');
    if (!container) return;

    container.innerHTML = '';

    const filteredRooms = state.rooms.filter(room => {
        if (filter === 'all') return true;
        return room.status === filter;
    });

    filteredRooms.forEach(room => {
        const col = document.createElement('div');
        col.className = 'col-md-3';
        
        const statusClass = room.status === 'available' ? 'status-available' : 'status-reserved';
        const statusText = room.status.charAt(0).toUpperCase() + room.status.slice(1);

        col.innerHTML = `
            <div class="card h-100 room-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">Room ${room.number}</h5>
                        <span class="badge ${room.status === 'available' ? 'bg-success' : 'bg-danger'}">${statusText}</span>
                    </div>
                    <p class="text-muted mb-1">${room.type}</p>
                    <p class="fw-bold mb-3">$${room.price} / night</p>
                    <div class="d-grid">
                        ${room.status === 'available' 
                            ? `<a href="reservations.html?roomId=${room.id}" class="btn btn-primary btn-sm">Book Now</a>`
                            : `<button class="btn btn-secondary btn-sm" disabled>Occupied</button>`
                        }
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function filterRooms(type) {
    renderRooms(type);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
});
