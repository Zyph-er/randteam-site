// Import pokedex data
import { Pokedex } from './pokedex.js';

// Type definitions
interface Pokemon {
    id: string;
    num: number;
    name: string;
    types: string[];
    region: string;
    image: string;
    otherFormes?: string[];
    forme?: string;
    baseSpecies?: string;
    color?: string;
    weightkg?: number;
    heightm?: number;
    eggGroups?: string[];
    baseStats?: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    };
    abilities?: {
        0: string;
        1?: string;
        H?: string;
        S?: string;
    };
}

interface Filters {
    regions: string[];
    types: string[];
    colors: string[];
    eggGroups: string[];
    minWeight: number;
    minHeight: number;
}

// Region definitions by dex numbers
const REGIONS = {
    kanto: { start: 1, end: 151 },
    johto: { start: 152, end: 251 },
    hoenn: { start: 252, end: 386 },
    sinnoh: { start: 387, end: 493 },
    unova: { start: 494, end: 649 },
    kalos: { start: 650, end: 721 },
    alola: { start: 722, end: 809 },
    galar: { start: 810, end: 905 },
    paldea: { start: 906, end: 1025 }
};

// Convert Pokedex to Pokemon array
const pokemonDatabase: Pokemon[] = Object.entries(Pokedex)
    .filter(([_, data]: [string, any]) => {
        // Filter out formes, CAP filtering done in filterPokemon
        return !data.forme;
    })
    .map(([id, data]: [string, any]) => {
        // Determine region based on dex number
        let region = 'unknown';
        for (const [regionName, range] of Object.entries(REGIONS)) {
            if (data.num >= range.start && data.num <= range.end) {
                region = regionName;
                break;
            }
        }
        
        return {
            id,
            num: data.num,
            name: data.name,
            types: data.types,
            region,
            image: `https://pokepast.es/img/pokemon/${data.num}-0.png`,
            otherFormes: data.otherFormes,
            forme: data.forme,
            baseSpecies: data.baseSpecies,
            color: data.color,
            weightkg: data.weightkg,
            heightm: data.heightm,
            eggGroups: data.eggGroups,
            baseStats: data.baseStats,
            abilities: data.abilities
        };
    });

// State management
let currentFilters: Filters = {
    regions: [],
    types: [],
    colors: [],
    eggGroups: [],
    minWeight: 0,
    minHeight: 0
};

let filteredPokemon: Pokemon[] = [...pokemonDatabase];
let generatedPokemon: Pokemon[] = [];
let generationHistory: Pokemon[][] = [];
let trashedHistory: Pokemon[][] = []; // Track trashed pokemon per generation
let currentHistoryIndex: number = -1;
let gen9MegasEnabled: boolean = false;
let capMonsEnabled: boolean = false;

// Reroll mode state
let isRerollMode: boolean = false;
let maxRerolls: number = 6;
let rerollScope: string = 'all'; // 'all' or 'per-pokemon'
let rerollsRemaining: number = 6;
let currentRerollPokemon: Pokemon | null = null;
let keptPokemon: Pokemon[] = [];
let trashedPokemon: Pokemon[] = [];
let rerollQueue: Pokemon[] = [];

