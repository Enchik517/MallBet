/**
 * Основной JavaScript файл для сайта ставок MalBet
 */

// DOM элементы
const oddButtons = document.querySelectorAll('.odd-button');
const mobileMenuToggle = document.createElement('button');

// Инициализация сайта при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initOddButtons();
    initMobileMenu();
    initStickyHeader();
    initLiveEventUpdates();
    initFilterTabs();
    initBetslip();
    animateElements();
    initMoreMarketsButtons();
    initDecorations();
    
    // Очистка активных ставок при загрузке страницы для предотвращения ошибок
    document.querySelectorAll('.outcome.active').forEach(outcome => {
        outcome.classList.remove('active');
    });
    
    // Сброс купона ставок
    updateBetslip();
    
    // Добавление мобильной кнопки для отображения купона ставок
    if (window.innerWidth <= 767) {
        addMobileBetslipButton();
    }
    
    // Обработчик ошибок для предотвращения NaN в интерфейсе
    window.addEventListener('error', function(e) {
        // Если ошибка связана с NaN, выводим сообщение в консоль и подавляем ее
        if (e.message.includes('NaN')) {
            console.warn('Обнаружена ошибка с NaN: ', e.message);
            e.preventDefault();
        }
    });
    
    // Глобальный обработчик для кнопок удаления ставок
    document.body.addEventListener('click', function(e) {
        const removeButton = e.target.closest('.bet-item-remove');
        if (removeButton) {
            e.preventDefault();
            e.stopPropagation();
            
            const eventId = removeButton.getAttribute('data-event-id');
            const marketId = removeButton.getAttribute('data-market-id');
            const outcomeId = removeButton.getAttribute('data-outcome-id');
            
            console.log('Removing bet:', eventId, marketId, outcomeId);
            
            // Находим и деактивируем соответствующий исход
            const selector = `.outcome[data-event-id="${eventId}"][data-market-id="${marketId}"][data-outcome-id="${outcomeId}"]`;
            const outcome = document.querySelector(selector);
            if (outcome) {
                outcome.classList.remove('active');
            }
            
            // Обновляем купон после удаления ставки
            updateBetslip();
        }
    });
    
    // Инициализируем обработчик изменения суммы ставки
    handleStakeChange();
    
    // Инициализация кликов на коэффициенты
    initOutcomeClicks();
    
    // Запускаем обновление коэффициентов
    startLiveOddsUpdate();
});

function initOddButtons() {
    // Добавляем интерактивность кнопкам коэффициентов
    oddButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Проверка, активна ли кнопка
            const isActive = this.classList.contains('odd-button--active');
            
            // Снимаем активный класс со всех кнопок в этой карточке
            const parentCard = this.closest('.event-card');
            const siblingButtons = parentCard.querySelectorAll('.odd-button');
            siblingButtons.forEach(btn => btn.classList.remove('odd-button--active'));
            
            // Если кнопка не была активна, делаем её активной
            if (!isActive) {
                this.classList.add('odd-button--active');
                addToBetSlip(this);
            } else {
                removeFromBetSlip(this);
            }
        });
    });
}

/**
 * Добавление ставки в купон
 * @param {HTMLElement} button - Кнопка с коэффициентом
 */
function addToBetSlip(button) {
    // Получаем информацию о ставке
    const card = button.closest('.event-card');
    const teams = card.querySelector('.event-card__teams').textContent.trim();
    const sport = card.querySelector('.event-card__sport').textContent;
    const oddType = button.querySelector('.odd-button__type').textContent;
    const oddValue = button.querySelector('.odd-button__value').textContent;
    
    console.log(`Ставка добавлена: ${sport}, ${teams}, ${oddType}, коэффициент: ${oddValue}`);
    
    // Здесь можно добавить логику для создания купона ставок
    // Например, сохранение в localStorage или добавление в DOM
}

/**
 * Удаление ставки из купона
 * @param {HTMLElement} button - Кнопка с коэффициентом
 */
