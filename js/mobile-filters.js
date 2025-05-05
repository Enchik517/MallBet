document.addEventListener('DOMContentLoaded', function() {
    // Находим элементы фильтров
    const filterSelect = document.querySelector('.filter-select');
    const filterTabs = document.querySelector('.filter-tabs');
    
    // Если элементы найдены, добавляем функциональность
    if (filterSelect && filterTabs) {
        // Удаляем код создания модального окна для выбора опций и оставляем
        // только нативное поведение селекта
        
        // Оставляем только горизонтальную прокрутку для фильтр-табов
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Функция для проверки позиции скролла
        const checkScrollPosition = () => {
            if (filterTabs.scrollLeft > 10) {
                filterTabs.classList.add('scrolled-left');
            } else {
                filterTabs.classList.remove('scrolled-left');
            }
            
            // Проверка, достигнут ли правый край
            const isScrolledToEnd = filterTabs.scrollLeft + filterTabs.clientWidth >= filterTabs.scrollWidth - 10;
            
            if (isScrolledToEnd) {
                filterTabs.classList.add('scrolled-right-end');
            } else {
                filterTabs.classList.remove('scrolled-right-end');
            }
        };
        
        // Вызываем функцию проверки скролла при инициализации
        checkScrollPosition();
        
        // Добавляем событие scroll для отслеживания позиции
        filterTabs.addEventListener('scroll', checkScrollPosition);
        
        filterTabs.addEventListener('mousedown', (e) => {
            isDown = true;
            filterTabs.classList.add('active');
            startX = e.pageX - filterTabs.offsetLeft;
            scrollLeft = filterTabs.scrollLeft;
        });
        
        filterTabs.addEventListener('mouseleave', () => {
            isDown = false;
            filterTabs.classList.remove('active');
        });
        
        filterTabs.addEventListener('mouseup', () => {
            isDown = false;
            filterTabs.classList.remove('active');
        });
        
        filterTabs.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - filterTabs.offsetLeft;
            const walk = (x - startX) * 2; // Скорость прокрутки
            filterTabs.scrollLeft = scrollLeft - walk;
            
            // Проверяем позицию скролла
            checkScrollPosition();
        });
        
        // Поддержка тач-событий для мобильных устройств
        filterTabs.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - filterTabs.offsetLeft;
            scrollLeft = filterTabs.scrollLeft;
        }, { passive: true });
        
        filterTabs.addEventListener('touchend', () => {
            isDown = false;
            
            // Проверяем позицию скролла
            checkScrollPosition();
        }, { passive: true });
        
        filterTabs.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - filterTabs.offsetLeft;
            const walk = (x - startX) * 2;
            filterTabs.scrollLeft = scrollLeft - walk;
            
            // Проверяем позицию скролла
            checkScrollPosition();
        }, { passive: true });
        
        // Добавим автоматическое перемещение активной вкладки в видимую область
        const activateTabVisibility = () => {
            const activeTab = filterTabs.querySelector('.filter-tab.active');
            if (activeTab) {
                // Прокручиваем активную вкладку в видимую область
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };
        
        // Вызываем при загрузке страницы
        setTimeout(activateTabVisibility, 500);
    }
}); 