// DOM elements
const regionToggle = document.getElementById('region-toggle') as HTMLButtonElement;
const regionCheckboxes = document.getElementById('region-checkboxes') as HTMLDivElement;
const typeToggle = document.getElementById('type-toggle') as HTMLButtonElement;
const typeCheckboxes = document.getElementById('type-checkboxes') as HTMLDivElement;
const colorToggle = document.getElementById('color-toggle') as HTMLButtonElement;
const colorCheckboxes = document.getElementById('color-checkboxes') as HTMLDivElement;
const eggToggle = document.getElementById('egg-toggle') as HTMLButtonElement;
const eggCheckboxes = document.getElementById('egg-checkboxes') as HTMLDivElement;
const minWeightInput = document.getElementById('min-weight') as HTMLInputElement;
const minHeightInput = document.getElementById('min-height') as HTMLInputElement;
const quantitySelect = document.getElementById('quantity-select') as HTMLSelectElement;
const modeSelect = document.getElementById('mode-select') as HTMLSelectElement;
const rerollCountSelect = document.getElementById('reroll-count-select') as HTMLSelectElement;
const rerollScopeSelect = document.getElementById('reroll-scope-select') as HTMLSelectElement;
const rerollSettings = document.getElementById('reroll-settings') as HTMLDivElement;
const gen9MegasCheck = document.getElementById('gen9-megas-check') as HTMLInputElement;
const capMonsCheck = document.getElementById('cap-mons-check') as HTMLInputElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const generationInfo = document.getElementById('generation-info') as HTMLSpanElement;
const resultContainer = document.getElementById('result-container') as HTMLDivElement;
const generatedGrid = document.getElementById('generated-grid') as HTMLDivElement;
const rerollInterface = document.getElementById('reroll-interface') as HTMLDivElement;
const currentPokemonDiv = document.getElementById('current-pokemon') as HTMLDivElement;
const rerollsRemainingSpan = document.getElementById('rerolls-remaining') as HTMLSpanElement;
const keepBtn = document.getElementById('keep-btn') as HTMLButtonElement;
const rerollBtn = document.getElementById('reroll-btn') as HTMLButtonElement;
const trashedContainer = document.getElementById('trashed-container') as HTMLDivElement;
const trashedGrid = document.getElementById('trashed-grid') as HTMLDivElement;

// Initialize app
function init(): void {
    attachEventListeners();
    setupCheckboxListeners();
    filterPokemon();
}

// Event listeners
function attachEventListeners(): void {
    // Toggle dropdowns
    regionToggle.addEventListener('click', () => toggleDropdown(regionCheckboxes));
    typeToggle.addEventListener('click', () => toggleDropdown(typeCheckboxes));
    colorToggle.addEventListener('click', () => toggleDropdown(colorCheckboxes));
    eggToggle.addEventListener('click', () => toggleDropdown(eggCheckboxes));
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.filter-group')) {
            closeAllDropdowns();
        }
    });
    
    // Numeric inputs
    minWeightInput.addEventListener('change', handleFilterChange);
    minHeightInput.addEventListener('change', handleFilterChange);
    
    // Mode and reroll settings
    modeSelect.addEventListener('change', handleModeChange);
    rerollCountSelect.addEventListener('change', handleRerollCountChange);
    rerollScopeSelect.addEventListener('change', handleRerollScopeChange);
    
    // Checkboxes
    gen9MegasCheck.addEventListener('change', handleGen9MegasChange);
    capMonsCheck.addEventListener('change', handleCapMonsChange);
    
    // Buttons
    generateBtn.addEventListener('click', generateRandomPokemon);
    clearBtn.addEventListener('click', clearSelection);
    copyBtn.addEventListener('click', copyPokemonNames);
    prevBtn.addEventListener('click', showPreviousGeneration);
    nextBtn.addEventListener('click', showNextGeneration);
    keepBtn.addEventListener('click', keepCurrentPokemon);
    rerollBtn.addEventListener('click', rerollCurrentPokemon);
}

