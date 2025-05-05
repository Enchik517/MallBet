/**
 * XML Parser for MalBet
 * Handles loading and processing events data
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load XML data
    loadXMLData();
});

/**
 * Load XML data from the server
 */
function loadXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                // Parse XML and process events
                const xmlDoc = this.responseXML;
                if (xmlDoc) {
                    processEvents(xmlDoc);
                } else {
                    displayError("Ошибка загрузки данных. Пожалуйста, попробуйте позже.");
                }
            } else {
                displayError("Не удалось загрузить данные. Код ошибки: " + this.status);
            }
        }
    };
    
    xhr.open("GET", "data/events.xml", true);
    xhr.send();
}

/**
 * Process XML events data
 * @param {XMLDocument} xmlDoc - The XML document containing events data
 */
function processEvents(xmlDoc) {
    try {
        // Fix potential issues with name tags
        fixNameTags(xmlDoc);
        
        // Get all sports events
        const events = xmlDoc.querySelectorAll('event');
        
        if (events.length > 0) {
            displayEvents(events);
        } else {
            displayError("Нет доступных событий для отображения.");
        }
    } catch (error) {
        console.error("Ошибка при обработке данных:", error);
        displayError("Произошла ошибка при обработке данных. Пожалуйста, попробуйте позже.");
    }
}

/**
 * Fix name tags in XML document
 * Some XML elements might use <n> tag instead of <name>
 * @param {XMLDocument} xmlDoc - The XML document to fix
 */
function fixNameTags(xmlDoc) {
    // Handle both <n> and <name> tags for compatibility
    const nTags = xmlDoc.querySelectorAll('n');
    
    // Convert <n> tags to <name> for consistency if needed
    nTags.forEach(tag => {
        // Create a new name element
        const nameElement = xmlDoc.createElement('name');
        nameElement.textContent = tag.textContent;
        
        // Replace <n> with <name>
        tag.parentNode.replaceChild(nameElement, tag);
    });
}

/**
 * Display events on the page
 * @param {NodeList} events - List of event elements from XML
 */
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    
    if (!eventsContainer) {
        console.error("События не могут быть отображены: контейнер не найден");
        return;
    }
    
    // Clear loading indicator
    eventsContainer.innerHTML = '';
    
    // Get current currency
    const currencySelect = document.getElementById('currency-select');
    const currentCurrency = currencySelect ? currencySelect.value : 'BYN';
    
    // Process each event
    events.forEach(event => {
        // Get basic event data
        const eventId = event.getAttribute('id');
        const sport = getElementText(event, 'sport');
        const league = getElementText(event, 'league');
        const startTime = getElementText(event, 'start_time');
        const isLive = event.getAttribute('live') === 'true';
        
        // Get teams information
        const homeTeam = getElementText(event, 'home_team');
        const awayTeam = getElementText(event, 'away_team');
        
        // Create event card
        const eventCard = createEventCard(
            eventId,
            sport,
            league,
            startTime,
            isLive,
            homeTeam,
            awayTeam,
            event.querySelectorAll('market'),
            currentCurrency
        );
        
        // Add event card to container
        eventsContainer.appendChild(eventCard);
    });
}

/**
 * Create an event card element
 * @param {string} id - Event ID
 * @param {string} sport - Sport name
 * @param {string} league - League name
 * @param {string} time - Event start time
 * @param {boolean} isLive - Whether the event is live
 * @param {string} homeTeam - Home team name
 * @param {string} awayTeam - Away team name
 * @param {NodeList} markets - List of betting markets
 * @param {string} currency - Current currency
 * @returns {HTMLElement} - The event card element
 */
