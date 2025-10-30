// Configuration du jeu
const GAME_CONFIG = {
    clickValue: 1,
    autoClickInterval: 1000, // en millisecondes
};

// État du jeu
let gameState = {
    points: 0,
    multiplier: 1,
    autoClickers: 0,
};

// Définition des bâtiments
const buildings = [
    {
        id: 'mine',
        name: 'Mine abandonnée',
        baseCost: 1375,
        baseProduction: 5,
        owned: 0,
        image: 'assets/mine.png'
    },
    {
        id: 'cave',
        name: 'Caverne aux griffes',
        baseCost: 3500,
        baseProduction: 15,
        owned: 0,
        image: 'assets/cave.png'
    }
];

// Définition des améliorations
const upgrades = [
    {
        id: 'pickaxe',
        name: 'Pioche améliorée',
        cost: 500,
        multiplier: 2,
        image: 'assets/pickaxe.png',
        purchased: false
    },
    {
        id: 'drill',
        name: 'Foreuse',
        cost: 2000,
        multiplier: 3,
        image: 'assets/drill.png',
        purchased: false
    }
];

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    initializeBuildings();
    initializeUpgrades();
    initializeOffers();
    startAutoClickers();
});

// Fonction d'initialisation du jeu
function initializeGame() {
    const clickable = document.getElementById('clickable');
    clickable.addEventListener('click', handleClick);
    updateDisplay();
}

// Gestion du clic
function handleClick(event) {
    const clickValue = calculateClickValue();
    addPoints(clickValue);
    createPointsPopup(event);
}

// Calcul de la valeur du clic
function calculateClickValue() {
    return GAME_CONFIG.clickValue * gameState.multiplier;
}

// Ajout de points
function addPoints(amount) {
    gameState.points += amount;
    updateDisplay();
}

// Mise à jour de l'affichage
function updateDisplay() {
    document.getElementById('points').textContent = Math.floor(gameState.points);
}

// Création de l'animation de points
function createPointsPopup(event) {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = '+' + calculateClickValue();
    
    popup.style.left = event.pageX + 'px';
    popup.style.top = event.pageY + 'px';
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// Initialisation des bâtiments
function initializeBuildings() {
    const buildingsContainer = document.getElementById('buildings');
    buildings.forEach(building => {
        const element = createBuildingElement(building);
        buildingsContainer.appendChild(element);
    });
}

// Création d'un élément de bâtiment
function createBuildingElement(building) {
    const element = document.createElement('div');
    element.className = 'shop-item';
    element.innerHTML = `
        <img src="${building.image}" alt="${building.name}">
        <div class="shop-item-info">
            <div>${building.name}</div>
            <div class="shop-item-price">${building.baseCost} 💰</div>
        </div>
    `;
    element.addEventListener('click', () => purchaseBuilding(building));
    return element;
}

// Achat d'un bâtiment
function purchaseBuilding(building) {
    const cost = calculateBuildingCost(building);
    if (gameState.points >= cost) {
        gameState.points -= cost;
        building.owned++;
        gameState.autoClickers += building.baseProduction;
        updateDisplay();
    }
}

// Calcul du coût d'un bâtiment
function calculateBuildingCost(building) {
    return Math.floor(building.baseCost * Math.pow(1.15, building.owned));
}

// Initialisation des améliorations
function initializeUpgrades() {
    const upgradesContainer = document.getElementById('upgrades');
    upgrades.forEach(upgrade => {
        const element = createUpgradeElement(upgrade);
        upgradesContainer.appendChild(element);
    });
}

// Création d'un élément d'amélioration
function createUpgradeElement(upgrade) {
    const element = document.createElement('div');
    element.className = 'shop-item';
    element.innerHTML = `
        <img src="${upgrade.image}" alt="${upgrade.name}">
        <div class="shop-item-info">
            <div>${upgrade.name}</div>
            <div class="shop-item-price">${upgrade.cost} 💰</div>
        </div>
    `;
    element.addEventListener('click', () => purchaseUpgrade(upgrade));
    return element;
}

// Achat d'une amélioration
function purchaseUpgrade(upgrade) {
    if (!upgrade.purchased && gameState.points >= upgrade.cost) {
        gameState.points -= upgrade.cost;
        upgrade.purchased = true;
        gameState.multiplier *= upgrade.multiplier;
        updateDisplay();
        element.style.opacity = '0.5';
        element.style.cursor = 'default';
    }
}

// Initialisation des offres
function initializeOffers() {
    updateWeeklyOffer();
    updateDailyOffer();
    updateJobOffer();
}

// Mise à jour de l'offre de la semaine
function updateWeeklyOffer() {
    // À implémenter selon vos besoins
}

// Mise à jour de l'offre du jour
function updateDailyOffer() {
    // À implémenter selon vos besoins
}

// Mise à jour de l'offre métier
function updateJobOffer() {
    // À implémenter selon vos besoins
}

// Démarrage des auto-clickers
function startAutoClickers() {
    setInterval(() => {
        if (gameState.autoClickers > 0) {
            addPoints(gameState.autoClickers);
        }
    }, GAME_CONFIG.autoClickInterval);
}