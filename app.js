// Pokemon database with placeholder data
const pokemonDatabase = [
    // Kanto Region
    { id: 1, name: 'Bulbasaur', type: 'grass', region: 'kanto', image: 'https://via.placeholder.com/200?text=Bulbasaur' },
    { id: 4, name: 'Charmander', type: 'fire', region: 'kanto', image: 'https://via.placeholder.com/200?text=Charmander' },
    { id: 7, name: 'Squirtle', type: 'water', region: 'kanto', image: 'https://via.placeholder.com/200?text=Squirtle' },
    { id: 25, name: 'Pikachu', type: 'electric', region: 'kanto', image: 'https://via.placeholder.com/200?text=Pikachu' },
    { id: 39, name: 'Jigglypuff', type: 'normal', region: 'kanto', image: 'https://via.placeholder.com/200?text=Jigglypuff' },
    { id: 54, name: 'Psyduck', type: 'water', region: 'kanto', image: 'https://via.placeholder.com/200?text=Psyduck' },
    { id: 92, name: 'Gastly', type: 'ghost', region: 'kanto', image: 'https://via.placeholder.com/200?text=Gastly' },
    { id: 133, name: 'Eevee', type: 'normal', region: 'kanto', image: 'https://via.placeholder.com/200?text=Eevee' },
    { id: 143, name: 'Snorlax', type: 'normal', region: 'kanto', image: 'https://via.placeholder.com/200?text=Snorlax' },
    { id: 150, name: 'Mewtwo', type: 'psychic', region: 'kanto', image: 'https://via.placeholder.com/200?text=Mewtwo' },
    
    // Johto Region
    { id: 152, name: 'Chikorita', type: 'grass', region: 'johto', image: 'https://via.placeholder.com/200?text=Chikorita' },
    { id: 155, name: 'Cyndaquil', type: 'fire', region: 'johto', image: 'https://via.placeholder.com/200?text=Cyndaquil' },
    { id: 158, name: 'Totodile', type: 'water', region: 'johto', image: 'https://via.placeholder.com/200?text=Totodile' },
    { id: 172, name: 'Pichu', type: 'electric', region: 'johto', image: 'https://via.placeholder.com/200?text=Pichu' },
    { id: 175, name: 'Togepi', type: 'fairy', region: 'johto', image: 'https://via.placeholder.com/200?text=Togepi' },
    { id: 197, name: 'Umbreon', type: 'dark', region: 'johto', image: 'https://via.placeholder.com/200?text=Umbreon' },
    { id: 208, name: 'Steelix', type: 'steel', region: 'johto', image: 'https://via.placeholder.com/200?text=Steelix' },
    { id: 249, name: 'Lugia', type: 'psychic', region: 'johto', image: 'https://via.placeholder.com/200?text=Lugia' },
    
    // Hoenn Region
    { id: 252, name: 'Treecko', type: 'grass', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Treecko' },
    { id: 255, name: 'Torchic', type: 'fire', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Torchic' },
    { id: 258, name: 'Mudkip', type: 'water', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Mudkip' },
    { id: 280, name: 'Ralts', type: 'psychic', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Ralts' },
    { id: 302, name: 'Sableye', type: 'dark', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Sableye' },
    { id: 359, name: 'Absol', type: 'dark', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Absol' },
    { id: 382, name: 'Kyogre', type: 'water', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Kyogre' },
    { id: 384, name: 'Rayquaza', type: 'dragon', region: 'hoenn', image: 'https://via.placeholder.com/200?text=Rayquaza' },
    
    // Sinnoh Region
    { id: 387, name: 'Turtwig', type: 'grass', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Turtwig' },
    { id: 390, name: 'Chimchar', type: 'fire', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Chimchar' },
    { id: 393, name: 'Piplup', type: 'water', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Piplup' },
    { id: 403, name: 'Shinx', type: 'electric', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Shinx' },
    { id: 447, name: 'Riolu', type: 'fighting', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Riolu' },
    { id: 483, name: 'Dialga', type: 'steel', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Dialga' },
    { id: 491, name: 'Darkrai', type: 'dark', region: 'sinnoh', image: 'https://via.placeholder.com/200?text=Darkrai' },
    
    // Unova Region
    { id: 495, name: 'Snivy', type: 'grass', region: 'unova', image: 'https://via.placeholder.com/200?text=Snivy' },
    { id: 498, name: 'Tepig', type: 'fire', region: 'unova', image: 'https://via.placeholder.com/200?text=Tepig' },
    { id: 501, name: 'Oshawott', type: 'water', region: 'unova', image: 'https://via.placeholder.com/200?text=Oshawott' },
    { id: 570, name: 'Zorua', type: 'dark', region: 'unova', image: 'https://via.placeholder.com/200?text=Zorua' },
    { id: 643, name: 'Reshiram', type: 'dragon', region: 'unova', image: 'https://via.placeholder.com/200?text=Reshiram' },
    { id: 644, name: 'Zekrom', type: 'electric', region: 'unova', image: 'https://via.placeholder.com/200?text=Zekrom' },
    
    // Kalos Region
    { id: 650, name: 'Chespin', type: 'grass', region: 'kalos', image: 'https://via.placeholder.com/200?text=Chespin' },
    { id: 653, name: 'Fennekin', type: 'fire', region: 'kalos', image: 'https://via.placeholder.com/200?text=Fennekin' },
    { id: 656, name: 'Froakie', type: 'water', region: 'kalos', image: 'https://via.placeholder.com/200?text=Froakie' },
    { id: 667, name: 'Litleo', type: 'fire', region: 'kalos', image: 'https://via.placeholder.com/200?text=Litleo' },
    { id: 700, name: 'Sylveon', type: 'fairy', region: 'kalos', image: 'https://via.placeholder.com/200?text=Sylveon' },
    { id: 716, name: 'Xerneas', type: 'fairy', region: 'kalos', image: 'https://via.placeholder.com/200?text=Xerneas' },
    
    // Alola Region
    { id: 722, name: 'Rowlet', type: 'grass', region: 'alola', image: 'https://via.placeholder.com/200?text=Rowlet' },
    { id: 725, name: 'Litten', type: 'fire', region: 'alola', image: 'https://via.placeholder.com/200?text=Litten' },
    { id: 728, name: 'Popplio', type: 'water', region: 'alola', image: 'https://via.placeholder.com/200?text=Popplio' },
    { id: 778, name: 'Mimikyu', type: 'ghost', region: 'alola', image: 'https://via.placeholder.com/200?text=Mimikyu' },
    { id: 791, name: 'Solgaleo', type: 'psychic', region: 'alola', image: 'https://via.placeholder.com/200?text=Solgaleo' },
    
    // Galar Region
    { id: 810, name: 'Grookey', type: 'grass', region: 'galar', image: 'https://via.placeholder.com/200?text=Grookey' },
    { id: 813, name: 'Scorbunny', type: 'fire', region: 'galar', image: 'https://via.placeholder.com/200?text=Scorbunny' },
    { id: 816, name: 'Sobble', type: 'water', region: 'galar', image: 'https://via.placeholder.com/200?text=Sobble' },
    { id: 835, name: 'Yamper', type: 'electric', region: 'galar', image: 'https://via.placeholder.com/200?text=Yamper' },
    { id: 888, name: 'Zacian', type: 'fairy', region: 'galar', image: 'https://via.placeholder.com/200?text=Zacian' },
    { id: 889, name: 'Zamazenta', type: 'fighting', region: 'galar', image: 'https://via.placeholder.com/200?text=Zamazenta' }
];

// State management
let currentFilters = {
    region: 'all',
    type: 'all'
};

let filteredPokemon = [...pokemonDatabase];

// DOM elements
const regionSelect = document.getElementById('region-select');
const typeSelect = document.getElementById('type-select');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const resultContainer = document.getElementById('result-container');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonName = document.getElementById('pokemon-name');
const pokemonType = document.getElementById('pokemon-type');
const pokemonRegion = document.getElementById('pokemon-region');
const pokemonList = document.getElementById('pokemon-list');
const pokemonCount = document.getElementById('pokemon-count');

// Initialize app
function init() {
    updatePokemonList();
    attachEventListeners();
}

// Event listeners
function attachEventListeners() {
    regionSelect.addEventListener('change', handleFilterChange);
    typeSelect.addEventListener('change', handleFilterChange);
    generateBtn.addEventListener('click', generateRandomPokemon);
    clearBtn.addEventListener('click', clearSelection);
}

// Handle filter changes
function handleFilterChange() {
    currentFilters.region = regionSelect.value;
    currentFilters.type = typeSelect.value;
    
    filterPokemon();
    updatePokemonList();
}

// Filter Pokemon based on selected filters
function filterPokemon() {
    filteredPokemon = pokemonDatabase.filter(pokemon => {
        const regionMatch = currentFilters.region === 'all' || pokemon.region === currentFilters.region;
        const typeMatch = currentFilters.type === 'all' || pokemon.type === currentFilters.type;
        return regionMatch && typeMatch;
    });
}

// Generate random Pokemon from filtered list
function generateRandomPokemon() {
    if (filteredPokemon.length === 0) {
        alert('No Pokemon match your filters! Please adjust your selection.');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredPokemon.length);
    const randomPokemon = filteredPokemon[randomIndex];
    
    displayPokemon(randomPokemon);
}

// Display selected Pokemon
function displayPokemon(pokemon) {
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = pokemon.name;
    pokemonName.textContent = pokemon.name;
    pokemonType.textContent = pokemon.type;
    pokemonRegion.textContent = pokemon.region;
    
    resultContainer.classList.remove('hidden');
    
    // Smooth scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Clear selection and filters
function clearSelection() {
    regionSelect.value = 'all';
    typeSelect.value = 'all';
    currentFilters.region = 'all';
    currentFilters.type = 'all';
    
    filterPokemon();
    updatePokemonList();
    resultContainer.classList.add('hidden');
}

// Update Pokemon list display
function updatePokemonList() {
    pokemonList.innerHTML = '';
    pokemonCount.textContent = `(${filteredPokemon.length} Pokemon)`;
    
    filteredPokemon.forEach(pokemon => {
        const listItem = document.createElement('div');
        listItem.className = 'pokemon-list-item';
        listItem.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <span class="type-badge">${pokemon.type}</span>
        `;
        
        listItem.addEventListener('click', () => displayPokemon(pokemon));
        pokemonList.appendChild(listItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