function removeFromBetSlip(button) {
    // Получаем информацию о ставке
    const card = button.closest('.event-card');
    const teams = card.querySelector('.event-card__teams').textContent.trim();
    
    console.log(`Ставка удалена: ${teams}`);
    
    // Здесь можно добавить логику для удаления из купона ставок
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header__wrapper');
    
    // Создаем кнопку для мобильного меню
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = `
        <span class="mobile-menu-toggle__line"></span>
        <span class="mobile-menu-toggle__line"></span>
        <span class="mobile-menu-toggle__line"></span>
    `;
    
    // Добавляем кнопку в DOM только на мобильных устройствах
    if (window.innerWidth <= 768) {
        header.insertBefore(mobileMenuToggle, nav);
        nav.classList.add('nav--mobile');
    }
    
    // Обработчик для переключения мобильного меню
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('nav--active');
        this.classList.toggle('mobile-menu-toggle--active');
    });
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                header.insertBefore(mobileMenuToggle, nav);
                nav.classList.add('nav--mobile');
            }
        } else {
            if (document.querySelector('.mobile-menu-toggle')) {
                mobileMenuToggle.remove();
                nav.classList.remove('nav--mobile');
                nav.classList.remove('nav--active');
            }
        }
    });
}

/**
 * Инициализация липкого хедера
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    const headerOffset = header.offsetTop;
    
    // Обработчик прокрутки страницы
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > headerOffset) {
            header.classList.add('header--sticky');
        } else {
            header.classList.remove('header--sticky');
        }
    });
}

/**
 * Имитация обновления коэффициентов в реальном времени
 */
function initLiveEventUpdates() {
    // Функция для случайного изменения коэффициентов
    function updateOdds() {
        oddButtons.forEach(button => {
            const valueElement = button.querySelector('.odd-button__value');
            const currentValue = parseFloat(valueElement.textContent);
            
            // Генерируем случайное изменение коэффициента от -0.05 до +0.05
            const change = (Math.random() - 0.5) * 0.1;
            const newValue = Math.max(1.01, (currentValue + change).toFixed(2));
            
            // Если значение изменилось, обновляем его с анимацией
            if (newValue !== currentValue) {
                const direction = newValue > currentValue ? 'up' : 'down';
                valueElement.classList.add(`odd-button__value--${direction}`);
                
                // Обновляем значение с задержкой для эффекта
                setTimeout(() => {
                    valueElement.textContent = newValue;
                    setTimeout(() => {
                        valueElement.classList.remove(`odd-button__value--${direction}`);
                    }, 500);
                }, 200);
            }
        });
    }
    
    // Обновляем коэффициенты каждые 10 секунд
    setInterval(updateOdds, 10000);
}

/**
 * Валидация формы входа/регистрации
 * @param {HTMLFormElement} form - Форма для валидации
 * @returns {boolean} - Результат валидации
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            input.classList.add('input--error');
            
            // Добавляем сообщение об ошибке
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('input-error')) {
                const errorMessage = document.createElement('span');
                errorMessage.className = 'input-error';
                errorMessage.textContent = 'Это поле обязательно для заполнения';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('input--error');
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('input-error')) {
                input.nextElementSibling.remove();
            }
        }
    });
    
    return isValid;
}

// Эффект для кнопок при наведении
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * Инициализация вкладок в фильтре событий
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Удаляем активный класс со всех вкладок
                filterTabs.forEach(t => t.classList.remove('active'));
                
                // Добавляем активный класс текущей вкладке
                this.classList.add('active');
                
                // Получаем значение фильтра
                const filterValue = this.getAttribute('data-filter');
                
                // Здесь можно добавить логику фильтрации событий
                console.log(`Фильтр: ${filterValue}`);
                
                // Имитация обновления списка событий
                const eventsContainer = document.getElementById('events-container');
                if (eventsContainer) {
                    // Показываем индикатор загрузки
                    eventsContainer.innerHTML = `
                        <div class="loading-indicator">
                            <div class="spinner"></div>
                            <p>Загрузка событий...</p>
                        </div>
                    `;
                    
                    // Имитируем задержку загрузки (в реальном проекте здесь будет AJAX-запрос)
                    setTimeout(() => {
                        // В реальном проекте здесь будет обработка ответа от сервера
                        // и отображение отфильтрованных событий
                    }, 500);
                }
            });
        });
    }
}

/**
 * Инициализация купона ставок
 */
