function renderReservations() {
    const tableBody = document.getElementById('reservationTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    state.reservations.forEach(res => {
        const room = state.rooms.find(r => r.id === res.roomId);
        const tr = document.createElement('tr');
        
        const statusBadge = res.status === 'active' 
            ? '<span class="badge bg-success">Active</span>' 
            : '<span class="badge bg-secondary">Cancelled</span>';

        tr.innerHTML = `
            <td>#${res.id}</td>
            <td>${res.guestName}</td>
            <td>Room ${room ? room.number : 'Unknown'}</td>
            <td>${res.startDate}</td>
            <td>${res.endDate}</td>
            <td>$${res.totalPrice.toFixed(2)}</td>
            <td>${statusBadge}</td>
            <td>
                ${res.status === 'active' 
                    ? `<button class="btn btn-outline-danger btn-sm" onclick="cancelReservation(${res.id})">Cancel</button>` 
                    : '<button class="btn btn-sm btn-light" disabled>Cancelled</button>'}
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function populateRoomSelect() {
    const select = document.getElementById('roomSelect');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Choose a room...</option>';
    
    state.rooms.filter(r => r.status === 'available').forEach(room => {
        const opt = document.createElement('option');
        opt.value = room.id;
        opt.textContent = `Room ${room.number} (${room.type}) - $${room.price}/night`;
        select.appendChild(opt);
    });

    // Check for roomId in URL
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedId = urlParams.get('roomId');
    if (preSelectedId) {
        select.value = preSelectedId;
    }
}

function cancelReservation(resId) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
        const resIndex = state.reservations.findIndex(r => r.id === resId);
        if (resIndex !== -1) {
            const res = state.reservations[resIndex];
            res.status = 'cancelled';
            
            // Free the room
            const room = state.rooms.find(r => r.id === res.roomId);
            if (room) room.status = 'available';
            
            saveData();
            renderReservations();
        }
    }
}

document.getElementById('reservationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const guestName = document.getElementById('guestName').value;
    const roomId = parseInt(document.getElementById('roomSelect').value);
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    // Validate 2025
    const yearIn = new Date(checkIn).getFullYear();
    const yearOut = new Date(checkOut).getFullYear();

    if (yearIn !== 2025 || yearOut !== 2025) {
        alert('Reservations are only allowed for the year 2025.');
        return;
    }

    const days = calculateDays(checkIn, checkOut);
    if (days <= 0) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    const room = state.rooms.find(r => r.id === roomId);
    const totalPrice = days * room.price;

    const newRes = {
        id: Date.now(),
        roomId,
        guestName,
        startDate: checkIn,
        endDate: checkOut,
        totalPrice,
        status: 'active'
    };

    state.reservations.push(newRes);
    room.status = 'reserved';

    saveData();
    
    // Close modal
    const modalElement = document.getElementById('reservationModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Reset form
    e.target.reset();
    
    renderReservations();
    alert(`Reservation created successfully! Total: $${totalPrice.toFixed(2)}`);
});

document.addEventListener('DOMContentLoaded', () => {
    renderReservations();
    populateRoomSelect();
    
    // Auto-open modal if roomId is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('roomId')) {
        const modalElement = document.getElementById('reservationModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
});