// Setup checkbox listeners for filter groups
function setupCheckboxListeners(): void {
    // Region checkboxes
    const regionInputs = regionCheckboxes.querySelectorAll('input[type="checkbox"]');
    regionInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFilterArray(currentFilters.regions, (input as HTMLInputElement).value, (input as HTMLInputElement).checked);
            updateDropdownText(regionToggle, currentFilters.regions.length, 'Regions');
            handleFilterChange();
        });
    });
    
    // Type checkboxes
    const typeInputs = typeCheckboxes.querySelectorAll('input[type="checkbox"]');
    typeInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFilterArray(currentFilters.types, (input as HTMLInputElement).value, (input as HTMLInputElement).checked);
            updateDropdownText(typeToggle, currentFilters.types.length, 'Types');
            handleFilterChange();
        });
    });
    
    // Color checkboxes
    const colorInputs = colorCheckboxes.querySelectorAll('input[type="checkbox"]');
    colorInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFilterArray(currentFilters.colors, (input as HTMLInputElement).value, (input as HTMLInputElement).checked);
            updateDropdownText(colorToggle, currentFilters.colors.length, 'Colors');
            handleFilterChange();
        });
    });
    
    // Egg group checkboxes
    const eggInputs = eggCheckboxes.querySelectorAll('input[type="checkbox"]');
    eggInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFilterArray(currentFilters.eggGroups, (input as HTMLInputElement).value, (input as HTMLInputElement).checked);
            updateDropdownText(eggToggle, currentFilters.eggGroups.length, 'Egg Groups');
            handleFilterChange();
        });
    });
}

// Toggle dropdown visibility
function toggleDropdown(dropdown: HTMLDivElement): void {
    dropdown.classList.toggle('hidden');
}

// Close all dropdowns
function closeAllDropdowns(): void {
    regionCheckboxes.classList.add('hidden');
    typeCheckboxes.classList.add('hidden');
    colorCheckboxes.classList.add('hidden');
    eggCheckboxes.classList.add('hidden');
}

// Update filter array when checkbox changes
function updateFilterArray(arr: string[], value: string, checked: boolean): void {
    if (checked && !arr.includes(value)) {
        arr.push(value);
    } else if (!checked && arr.includes(value)) {
        const index = arr.indexOf(value);
        arr.splice(index, 1);
    }
}

// Update dropdown button text to show selection count
function updateDropdownText(button: HTMLButtonElement, selectedCount: number, label: string): void {
    if (selectedCount === 0) {
        button.textContent = `${label} ▼`;
    } else if (selectedCount === 1) {
        button.textContent = `${label} (1 Selected) ▼`;
    } else {
        button.textContent = `${label} (${selectedCount} Selected) ▼`;
    }
}

// Handle filter changes
function handleFilterChange(): void {
    currentFilters.minWeight = parseFloat(minWeightInput.value) || 0;
    currentFilters.minHeight = parseFloat(minHeightInput.value) || 0;
    
    filterPokemon();
}

// Handle gen 9 megas checkbox
function handleGen9MegasChange(): void {
    gen9MegasEnabled = gen9MegasCheck.checked;
}

// Handle CAP mons checkbox
function handleCapMonsChange(): void {
    capMonsEnabled = capMonsCheck.checked;
    filterPokemon();
}

// Handle mode change
function handleModeChange(): void {
    isRerollMode = modeSelect.value === 'reroll';
    if (isRerollMode) {
        rerollSettings.classList.remove('hidden');
    } else {
        rerollSettings.classList.add('hidden');
    }
}

// Handle reroll count change
function handleRerollCountChange(): void {
    maxRerolls = parseInt(rerollCountSelect.value);
}

// Handle reroll scope change
function handleRerollScopeChange(): void {
    rerollScope = rerollScopeSelect.value;
}

// Filter Pokemon based on selected filters
function filterPokemon(): void {
    filteredPokemon = pokemonDatabase.filter(pokemon => {
        // CAP mons filter
        if (!capMonsEnabled && pokemon.num < 1) {
            return false;
        }
        
        // Region filter
        const regionMatch = currentFilters.regions.length === 0 || 
            currentFilters.regions.includes(pokemon.region);
        
        // Type filter
        const typeMatch = currentFilters.types.length === 0 || 
            pokemon.types.some(t => currentFilters.types.includes(t.toLowerCase()));
        
        // Color filter
        const colorMatch = currentFilters.colors.length === 0 || 
            (pokemon.color && currentFilters.colors.includes(pokemon.color));
        
        // Egg group filter
        const eggMatch = currentFilters.eggGroups.length === 0 || 
            (pokemon.eggGroups && pokemon.eggGroups.some(eg => currentFilters.eggGroups.includes(eg)));
        
        // Weight filter (min or equal)
        const weightMatch = pokemon.weightkg !== undefined &&
            pokemon.weightkg >= currentFilters.minWeight;
        
        // Height filter (min or equal)
        const heightMatch = pokemon.heightm !== undefined &&
            pokemon.heightm >= currentFilters.minHeight;
        
        return regionMatch && typeMatch && colorMatch && eggMatch && weightMatch && heightMatch;
    });
}