function initBetslip() {
    // Add event listener to stake input
    const stakeInput = document.querySelector('.stake-input');
    if (stakeInput) {
        stakeInput.addEventListener('input', function() {
            const stake = parseFloat(this.value);
            const totalOddsElement = document.querySelector('.total-odds');
            const potentialWinElement = document.querySelector('.potential-win-amount');
            
            if (totalOddsElement && potentialWinElement) {
                const totalOdds = parseFloat(totalOddsElement.textContent);
                
                if (!isNaN(stake) && !isNaN(totalOdds) && stake > 0 && totalOdds > 0) {
                    const potentialWin = stake * totalOdds;
                    potentialWinElement.textContent = `${potentialWin.toFixed(2)} BYN`;
                } else {
                    potentialWinElement.textContent = '0 BYN';
                }
            }
            
            // Enable or disable place bet button based on stake value
            const placeBetButton = document.querySelector('.place-bet-btn');
            const activeOutcomes = document.querySelectorAll('.outcome.active');
            
            if (placeBetButton) {
                placeBetButton.disabled = activeOutcomes.length === 0 || isNaN(stake) || stake <= 0;
            }
        });
    }
    
    // Add event listener to place bet button
    const placeBetButton = document.querySelector('.place-bet-btn');
    if (placeBetButton) {
        placeBetButton.addEventListener('click', placeBet);
    }
    
    // Add event listener to clear button
    const clearButton = document.querySelector('.btn-clear');
    if (clearButton) {
        clearButton.addEventListener('click', clearBetslip);
    }
    
    // Initialize betslip
    updateBetslip();
}

/**
 * Обновление потенциального выигрыша
 */
function updatePotentialWin(stake, coefficient) {
    const winAmount = document.querySelector('.potential-win-amount, .win-amount');
    
    if (winAmount) {
        // Проверяем, являются ли значения корректными числами
        const stakeValue = parseFloat(stake);
        const coeffValue = parseFloat(coefficient);
        
        if (!isNaN(stakeValue) && !isNaN(coeffValue) && stakeValue > 0 && coeffValue > 0) {
            const potentialWin = stakeValue * coeffValue;
            winAmount.textContent = `${potentialWin.toFixed(2)} BYN`;
        } else {
            winAmount.textContent = `0 BYN`;
        }
    }
}

/**
 * Обновление купона ставок
 */
