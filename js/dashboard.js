function updateDashboardCards() {
    const totalReservedDaysElem = document.getElementById('totalReservedDays');
    const monthlyRevenueElem = document.getElementById('monthlyRevenue');
    const yearlyRevenueElem = document.getElementById('yearlyRevenue');

    if (!totalReservedDaysElem) return;

    let totalDays = 0;
    let yearlyTotal = 0;
    let currentMonthTotal = 0;
    const now = new Date();
    const currentMonth = now.getMonth();

    state.reservations.filter(res => res.status === 'active').forEach(res => {
        const days = calculateDays(res.startDate, res.endDate);
        totalDays += days;
        yearlyTotal += res.totalPrice;

        const resDate = new Date(res.startDate);
        if (resDate.getMonth() === currentMonth) {
            currentMonthTotal += res.totalPrice;
        }
    });

    totalReservedDaysElem.textContent = totalDays;
    monthlyRevenueElem.textContent = `$${currentMonthTotal.toFixed(2)}`;
    yearlyRevenueElem.textContent = `$${yearlyTotal.toFixed(2)}`;
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = new Array(12).fill(0);

    state.reservations.filter(res => res.status === 'active').forEach(res => {
        const month = new Date(res.startDate).getMonth();
        monthlyData[month] += res.totalPrice;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Revenue ($)',
                data: monthlyData,
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboardCards();
    initRevenueChart();
});