// Generate random Pokemon from filtered list
function generateRandomPokemon(): void {
    if (isRerollMode) {
        startRerollMode();
    } else {
        generateStandardMode();
    }
}

// Start reroll mode
function startRerollMode(): void {
    const quantity = parseInt(quantitySelect.value);
    
    if (filteredPokemon.length === 0) {
        alert('No Pokemon match your filters! Please adjust your selection.');
        return;
    }
    
    // Reset reroll state
    keptPokemon = [];
    trashedPokemon = [];
    rerollsRemaining = maxRerolls;
    rerollQueue = [];
    
    // Generate queue of pokemon to go through
    const availablePokemon = [...filteredPokemon];
    for (let i = 0; i < quantity; i++) {
        if (availablePokemon.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availablePokemon.length);
        const pokemon = getRandomPokemonWithForme(availablePokemon[randomIndex]);
        availablePokemon.splice(randomIndex, 1);
        rerollQueue.push(pokemon);
    }
    
    // Show first pokemon
    if (rerollQueue.length > 0) {
        currentRerollPokemon = rerollQueue.shift()!;
        displayRerollInterface();
    }
}

// Standard generation mode
function generateStandardMode(): void {
    const quantity = parseInt(quantitySelect.value);
    
    if (filteredPokemon.length === 0) {
        alert('No Pokemon match your filters! Please adjust your selection.');
        return;
    }
    
    if (filteredPokemon.length < quantity) {
        alert(`Only ${filteredPokemon.length} Pokemon match your filters. Cannot generate ${quantity}.`);
        return;
    }
    
    generatedPokemon = [];
    const availablePokemon = [...filteredPokemon];
    
    for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * availablePokemon.length);
        const basePokemon = availablePokemon[randomIndex];
        availablePokemon.splice(randomIndex, 1);
        
        const pokemon = getRandomPokemonWithForme(basePokemon);
        generatedPokemon.push(pokemon);
    }
    
    // Add to history
    generationHistory = generationHistory.slice(0, currentHistoryIndex + 1);
    generationHistory.push([...generatedPokemon]);
    trashedHistory = trashedHistory.slice(0, currentHistoryIndex + 1);
    trashedHistory.push([]); // No trashed pokemon in standard mode
    currentHistoryIndex = generationHistory.length - 1;
    
    displayGeneratedPokemon();
    updateNavigationButtons();
}