function createEventCard(id, sport, league, time, isLive, homeTeam, awayTeam, markets, currency) {
    // Create card element
    const card = document.createElement('div');
    card.className = `event-card${isLive ? ' live' : ''}`;
    card.setAttribute('data-event-id', id);
    
    // Create event header
    const header = document.createElement('div');
    header.className = 'event-header';
    
    const tournamentInfo = document.createElement('div');
    tournamentInfo.className = 'tournament-info';
    
    const tournamentName = document.createElement('span');
    tournamentName.className = 'tournament-name';
    tournamentName.textContent = league;
    tournamentInfo.appendChild(tournamentName);
    
    header.appendChild(tournamentInfo);
    
    const eventTimeElement = document.createElement('span');
    eventTimeElement.className = isLive ? 'live-indicator' : 'event-time';
    eventTimeElement.textContent = isLive ? 'LIVE' : formatTime(time);
    header.appendChild(eventTimeElement);
    
    card.appendChild(header);
    
    // Create teams container
    const teamsContainer = document.createElement('div');
    teamsContainer.className = 'teams-container';
    
    // Home team
    const homeTeamElement = document.createElement('div');
    homeTeamElement.className = 'team home';
    
    const homeTeamLogo = document.createElement('div');
    homeTeamLogo.className = 'team-logo';
    homeTeamLogo.innerHTML = `<img src="img/teams/${sport.toLowerCase()}/${homeTeam.replace(/\s+/g, '_').toLowerCase()}.svg" alt="${homeTeam}" onerror="this.src='img/team-placeholder.svg'">`;
    homeTeamElement.appendChild(homeTeamLogo);
    
    const homeTeamName = document.createElement('span');
    homeTeamName.className = 'team-name';
    homeTeamName.textContent = homeTeam;
    homeTeamElement.appendChild(homeTeamName);
    
    teamsContainer.appendChild(homeTeamElement);
    
    // Away team
    const awayTeamElement = document.createElement('div');
    awayTeamElement.className = 'team away';
    
    const awayTeamLogo = document.createElement('div');
    awayTeamLogo.className = 'team-logo';
    awayTeamLogo.innerHTML = `<img src="img/teams/${sport.toLowerCase()}/${awayTeam.replace(/\s+/g, '_').toLowerCase()}.svg" alt="${awayTeam}" onerror="this.src='img/team-placeholder.svg'">`;
    awayTeamElement.appendChild(awayTeamLogo);
    
    const awayTeamName = document.createElement('span');
    awayTeamName.className = 'team-name';
    awayTeamName.textContent = awayTeam;
    awayTeamElement.appendChild(awayTeamName);
    
    teamsContainer.appendChild(awayTeamElement);
    
    card.appendChild(teamsContainer);
    
    // Add main market
    if (markets && markets.length > 0) {
        const mainMarket = markets[0]; // Use first market as main
        const marketElement = createMarketElement(mainMarket, id, currency);
        card.appendChild(marketElement);
    }
    
    // Add more markets button if there are additional markets
    if (markets && markets.length > 1) {
        const moreMarketsBtn = document.createElement('button');
        moreMarketsBtn.className = 'more-markets-btn';
        moreMarketsBtn.textContent = `Еще ${markets.length - 1} маркетов`;
        moreMarketsBtn.setAttribute('data-event-id', id);
        moreMarketsBtn.addEventListener('click', function() {
            // Handle clicking on more markets (could open a modal or expand the card)
            alert('Функция просмотра дополнительных маркетов находится в разработке');
        });
        
        card.appendChild(moreMarketsBtn);
    }
    
    return card;
}

/**
 * Create a market element
 * @param {Element} market - The market XML element
 * @param {string} eventId - The event ID
 * @param {string} currency - Current currency
 * @returns {HTMLElement} - The market element
 */
