// script.js
// Добавляем функциональность переключения темы
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const body = document.body;

// Проверяем сохраненную тему в localStorage
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
body.className = savedTheme;
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
    
    const currentTheme = body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
    localStorage.setItem('theme', currentTheme);
    
    updateThemeIcon();
});

function updateThemeIcon() {
    if (body.classList.contains('light-theme')) {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// Константы для калькулятора
const PRICES = {
    "Stars": 1.48,
    "TON": 205,
    "USDT": 89
};

const MIN_LIMITS = {
    "Stars": 100,
    "TON": 2,
    "USDT": 6
};

let currentMode = 'to-rub';

// Функция переключения режимов калькулятора
function setupCalcModeToggle() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            modeButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Обновляем текущий режим
            currentMode = this.dataset.mode;
            
            // Обновляем placeholder и очищаем поля
            const amountInput = document.getElementById('amount');
            const resultElement = document.getElementById('calc-result');
            
            if (currentMode === 'to-rub') {
                amountInput.placeholder = 'Количество актива';
                resultElement.textContent = 'Введите количество актива';
            } else {
                amountInput.placeholder = 'Сумма в рублях';
                resultElement.textContent = 'Введите сумму в рублях';
            }
            
            // Очищаем поле ввода
            amountInput.value = '';
            resultElement.style.color = '#6b7280';
        });
    });
}

// Обновленная функция расчета
function calculatePrice() {
    const asset = document.getElementById('asset').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const price = PRICES[asset];
    const minLimit = MIN_LIMITS[asset];
    const resultElement = document.getElementById('calc-result');
    
    if (!amount || amount <= 0) {
        resultElement.innerHTML = '❌ Введите корректное значение';
        resultElement.style.color = '#ef4444';
        return;
    }
    
    if (currentMode === 'to-rub') {
        // Режим: Актив → Рубли
        if (amount < minLimit) {
            resultElement.innerHTML = `❌ Минимальная покупка: ${minLimit} ${asset}`;
            resultElement.style.color = '#ef4444';
            return;
        }
        
        const total = (amount * price).toFixed(2);
        resultElement.innerHTML = `💰 Стоимость: <strong>${total} ₽</strong><br>
                                  <small>Курс: 1 ${asset} = ${price} ₽</small>`;
        resultElement.style.color = '#10b981';
        
    } else {
        // Режим: Рубли → Актив
        const minRub = minLimit * price;
        if (amount < minRub) {
            resultElement.innerHTML = `❌ Минимальная сумма: ${minRub} ₽<br>
                                      <small>(это ${minLimit} ${asset})</small>`;
            resultElement.style.color = '#ef4444';
            return;
        }
        
        const assetAmount = (amount / price).toFixed(2);
        resultElement.innerHTML = `💰 Вы получите: <strong>${assetAmount} ${asset}</strong><br>
                                  <small>Курс: 1 ${asset} = ${price} ₽</small>`;
        resultElement.style.color = '#10b981';
    }
}

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.about-card, .project-card, .promocode-card, .feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Функционал бургер-меню
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Проверяем, существуют ли элементы
    if (!navToggle || !navMenu) {
        console.error('Элементы бургер-меню не найдены!');
        return;
    }
    
    const body = document.body;
    
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            // Закрываем меню
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = ''; // Разблокируем скролл
        } else {
            // Открываем меню
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden'; // Блокируем скролл
        }
    }
    
    // Обработчики событий
    navToggle.addEventListener('click', toggleMenu);
    
    // Закрытие меню при клике на оверлей или ссылку
    overlay.addEventListener('click', toggleMenu);
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Закрытие меню при изменении размера окна (на десктоп)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    console.log('Бургер-меню инициализировано!');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переключателя режимов калькулятора
    setupCalcModeToggle();
    
    // Добавляем обработчик Enter для поля ввода калькулятора
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePrice();
            }
        });
    }
    
    // Добавляем обработчики для всех кнопок расчета
    const calcButtons = document.querySelectorAll('.calc-button');
    calcButtons.forEach(btn => {
        btn.addEventListener('click', calculatePrice);
    });
    
    // Инициализация бургер-меню
    initMobileMenu();
    
    console.log('StarCoin Team website initialized successfully! 🚀');
});

// Добавляем глобальную функцию для расчета (на случай использования из HTML)
window.calculatePrice = calculatePrice;