// Helper function to get pokemon with random forme
function getRandomPokemonWithForme(basePokemon: Pokemon): Pokemon {
    let selectedPokemon = { ...basePokemon };
    let formeIndex = 0;
    
    if (basePokemon.otherFormes && basePokemon.otherFormes.length > 0) {
        // Filter formes that match current color and egg group filters
        const validFormes: Array<{id: string, index: number}> = [{id: basePokemon.id, index: 0}];
        
        basePokemon.otherFormes.forEach((formeId, idx) => {
            const formeData = (Pokedex as any)[formeId.toLowerCase().replace(/[^a-z0-9]/g, '')];
            if (formeData) {
                // Check if forme matches color filter
                const colorMatch = currentFilters.colors.length === 0 || 
                    (formeData.color && currentFilters.colors.includes(formeData.color));
                
                // Check if forme matches egg group filter
                const eggMatch = currentFilters.eggGroups.length === 0 || 
                    (formeData.eggGroups && formeData.eggGroups.some((eg: string) => currentFilters.eggGroups.includes(eg)));
                
                // Check if it's a Gen 9 mega and should be excluded
                const isMega = formeData.forme && formeData.forme.toLowerCase().includes('mega');
                const isGen9 = formeData.num >= 906 && formeData.num <= 1025;
                const excludeMega = isMega && isGen9 && !gen9MegasEnabled;
                
                if (colorMatch && eggMatch && !excludeMega) {
                    validFormes.push({id: formeId, index: idx + 1});
                }
            }
        });
        
        // Pick random valid forme
        if (validFormes.length > 0) {
            const randomChoice = validFormes[Math.floor(Math.random() * validFormes.length)];
            const selectedFormeId = randomChoice.id;
            formeIndex = randomChoice.index;
            
            if (selectedFormeId !== basePokemon.id) {
                const formeData = (Pokedex as any)[selectedFormeId.toLowerCase().replace(/[^a-z0-9]/g, '')];
                if (formeData) {
                    selectedPokemon = {
                        ...basePokemon,
                        id: selectedFormeId,
                        name: formeData.name,
                        types: formeData.types,
                        image: `https://pokepast.es/img/pokemon/${basePokemon.num}-${formeIndex}.png`,
                        baseStats: formeData.baseStats,
                        abilities: formeData.abilities
                    };
                }
            }
        }
    }
    
    if (formeIndex === 0) {
        selectedPokemon.image = `https://pokepast.es/img/pokemon/${basePokemon.num}-0.png`;
    }
    
    return selectedPokemon;
}