function createMarketElement(market, eventId, currency) {
    const marketContainer = document.createElement('div');
    marketContainer.className = 'odds-container';
    
    const marketName = document.createElement('div');
    marketName.className = 'market-name';
    marketName.textContent = getElementText(market, 'name');
    marketContainer.appendChild(marketName);
    
    const outcomesContainer = document.createElement('div');
    outcomesContainer.className = 'outcome-container';
    
    // Get all outcomes for this market
    const outcomes = market.querySelectorAll('outcome');
    
    outcomes.forEach(outcome => {
        const outcomeElement = document.createElement('div');
        outcomeElement.className = 'outcome';
        outcomeElement.setAttribute('data-outcome-id', outcome.getAttribute('id'));
        outcomeElement.setAttribute('data-event-id', eventId);
        outcomeElement.setAttribute('data-market-id', market.getAttribute('id'));
        
        // Add click handler to add to betslip
        outcomeElement.addEventListener('click', function() {
            // Add to betslip functionality would be implemented here
            addToBetslip(this.getAttribute('data-event-id'), 
                         this.getAttribute('data-market-id'), 
                         this.getAttribute('data-outcome-id'),
                         this.querySelector('.outcome-name').textContent,
                         this.querySelector('.outcome-value').textContent);
        });
        
        const outcomeName = document.createElement('span');
        outcomeName.className = 'outcome-name';
        outcomeName.textContent = getElementText(outcome, 'name');
        outcomeElement.appendChild(outcomeName);
        
        const outcomeValue = document.createElement('span');
        outcomeValue.className = 'outcome-value';
        outcomeValue.textContent = getElementText(outcome, 'odds');
        outcomeElement.appendChild(outcomeValue);
        
        outcomesContainer.appendChild(outcomeElement);
    });
    
    marketContainer.appendChild(outcomesContainer);
    
    return marketContainer;
}

/**
 * Helper function to safely get element text content
 * @param {Element} parent - The parent element
 * @param {string} tagName - The tag name to find
 * @returns {string} - The text content or an empty string
 */
function getElementText(parent, tagName) {
    const element = parent.querySelector(tagName);
    return element ? element.textContent : '';
}

/**
 * Format time for display
 * @param {string} timeString - ISO time string
 * @returns {string} - Formatted time
 */
function formatTime(timeString) {
    if (!timeString) return '';
    
    try {
        const date = new Date(timeString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    } catch (e) {
        return timeString;
    }
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const eventsContainer = document.getElementById('events-container');
    
    if (eventsContainer) {
        eventsContainer.innerHTML = `
            <div class="error-message">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                <p>${message}</p>
            </div>
        `;
    }
}

/**
 * Add selection to betslip
 * @param {string} eventId - Event ID
 * @param {string} marketId - Market ID
 * @param {string} outcomeId - Outcome ID
 * @param {string} outcomeName - Outcome name
 * @param {string} odds - Odds value
 */
function addToBetslip(eventId, marketId, outcomeId, outcomeName, odds) {
    // Get current currency
    const currencySelect = document.getElementById('currency-select');
    const currentCurrency = currencySelect ? currencySelect.value : 'BYN';
    
    // Find the clicked outcome
    const outcomeElement = document.querySelector(`.outcome[data-outcome-id="${outcomeId}"][data-event-id="${eventId}"][data-market-id="${marketId}"]`);
    if (outcomeElement) {
        // Find parent container and deselect other outcomes
        const parentContainer = outcomeElement.closest('.outcome-container');
        if (parentContainer) {
            const siblingOutcomes = parentContainer.querySelectorAll('.outcome');
            siblingOutcomes.forEach(sib => {
                if (sib !== outcomeElement) {
                    sib.classList.remove('active');
                }
            });
        }
        
        // Toggle active class on the clicked outcome
        const wasActive = outcomeElement.classList.contains('active');
        outcomeElement.classList.toggle('active');
        
        // If we just activated the outcome
        if (outcomeElement.classList.contains('active')) {
            // Show notification
            showNotification(`Ставка добавлена: ${outcomeName} (${odds})`);
        } else {
            // Show notification for removal
            showNotification(`Ставка удалена: ${outcomeName}`);
        }
    }
    
    // Update the betslip
    if (typeof updateBetslip === 'function') {
        updateBetslip();
    }
    
    // Show betslip on mobile
    const betslipSidebar = document.querySelector('.betslip-sidebar');
    if (betslipSidebar && window.innerWidth < 768) {
        betslipSidebar.classList.add('active');
    }
}

/**
 * Show notification
 * @param {string} message - Message to display
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 