function updateBetslip() {
    const betslipContent = document.querySelector('.betslip-content');
    const activeOutcomes = document.querySelectorAll('.outcome.active');
    const emptyBetslipTemplate = `
        <div class="betslip-empty">
            <p>Ваш купон ставок пуст</p>
            <p>Выберите коэффициенты, чтобы сделать ставку</p>
        </div>
    `;
    
    // Enable or disable the place bet button
    const placeBetButton = document.querySelector('.place-bet-btn');
    
    // Clear previous content
    if (betslipContent) {
        if (activeOutcomes.length === 0) {
            betslipContent.innerHTML = emptyBetslipTemplate;
            
            // Reset total odds and potential win
            const totalOddsElement = document.querySelector('.total-odds');
            const totalPotentialWinElement = document.querySelector('.potential-win-amount');
            if (totalOddsElement) totalOddsElement.textContent = '0.00';
            if (totalPotentialWinElement) totalPotentialWinElement.textContent = '0 BYN';
            
            // Disable the place bet button
            if (placeBetButton) {
                placeBetButton.disabled = true;
            }
            
            // Update mobile counter
            const mobileCounter = document.querySelector('.mobile-betslip-button .count');
            if (mobileCounter) {
                mobileCounter.textContent = '0';
            }
            
            return;
        }

        // Generate betslip items
        let betslipItemsHTML = '';
        let totalOdds = 1;

        activeOutcomes.forEach(outcome => {
            // Получаем элементы события
            const eventCard = outcome.closest('.event-card');
            
            // Получаем названия команд
            let teamsText = "Событие";
            if (eventCard) {
                const homeTeam = eventCard.querySelector('.team.home .team-name');
                const awayTeam = eventCard.querySelector('.team.away .team-name');
                
                if (homeTeam && awayTeam) {
                    teamsText = `${homeTeam.textContent} - ${awayTeam.textContent}`;
                }
            }
            
            // Получаем название маркета
            const marketName = outcome.closest('.odds-container').querySelector('.market-name').textContent || 'Ставка';
            
            // Получаем имя и значение исхода
            const outcomeName = outcome.querySelector('.outcome-name').textContent;
            const oddsValue = parseFloat(outcome.querySelector('.outcome-value').textContent);
            
            if (!isNaN(oddsValue) && oddsValue > 0) {
                totalOdds *= oddsValue;
                
                betslipItemsHTML += `
                    <div class="bet-item" data-outcome-id="${outcome.getAttribute('data-outcome-id')}" data-event-id="${outcome.getAttribute('data-event-id')}">
                        <div class="bet-item-header">
                            <div class="bet-item-teams">${teamsText}</div>
                            <button class="bet-item-remove" data-outcome-id="${outcome.getAttribute('data-outcome-id')}">×</button>
                        </div>
                        <div class="bet-item-info">
                            <div class="bet-item-market">${marketName}: ${outcomeName}</div>
                            <div class="bet-item-odds">${oddsValue.toFixed(2)}</div>
                        </div>
                    </div>
                `;
            }
        });

        betslipContent.innerHTML = betslipItemsHTML;
        
        // Update total odds
        const totalOddsElement = document.querySelector('.total-odds');
        if (totalOddsElement) {
            totalOddsElement.textContent = totalOdds.toFixed(2);
        }
        
        // Update potential win based on stake
        const stakeInput = document.querySelector('.stake-input');
        const potentialWinElement = document.querySelector('.potential-win-amount');
        
        if (stakeInput && potentialWinElement && totalOdds) {
            const stake = parseFloat(stakeInput.value);
            if (!isNaN(stake) && stake > 0) {
                const potentialWin = stake * totalOdds;
                potentialWinElement.textContent = `${potentialWin.toFixed(2)} BYN`;
            } else {
                potentialWinElement.textContent = '0 BYN';
            }
        }
        
        // Enable the place bet button
        if (placeBetButton) {
            const stakeInput = document.querySelector('.stake-input');
            const stake = parseFloat(stakeInput?.value || 0);
            placeBetButton.disabled = activeOutcomes.length === 0 || isNaN(stake) || stake <= 0;
        }
        
        // Update mobile counter
        const mobileCounter = document.querySelector('.mobile-betslip-button .count');
        if (mobileCounter) {
            mobileCounter.textContent = activeOutcomes.length;
        }
        
        // Add delete event listeners
        const deleteButtons = document.querySelectorAll('.bet-item-remove');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const outcomeId = this.getAttribute('data-outcome-id');
                const eventId = this.closest('.bet-item').getAttribute('data-event-id');
                
                // Находим соответствующий элемент исхода и удаляем активный класс
                const outcomeSelector = `.outcome[data-outcome-id="${outcomeId}"]`;
                const activeOutcome = document.querySelector(outcomeSelector);
                
                if (activeOutcome) {
                    // Remove active class
                    activeOutcome.classList.remove('active');
                    
                    // Show notification
                    const outcomeName = activeOutcome.querySelector('.outcome-name').textContent;
                    showNotification(`Ставка удалена: ${outcomeName}`);
                }
                
                // Update betslip
                updateBetslip();
            });
        });
    }
}

/**
 * Очистка купона ставок
 */
function clearBetslip() {
    // Снимаем выделение со всех активных исходов
    document.querySelectorAll('.outcome.active').forEach(outcome => {
        outcome.classList.remove('active');
    });
    
    // Сбрасываем сумму ставки
    const stakeInput = document.querySelector('.stake-input');
    if (stakeInput) {
        stakeInput.value = '';
    }
    
    // Обновляем купон
    updateBetslip();
    
    // Показываем уведомление
    showNotification('Купон очищен');
}

/**
 * Добавление мобильной кнопки для отображения купона ставок
 */