// Display generated Pokemon in grid
function displayGeneratedPokemon(): void {
    generatedGrid.innerHTML = '';
    rerollInterface.classList.add('hidden');
    
    generatedPokemon.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;
        generatedGrid.appendChild(card);
    });
    
    resultContainer.classList.remove('hidden');
    
    // Display trashed pokemon from history if any
    if (currentHistoryIndex >= 0 && trashedHistory[currentHistoryIndex] && trashedHistory[currentHistoryIndex].length > 0) {
        trashedContainer.classList.remove('hidden');
        trashedGrid.innerHTML = '';
        trashedHistory[currentHistoryIndex].forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
            `;
            trashedGrid.appendChild(card);
        });
    } else {
        trashedContainer.classList.add('hidden');
    }
}

// Display reroll interface
function displayRerollInterface(): void {
    if (!currentRerollPokemon) return;
    
    // Hide standard grid, show reroll interface
    generatedGrid.innerHTML = '';
    rerollInterface.classList.remove('hidden');
    resultContainer.classList.remove('hidden');
    
    // Update rerolls remaining
    rerollsRemainingSpan.textContent = rerollsRemaining.toString();
    
    // Display current pokemon
    currentPokemonDiv.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <img src="${currentRerollPokemon.image}" alt="${currentRerollPokemon.name}">
        <h3>${currentRerollPokemon.name}</h3>
    `;
    currentPokemonDiv.appendChild(card);
    
    // Display stats
    if (currentRerollPokemon.baseStats) {
        const stats = currentRerollPokemon.baseStats;
        document.getElementById('stat-hp')!.textContent = stats.hp.toString();
        document.getElementById('stat-atk')!.textContent = stats.atk.toString();
        document.getElementById('stat-def')!.textContent = stats.def.toString();
        document.getElementById('stat-spa')!.textContent = stats.spa.toString();
        document.getElementById('stat-spd')!.textContent = stats.spd.toString();
        document.getElementById('stat-spe')!.textContent = stats.spe.toString();
        
        const total = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
        document.getElementById('stat-total')!.textContent = total.toString();
        
        // Update stat bars (max 255 for individual stats)
        (document.getElementById('bar-hp') as HTMLElement).style.width = `${(stats.hp / 255) * 100}%`;
        (document.getElementById('bar-hp') as HTMLElement).className = 'stat-fill hp';
        (document.getElementById('bar-atk') as HTMLElement).style.width = `${(stats.atk / 255) * 100}%`;
        (document.getElementById('bar-atk') as HTMLElement).className = 'stat-fill attack';
        (document.getElementById('bar-def') as HTMLElement).style.width = `${(stats.def / 255) * 100}%`;
        (document.getElementById('bar-def') as HTMLElement).className = 'stat-fill defense';
        (document.getElementById('bar-spa') as HTMLElement).style.width = `${(stats.spa / 255) * 100}%`;
        (document.getElementById('bar-spa') as HTMLElement).className = 'stat-fill spatk';
        (document.getElementById('bar-spd') as HTMLElement).style.width = `${(stats.spd / 255) * 100}%`;
        (document.getElementById('bar-spd') as HTMLElement).className = 'stat-fill spdef';
        (document.getElementById('bar-spe') as HTMLElement).style.width = `${(stats.spe / 255) * 100}%`;
        (document.getElementById('bar-spe') as HTMLElement).className = 'stat-fill speed';
    }
    
    // Display abilities
    const abilitiesList = document.getElementById('abilities-list')!;
    abilitiesList.innerHTML = '';
    if (currentRerollPokemon.abilities) {
        const abilities = currentRerollPokemon.abilities;
        if (abilities['0']) {
            const abilityDiv = document.createElement('div');
            abilityDiv.className = 'ability-item';
            abilityDiv.innerHTML = `<span class="ability-name">${abilities['0']}</span>`;
            abilitiesList.appendChild(abilityDiv);
        }
        if (abilities['1']) {
            const abilityDiv = document.createElement('div');
            abilityDiv.className = 'ability-item';
            abilityDiv.innerHTML = `<span class="ability-name">${abilities['1']}</span>`;
            abilitiesList.appendChild(abilityDiv);
        }
        if (abilities.H) {
            const abilityDiv = document.createElement('div');
            abilityDiv.className = 'ability-item';
            abilityDiv.innerHTML = `<span class="ability-hidden">${abilities.H}</span>`;
            abilitiesList.appendChild(abilityDiv);
        }
    }
    
    // Update reroll button state
    rerollBtn.disabled = rerollsRemaining <= 0;
    
    // Display kept pokemon
    if (keptPokemon.length > 0) {
        generatedGrid.innerHTML = '';
        keptPokemon.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
            `;
            generatedGrid.appendChild(card);
        });
    }
    
    // Display trashed pokemon
    if (trashedPokemon.length > 0) {
        trashedContainer.classList.remove('hidden');
        trashedGrid.innerHTML = '';
        trashedPokemon.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
            `;
            trashedGrid.appendChild(card);
        });
    } else {
        trashedContainer.classList.add('hidden');
    }
}

// Keep current pokemon
function keepCurrentPokemon(): void {
    if (!currentRerollPokemon) return;
    
    keptPokemon.push(currentRerollPokemon);
    
    // Check if we have more pokemon in queue
    if (rerollQueue.length > 0) {
        currentRerollPokemon = rerollQueue.shift()!;
        // Reset rerolls only if scope is per-pokemon
        if (rerollScope === 'per-pokemon') {
            rerollsRemaining = maxRerolls;
        }
        displayRerollInterface();
    } else {
        // Done with reroll mode
        finishRerollMode();
    }
}

// Reroll current pokemon
function rerollCurrentPokemon(): void {
    if (!currentRerollPokemon || rerollsRemaining <= 0) return;
    
    // Add current to trashed
    trashedPokemon.push(currentRerollPokemon);
    rerollsRemaining--;
    
    // Generate new pokemon
    if (filteredPokemon.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredPokemon.length);
        currentRerollPokemon = getRandomPokemonWithForme(filteredPokemon[randomIndex]);
        displayRerollInterface();
    }
}

