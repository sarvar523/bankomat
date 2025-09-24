// Currency data
const currencies = {
    USD: { code: 'USD', name: 'AQSH dollari', rate: 12250 },
    EUR: { code: 'EUR', name: 'Yevro', rate: 13450 },
    RUB: { code: 'RUB', name: 'Rossiya rubli', rate: 135 },
    GBP: { code: 'GBP', name: 'Britaniya funti', rate: 15600 },
    JPY: { code: 'JPY', name: 'Yaponiya iyenasi', rate: 85 },
    CNY: { code: 'CNY', name: 'Xitoy yuani', rate: 1720 },
    UZS: { code: 'UZS', name: 'O\'zbek so\'mi', rate: 1 }
};

// Initialize app
function initApp() {
    populateCurrencySelects();
    updateRatesDisplay();
    initChart();
    checkAuth();
}

// Populate currency selects
function populateCurrencySelects() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    Object.values(currencies).forEach(currency => {
        fromSelect.add(new Option(`${currency.code} - ${currency.name}`, currency.code));
        toSelect.add(new Option(`${currency.code} - ${currency.name}`, currency.code));
    });
    
    toSelect.value = 'UZS';
}

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('uz-UZ').format(num);
}

// Convert currency
function convert() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (!amount || isNaN(amount)) {
        showNotification('Iltimos, summani kiriting!', 'error');
        return;
    }

    const result = (amount * currencies[fromCurrency].rate) / currencies[toCurrency].rate;

    document.getElementById('result').innerHTML = `
        <div class="result-card">
            <h3>${formatNumber(amount)} ${fromCurrency} = ${formatNumber(result)} ${toCurrency}</h3>
            <p>1 ${fromCurrency} = ${formatNumber(currencies[fromCurrency].rate / currencies[toCurrency].rate)} ${toCurrency}</p>
        </div>
    `;

    saveToHistory(amount, fromCurrency, toCurrency, result);
    updateChart();
}

// Swap currencies
function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
}

// Authentication
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
        return;
    }

    // Demo auth
    if (username === 'admin' && password === 'admin123') {
        const user = { id: 1, name: 'Administrator', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface(user);
        closeLoginModal();
        showNotification('Muvaffaqiyatli kirdingiz!', 'success');
    } else {
        showNotification('Login yoki parol noto\'g\'ri!', 'error');
    }
}

// Update UI
function updateUserInterface(user) {
    document.getElementById('userName').textContent = user.name;
    // Show/hide admin elements based on role
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = user.role === 'admin' ? 'block' : 'none';
    });
}

// Charts
function initChart() {
    const ctx = document.getElementById('rateChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Yanvar', 'Fevral', 'Mart', 'April', 'May', 'Iyun'],
            datasets: [{
                label: 'USD/UZS',
                data: [12100, 12150, 12200, 12180, 12220, 12250],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// History
function saveToHistory(amount, from, to, result) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history.unshift({
        date: new Date().toISOString(),
        amount,
        from,
        to,
        result
    });
    localStorage.setItem('conversionHistory', JSON.stringify(history.slice(0, 10)));
}

// Initialize app
window.onload = initApp;