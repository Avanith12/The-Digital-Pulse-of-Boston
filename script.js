document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) throw new Error("Failed to load data");

        const text = await response.text();
        const data = parseCSV(text);

        const cleanData = data.filter(d => !isNaN(d.demand) && d.date);

        calculateMetrics(cleanData);
        processAndRender(cleanData);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function calculateMetrics(data) {
    const values = data.map(d => d.demand);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    document.getElementById('peakDemand').textContent = Math.round(max).toLocaleString();
    document.getElementById('avgDemand').textContent = Math.round(avg).toLocaleString();
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 2) continue;
        const date = new Date(parts[0]);
        const demand = parseFloat(parts[1]);
        data.push({ date, demand });
    }
    return data;
}

function processAndRender(data) {
    const monthlyStats = Array.from({ length: 12 }, () => ({ sum: 0, count: 0 }));
    const weeklyStats = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
    const hourlyStats = Array.from({ length: 24 }, () => ({ sum: 0, count: 0 }));

    data.forEach(d => {
        monthlyStats[d.date.getMonth()].sum += d.demand;
        monthlyStats[d.date.getMonth()].count += 1;
        weeklyStats[d.date.getDay()].sum += d.demand;
        weeklyStats[d.date.getDay()].count += 1;
        hourlyStats[d.date.getHours()].sum += d.demand;
        hourlyStats[d.date.getHours()].count += 1;
    });

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthData = monthlyStats.map(s => s.count > 0 ? s.sum / s.count : 0);
    const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekData = weeklyStats.map(s => s.count > 0 ? s.sum / s.count : 0);
    const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const hourData = hourlyStats.map(s => s.count > 0 ? s.sum / s.count : 0);

    renderMonthlyChart(monthLabels, monthData);
    renderWeeklyChart(weekLabels, weekData);
    renderHourlyChart(hourLabels, hourData);
}

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            titleColor: '#fff',
            bodyColor: '#bbb',
            borderColor: '#333',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: {
                color: '#666',
                font: { family: 'sans-serif', size: 10 }
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                borderDash: [5, 5]
            },
            ticks: {
                color: '#666',
                font: { family: 'sans-serif', size: 10 }
            }
        }
    }
};

function renderMonthlyChart(labels, data) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: '#ffffff',
                borderRadius: 6,
                hoverBackgroundColor: '#888',
                barPercentage: 0.6
            }]
        },
        options: commonOptions
    });
}

function renderWeeklyChart(labels, data) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: data.map((v, i) => (i === 0 || i === 6) ? 'rgba(255,255,255,0.2)' : '#fff'),
                borderRadius: 6,
                hoverBackgroundColor: '#888',
                barPercentage: 0.6
            }]
        },
        options: commonOptions
    });
}

function renderHourlyChart(labels, data) {
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: '#ffffff',
                backgroundColor: grad,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                hoverBorderWidth: 4
            }]
        },
        options: {
            ...commonOptions,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}
