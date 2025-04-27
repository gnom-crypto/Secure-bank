// Инициализация хранилища
if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('transactions')) localStorage.setItem('transactions', JSON.stringify([]));
if (!localStorage.getItem('checks')) localStorage.setItem('checks', JSON.stringify([]));

let currentUser = null;

// Аутентификация
function login() {
    const users = JSON.parse(localStorage.getItem('users'));
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        showDashboard();
    } else {
        alert('Неверные данные!');
    }
}

// Перевод средств
function performTransfer() {
    const receiverAccount = document.getElementById('receiver-account').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    const users = JSON.parse(localStorage.getItem('users'));
    const receiver = users.find(u => u.accountNumber === receiverAccount);
    
    if (!receiver || currentUser.balance < amount) {
        showNotification('Ошибка перевода!', 'error');
        return;
    }
    
    // Обновление балансов
    currentUser.balance -= amount;
    receiver.balance += amount;
    
    // Сохранение транзакции
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions.push({
        from: currentUser.accountNumber,
        to: receiverAccount,
        amount,
        date: new Date().toISOString()
    });
    
    // Обновление данных
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    showNotification('Перевод успешно выполнен!', 'success');
    updateUI();
}

// Оплата чека
function payCheck() {
    const checkNumber = document.getElementById('check-number').value;
    const checks = JSON.parse(localStorage.getItem('checks'));
    const check = checks.find(c => c.number === checkNumber && !c.paid);
    
    if (!check || currentUser.balance < check.amount) {
        showNotification('Чек не найден или недостаточно средств!', 'error');
        return;
    }
    
    // Обновление статуса чека
    check.paid = true;
    currentUser.balance -= check.amount;
    
    // Сохранение данных
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('checks', JSON.stringify(checks));
    
    showNotification('Чек успешно оплачен!', 'success');
    updateUI();
}

// Анимации
function showNotification(text, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => notification.remove(), 3000);
    }, 100);
}

// script.js
// ... предыдущий код ...

function showRegister() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
}

function showLogin() {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
}

function generateAccountNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const balance = parseFloat(document.getElementById('initial-balance').value) || 0;

    if (!username || !password) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.some(u => u.username === username)) {
        showNotification('Пользователь уже существует!', 'error');
        return;
    }

    const newUser = {
        username,
        password,
        balance,
        accountNumber: generateAccountNumber(),
        theme: 'light'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Аккаунт успешно создан!', 'success');
    showLogin();
}

// ... остальной код ...

// Добавьте остальные функции для работы с UI и Local Storage