function addMobileBetslipButton() {
    // Проверяем, нет ли уже кнопки
    if (document.querySelector('.mobile-betslip-button')) {
        return;
    }
    
    // Создаем кнопку
    const button = document.createElement('div');
    button.className = 'mobile-betslip-button';
    button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
            <path d="M7 12H17V14H7V12Z" fill="white"/>
            <path d="M7 7H17V9H7V7Z" fill="white"/>
            <path d="M7 17H14V19H7V17Z" fill="white"/>
        </svg>
        <div class="count">0</div>
    `;
    
    // Добавляем в DOM
    document.body.appendChild(button);
    
    // Добавляем обработчик
    button.addEventListener('click', function() {
        const betslipSidebar = document.querySelector('.betslip-sidebar');
        if (betslipSidebar) {
            betslipSidebar.classList.toggle('active');
        }
    });
    
    // Обновление счетчика ставок
    updateMobileBetslipCount();
}

/**
 * Обновление количества ставок в мобильной кнопке
 */
function updateMobileBetslipCount(count) {
    const countEl = document.querySelector('.mobile-betslip-button .count');
    if (countEl) {
        countEl.textContent = count || 0;
        
        // Показываем или скрываем счетчик
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Отображение уведомления
 * @param {string} message - Текст уведомления
 */
function showNotification(message) {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Удаляем через некоторое время
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Анимация элементов при загрузке страницы
 */
function animateElements() {
    // Анимация карточек событий
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        eventCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }
    
    // Анимация промо-слайдера
    const promoSlider = document.querySelector('.promo-slider');
    if (promoSlider) {
        promoSlider.classList.add('slide-in-up');
    }
}

/**
 * Имитация обновления коэффициентов в реальном времени
 */
function startLiveOddsUpdate() {
    setInterval(() => {
        const outcomeValues = document.querySelectorAll('.outcome-value');
        
        // Обновляем случайные коэффициенты
        outcomeValues.forEach(value => {
            // С вероятностью 10% меняем коэффициент
            if (Math.random() < 0.1) {
                const oldValue = parseFloat(value.textContent);
                const changePercentage = (Math.random() * 0.06) - 0.03; // от -3% до +3%
                const newValue = oldValue * (1 + changePercentage);
                
                // Подсвечиваем изменение
                value.classList.remove('up', 'down');
                
                if (newValue > oldValue) {
                    value.classList.add('up');
                } else {
                    value.classList.add('down');
                }
                
                // Обновляем значение
                value.textContent = newValue.toFixed(2);
                
                // Убираем подсветку через некоторое время
                setTimeout(() => {
                    value.classList.remove('up', 'down');
                }, 2000);
            }
        });
    }, 5000); // Каждые 5 секунд
}

/**
 * Инициализация дополнительных маркетов (фейковых ставок)
 */
function initMoreMarketsButtons() {
    // Находим все кнопки "Еще маркетов"
    const moreMarketsButtons = document.querySelectorAll('.more-markets-btn');
    
    moreMarketsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            const eventCard = this.closest('.event-card');
            
            // Проверяем, есть ли уже развернутые маркеты
            const existingMarkets = eventCard.querySelector('.additional-markets');
            
            if (existingMarkets) {
                // Если маркеты уже показаны, скрываем их
                existingMarkets.remove();
                this.textContent = this.textContent.replace('Скрыть', 'Еще') + ' маркетов';
            } else {
                // Если маркетов нет, добавляем их
                const additionalMarkets = createAdditionalMarkets(eventId);
                eventCard.insertBefore(additionalMarkets, this);
                this.textContent = 'Скрыть маркеты';
            }
        });
    });
}

/**
 * Создание дополнительных маркетов (фейковых ставок)
 * @param {string} eventId - ID события
 * @returns {HTMLElement} - HTML элемент с дополнительными маркетами
 */
function createAdditionalMarkets(eventId) {
    const markets = document.createElement('div');
    markets.className = 'additional-markets';
    
    // Список дополнительных маркетов
    const marketsData = [
        {
            id: 'total',
            name: 'Тотал',
            outcomes: [
                { id: 'over', name: 'Больше 2.5', odds: '1.85' },
                { id: 'under', name: 'Меньше 2.5', odds: '1.95' }
            ]
        },
        {
            id: 'btts',
            name: 'Обе забьют',
            outcomes: [
                { id: 'yes', name: 'Да', odds: '1.65' },
                { id: 'no', name: 'Нет', odds: '2.15' }
            ]
        },
        {
            id: 'handicap',
            name: 'Фора',
            outcomes: [
                { id: 'home_m1', name: 'Ф1 (-1.5)', odds: '3.40' },
                { id: 'draw_m1', name: 'Ф1 (0)', odds: '1.50' },
                { id: 'away_p1', name: 'Ф2 (+1.5)', odds: '1.30' }
            ]
        },
        {
            id: 'halftime',
            name: 'Первый тайм / Матч',
            outcomes: [
                { id: '1_1', name: '1/1', odds: '2.70' },
                { id: '1_X', name: '1/X', odds: '15.00' },
                { id: '1_2', name: '1/2', odds: '34.00' },
                { id: 'X_1', name: 'X/1', odds: '5.80' },
                { id: 'X_X', name: 'X/X', odds: '5.20' },
                { id: 'X_2', name: 'X/2', odds: '7.50' },
                { id: '2_1', name: '2/1', odds: '29.00' },
                { id: '2_X', name: '2/X', odds: '13.00' },
                { id: '2_2', name: '2/2', odds: '4.50' }
            ],
            isGrid: true
        }
    ];
    
    // Создаем HTML для каждого маркета
    marketsData.forEach(market => {
        const marketElement = document.createElement('div');
        marketElement.className = 'odds-container';
        
        const marketName = document.createElement('div');
        marketName.className = 'market-name';
        marketName.textContent = market.name;
        marketElement.appendChild(marketName);
        
        const outcomeContainer = document.createElement('div');
        
        // Применяем специальный класс для рынка "Первый тайм / Матч"
        if (market.isGrid) {
            outcomeContainer.className = 'outcome-container halftime-grid';
        } else {
            outcomeContainer.className = 'outcome-container';
        }
        
        market.outcomes.forEach(outcome => {
            const outcomeElement = document.createElement('div');
            outcomeElement.className = 'outcome';
            outcomeElement.setAttribute('data-outcome-id', outcome.id);
            outcomeElement.setAttribute('data-event-id', eventId);
            outcomeElement.setAttribute('data-market-id', market.id);
            
            // Обработчик для добавления в купон
            outcomeElement.addEventListener('click', function() {
                // Найти все исходы в том же контейнере и убрать active
                const siblingOutcomes = outcomeContainer.querySelectorAll('.outcome');
                siblingOutcomes.forEach(sib => {
                    if (sib !== this) {
                        sib.classList.remove('active');
                    }
                });
                
                // Toggle active class
                this.classList.toggle('active');
                
                // Отображаем уведомление
                const outcomeName = this.querySelector('.outcome-name').textContent;
                const oddsValue = this.querySelector('.outcome-value').textContent;
                
                if (this.classList.contains('active')) {
                    showNotification(`Ставка добавлена: ${outcomeName} (${oddsValue})`);
                } else {
                    showNotification(`Ставка удалена: ${outcomeName}`);
                }
                
                // Обновляем купон
                updateBetslip();
            });
            
            const outcomeName = document.createElement('span');
            outcomeName.className = 'outcome-name';
            outcomeName.textContent = outcome.name;
            outcomeElement.appendChild(outcomeName);
            
            const outcomeValue = document.createElement('span');
            outcomeValue.className = 'outcome-value';
            outcomeValue.textContent = outcome.odds;
            outcomeElement.appendChild(outcomeValue);
            
            outcomeContainer.appendChild(outcomeElement);
        });
        
        marketElement.appendChild(outcomeContainer);
        markets.appendChild(marketElement);
    });
    
    return markets;
}

/**
 * Разместить ставку
 */
function placeBet() {
    // Get betslip content
    const betslipContent = document.querySelector('.betslip-content');
    
    // Display success message
    if (betslipContent) {
        betslipContent.innerHTML = `
            <div class="betslip-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#4CAF50"/>
                </svg>
                Ставка успешно размещена
            </div>
        `;
        
        // Reset total odds and potential win
        const totalOddsElement = document.querySelector('.total-odds');
        const totalPotentialWinElement = document.querySelector('.potential-win-amount');
        if (totalOddsElement) totalOddsElement.textContent = '0.00';
        if (totalPotentialWinElement) totalPotentialWinElement.textContent = '0 BYN';
        
        // Reset stake input
        const stakeInput = document.querySelector('.stake-input');
        if (stakeInput) stakeInput.value = '';
        
        // Remove active class from all outcomes
        const activeOutcomes = document.querySelectorAll('.outcome.active');
        activeOutcomes.forEach(outcome => {
            outcome.classList.remove('active');
        });
        
        // Disable bet button
        const placeBetButton = document.querySelector('.place-bet-btn');
        if (placeBetButton) {
            placeBetButton.disabled = true;
        }
        
        // Show notification
        showNotification('Ставка успешно размещена!');
        
        // Update mobile counter
        const mobileCounter = document.querySelector('.mobile-betslip-button .count');
        if (mobileCounter) {
            mobileCounter.textContent = '0';
        }
        
        // Restore empty betslip after delay
        setTimeout(() => {
            updateBetslip();
        }, 3000);
    }
}

/**
 * Инициализирует анимацию декоративных элементов на странице
 */
function initDecorations() {
  const decorations = document.querySelectorAll('.decoration-circle');
  if (!decorations.length) return;
  
  // Добавим случайное начальное смещение для каждого круга
  decorations.forEach(decoration => {
    const randomDelay = Math.random() * 5;
    decoration.style.animationDelay = `${randomDelay}s`;
    
    // Добавим немного интерактивности при движении мыши
    document.addEventListener('mousemove', e => {
      const { clientX, clientY } = e;
      const moveX = clientX / window.innerWidth * 20 - 10;
      const moveY = clientY / window.innerHeight * 20 - 10;
      
      // Применим разное смещение для каждого круга
      if (decoration.classList.contains('decoration-circle-1')) {
        decoration.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
      } else if (decoration.classList.contains('decoration-circle-2')) {
        decoration.style.transform = `translate(${-moveX * 0.3}px, ${-moveY * 0.3}px)`;
      } else if (decoration.classList.contains('decoration-circle-3')) {
        decoration.style.transform = `translate(${moveX * 0.2}px, ${moveY * 0.2}px)`;
      }
    });
  });
}

/**
 * Обработчик изменения суммы ставки
 */
function handleStakeChange() {
    const stakeInput = document.querySelector('input[type="number"]');
    
    if (stakeInput) {
        stakeInput.addEventListener('input', function() {
            // Обновляем купон при изменении суммы ставки
            updateBetslip();
        });
    }
}

/**
 * Инициализация обработчиков кликов на коэффициенты
 */
function initOutcomeClicks() {
    // Находим все элементы с коэффициентами
    const outcomes = document.querySelectorAll('.outcome');
    
    // Добавляем обработчик клика для каждого коэффициента
    outcomes.forEach(outcome => {
        outcome.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            const marketId = this.getAttribute('data-market-id');
            const outcomeId = this.getAttribute('data-outcome-id');
            const outcomeName = this.querySelector('.outcome-name').textContent;
            const oddsValue = this.querySelector('.outcome-value').textContent;
            
            // Найти все исходы в том же контейнере и убрать active
            const parentContainer = this.closest('.outcome-container');
            if (parentContainer) {
                const siblingOutcomes = parentContainer.querySelectorAll('.outcome');
                siblingOutcomes.forEach(sib => {
                    if (sib !== this) {
                        sib.classList.remove('active');
                    }
                });
            }
            
            // Проверяем, был ли уже выбран текущий исход
            const wasActive = this.classList.contains('active');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Отображаем уведомление
            if (this.classList.contains('active')) {
                showNotification(`Ставка добавлена: ${outcomeName} (${oddsValue})`);
            } else {
                showNotification(`Ставка удалена: ${outcomeName}`);
            }
            
            // Обновляем купон ставок
            updateBetslip();
        });
    });
} 