// Finish reroll mode
function finishRerollMode(): void {
    generatedPokemon = [...keptPokemon];
    
    // Add to history with trashed pokemon
    generationHistory = generationHistory.slice(0, currentHistoryIndex + 1);
    generationHistory.push([...generatedPokemon]);
    trashedHistory = trashedHistory.slice(0, currentHistoryIndex + 1);
    trashedHistory.push([...trashedPokemon]); // Save trashed pokemon for this generation
    currentHistoryIndex = generationHistory.length - 1;
    
    displayGeneratedPokemon();
    updateNavigationButtons();
}

// Navigation functions
function showPreviousGeneration(): void {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        generatedPokemon = [...generationHistory[currentHistoryIndex]];
        displayGeneratedPokemon(); // This will load trashed pokemon from trashedHistory
        updateNavigationButtons();
    }
}

function showNextGeneration(): void {
    if (currentHistoryIndex < generationHistory.length - 1) {
        currentHistoryIndex++;
        generatedPokemon = [...generationHistory[currentHistoryIndex]];
        displayGeneratedPokemon(); // This will load trashed pokemon from trashedHistory
        updateNavigationButtons();
    }
}

function updateNavigationButtons(): void {
    // Enable/disable previous button
    prevBtn.disabled = currentHistoryIndex <= 0;
    
    // Enable/disable next button
    nextBtn.disabled = currentHistoryIndex >= generationHistory.length - 1;
    
    // Show/hide generation info
    if (generationHistory.length > 1) {
        generationInfo.textContent = `Generation ${currentHistoryIndex + 1} of ${generationHistory.length}`;
        generationInfo.classList.remove('hidden');
    } else {
        generationInfo.classList.add('hidden');
    }
}

// Copy pokemon names to clipboard
function copyPokemonNames(): void {
    if (generatedPokemon.length === 0) {
        alert('No Pokemon generated yet!');
        return;
    }
    
    const names = generatedPokemon.map(p => p.name).join('\n\n');
    navigator.clipboard.writeText(names).then(() => {
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    }).catch(err => {
        alert('Failed to copy to clipboard');
        console.error('Copy failed:', err);
    });
}

// Clear selection and filters
function clearSelection(): void {
    // Check if there's anything to clear (visible pokemon or history)
    const hasGeneratedContent = generatedPokemon.length > 0 || generationHistory.length > 0;
    
    if (hasGeneratedContent) {
        // First press: clear pokemon and generations but keep result container visible
        generatedPokemon = [];
        generationHistory = [];
        trashedHistory = [];
        currentHistoryIndex = -1;
        keptPokemon = [];
        trashedPokemon = [];
        currentRerollPokemon = null;
        rerollQueue = [];
        generatedGrid.innerHTML = '';
        rerollInterface.classList.add('hidden');
        trashedContainer.classList.add('hidden');
        updateNavigationButtons();
    } else {
        // Second press: reset all filters
        // Uncheck all checkboxes
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(input => {
            (input as HTMLInputElement).checked = false;
        });
        
        // Reset numeric inputs
        minWeightInput.value = '0';
        minHeightInput.value = '0';
        
        // Reset selects
        quantitySelect.value = '12';
        modeSelect.value = 'standard';
        rerollCountSelect.value = '6';
        rerollScopeSelect.value = 'all';
        rerollSettings.classList.add('hidden');
        gen9MegasCheck.checked = false;
        capMonsCheck.checked = false;
        
        // Reset filter state
        currentFilters = {
            regions: [],
            types: [],
            colors: [],
            eggGroups: [],
            minWeight: 0,
            minHeight: 0
        };
        gen9MegasEnabled = false;
        capMonsEnabled = false;
        isRerollMode = false;
        maxRerolls = 6;
        rerollScope = 'all';
        
        // Reset dropdown button text
        updateDropdownText(regionToggle, 0, 'Regions');
        updateDropdownText(typeToggle, 0, 'Types');
        updateDropdownText(colorToggle, 0, 'Colors');
        updateDropdownText(eggToggle, 0, 'Egg Groups');
        
        filterPokemon();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
