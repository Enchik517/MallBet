document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация мобильного меню');
    
    const pageType = document.body.className;
    console.log('Тип страницы:', pageType);
    
    // Получаем элементы
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuLinks = document.querySelector('.mobile-menu-links');
    const mainNav = document.querySelector('.nav');
    const body = document.body;

    console.log('Меню элементы:', {
        toggle: mobileMenuToggle,
        links: mobileMenuLinks,
        nav: mainNav
    });

    // Прямая проверка отображения бургер-меню
    if (mobileMenuToggle) {
        const style = window.getComputedStyle(mobileMenuToggle);
        console.log('Отображение бургер-меню:', style.display);
    }

    // Функция для переключения мобильного меню
    function toggleMobileMenu(e) {
        console.log('Переключение мобильного меню', e);
        
        if (e) e.preventDefault();
        
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.toggle('mobile-menu-toggle--active');
            console.log('Класс toggle активен:', mobileMenuToggle.classList.contains('mobile-menu-toggle--active'));
        }
        
        body.classList.toggle('menu-open');
        
        // Добавляем класс active для основной навигации
        if (mainNav) {
            mainNav.classList.toggle('nav--active');
            console.log('Класс nav активен:', mainNav.classList.contains('nav--active'));
        } else {
            console.warn('Элемент навигации не найден!');
        }
    }

    if (mobileMenuToggle) {
        // Очищаем предыдущие обработчики
        const clone = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(clone, mobileMenuToggle);
        
        // Получаем новую ссылку на элемент
        const newMobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        // При клике на бургер меню
        newMobileMenuToggle.addEventListener('click', function(e) {
            console.log('Клик по бургер-меню');
            e.stopPropagation();
            toggleMobileMenu(e);
        });

        // Обработка клика на мобильных ссылках
        if (mobileMenuLinks) {
            const links = mobileMenuLinks.querySelectorAll('.mobile-menu-link');
            
            // Обработчик для закрытия меню при клике на ссылку
            links.forEach(link => {
                link.addEventListener('click', function() {
                    toggleMobileMenu();
                });
            });
        }

        // Закрытие меню при клике вне
        document.addEventListener('click', function(e) {
            if (newMobileMenuToggle.classList.contains('mobile-menu-toggle--active') &&
                !mobileMenuLinks.contains(e.target) && 
                !newMobileMenuToggle.contains(e.target) &&
                (!mainNav || !mainNav.contains(e.target))) {
                toggleMobileMenu();
            }
        });
        
        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && newMobileMenuToggle.classList.contains('mobile-menu-toggle--active')) {
                toggleMobileMenu();
            }
        });
    } else {
        console.error('Элемент бургер-меню не найден!');
    }
    
    // Проверяем, работает ли бургер-меню через 500мс
    setTimeout(function() {
        if (mobileMenuToggle) {
            console.log('Проверка бургер-меню после задержки');
            const style = window.getComputedStyle(mobileMenuToggle);
            console.log('Отображение бургер-меню после задержки:', style.display);
        }
    }, 500);
}); 