let currentChart = {
    houses: {},
    signs: {},
    planets: {}
};

function displayConstants() {
    // Display Malefic Planets
    document.getElementById('malefic-planets').innerHTML =
        MALEFIC_PLANETS.join(', ');

    // Display Benefic Planets
    document.getElementById('benefic-planets').innerHTML =
        BENEFIC_PLANETS.join(', ');

    // Display House Types
    let houseTypesHtml = '';
    for (const [type, houses] of Object.entries(HOUSE_TYPES)) {
        houseTypesHtml += `<div>${type}: ${houses.join(', ')}</div>`;
    }
    document.getElementById('house-types').innerHTML = houseTypesHtml;

    // Display Sign Types
    let signTypesHtml = '';
    for (const [type, signs] of Object.entries(SIGN_TYPES)) {
        signTypesHtml += `<div>${type}: ${signs.join(', ')}</div>`;
    }
    document.getElementById('sign-types').innerHTML = signTypesHtml;

    // Display Exalted Signs
    let exaltedHtml = '';
    for (const [planet, sign] of Object.entries(EXALTED_SIGNS)) {
        exaltedHtml += `<div>${planet}: ${sign}</div>`;
    }
    document.getElementById('exalted-signs').innerHTML = exaltedHtml;

    // Display Debilitated Signs
    let debilitatedHtml = '';
    for (const [planet, sign] of Object.entries(DEBILITATED_SIGNS)) {
        debilitatedHtml += `<div>${planet}: ${sign}</div>`;
    }
    document.getElementById('debilitated-signs').innerHTML = debilitatedHtml;

    // Display Own Signs
    let ownSignsHtml = '';
    for (const [planet, signs] of Object.entries(OWN_SIGNS)) {
        ownSignsHtml += `<div>${planet}: ${Array.isArray(signs) ? signs.join(', ') : signs}</div>`;
    }
    document.getElementById('own-signs').innerHTML = ownSignsHtml;

    // Display Planet Aspects
    let aspectsHtml = '';
    for (const [planet, aspects] of Object.entries(PLANET_ASPECTS)) {
        aspectsHtml += `<div>${planet}: ${Array.isArray(aspects) ? aspects.join(', ') : [...aspects].join(', ')}</div>`;
    }
    document.getElementById('planet-aspects').innerHTML = aspectsHtml;
}

function resetPlanets() {
    // Clear all planet selections
    PLANETS.forEach(planet => {
        document.getElementById(`${planet}-sign`).value = '';
        document.getElementById(`${planet}-house`).value = '';
    });

    // Clear lagna selection
    document.getElementById('lagna-sign').value = '';

    // Reset current chart
    currentChart = {
        houses: {},
        signs: {},
        planets: {}
    };

    // Update chart display
    updateChartDisplay();
}

function initializeUI() {
    // Display constants immediately
    displayConstants();
    // Initialize Lagna sign select
    const lagnaSelect = document.getElementById('lagna-sign');
    SIGNS.forEach((sign, index) => {
        const option = document.createElement('option');
        option.value = sign;
        option.textContent = `${index + 1}. ${sign} (${DEFAULT_SIGN_LORDS[sign]})`;
        lagnaSelect.appendChild(option);
    });

    // Create planet controls
    const planetControls = document.getElementById('planet-controls');
    PLANETS.forEach((planet, index) => {
        const div = document.createElement('div');
        div.className = 'planet-control';

        // Create planet label
        const label = document.createElement('label');
        label.textContent = planet;

        // Create disabled sign display
        const signSelect = document.createElement('select');
        signSelect.id = `${planet}-sign`;
        signSelect.disabled = true;
        signSelect.innerHTML = '<option value="">No Sign</option>';

        // Create house select
        const houseSelect = document.createElement('select');
        houseSelect.id = `${planet}-house`;
        houseSelect.innerHTML = '<option value="">Select House</option>';
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            houseSelect.appendChild(option);
        }

        div.appendChild(label);
        div.appendChild(signSelect);
        div.appendChild(houseSelect);
        planetControls.appendChild(div);

        // Add event listeners
        signSelect.addEventListener('change', () => {
            updateChart();
            updateChartDisplay();
        });
        houseSelect.addEventListener('change', () => {
            updateChart();
            updateChartDisplay();
        });
    });
}

function handleLagnaChange() {
    const lagnaSign = document.getElementById('lagna-sign').value;
    if (lagnaSign) {
        // Set Ascendant values
        document.getElementById('Ascendant-sign').value = lagnaSign;
        document.getElementById('Ascendant-house').value = DEFAULT_ASCENDANT_HOUSE;

        // Update chart
        updateChart();
    }
}

function getNextSign(currentSign) {
    const currentIndex = SIGNS.indexOf(currentSign);
    return SIGNS[(currentIndex + 1) % 12];
}

function autoFillRemainingHouses() {
    const lagnaSign = document.getElementById('lagna-sign').value;
    if (!lagnaSign) {
        alert('Please select Lagna sign first');
        return;
    }

    // Map houses to signs based on Lagna
    const houseToSign = new Map();
    let currentSign = lagnaSign;
    for (let house = 1; house <= 12; house++) {
        houseToSign.set(house, currentSign);
        currentSign = getNextSign(currentSign);
    }

    // Track used houses and signs
    const usedHouses = new Set();
    const usedSigns = new Set();

    // First, collect manually filled positions
    PLANETS.forEach(planet => {
        const houseSelect = document.getElementById(`${planet}-house`);
        const signSelect = document.getElementById(`${planet}-sign`);

        if (houseSelect.value) {
            usedHouses.add(parseInt(houseSelect.value));
        }
        if (signSelect.value) {
            usedSigns.add(signSelect.value);
        }
    });

    // Auto-fill empty positions
    PLANETS.forEach(planet => {
        const houseSelect = document.getElementById(`${planet}-house`);
        const signSelect = document.getElementById(`${planet}-sign`);

        // Skip if already filled
        if (houseSelect.value && signSelect.value) return;

        // Special handling for Ascendant
        if (planet === 'Ascendant') {
            houseSelect.value = DEFAULT_ASCENDANT_HOUSE;
            signSelect.value = lagnaSign;
            return;
        }

        // Find next available house and corresponding sign
        for (let house = 1; house <= 12; house++) {
            if (!usedHouses.has(house)) {
                const sign = houseToSign.get(house);
                houseSelect.value = house;
                signSelect.value = sign;
                usedHouses.add(house);
                usedSigns.add(sign);
                break;
            }
        }
    });

    updateChart();
}

function updateChart() {
    // Clear current chart's planet positions
    currentChart = {
        houses: {},
        signs: {},
        planets: {}
    };

    const lagnaSign = document.getElementById('lagna-sign').value;

    // First, establish house signs if lagna is set
    if (lagnaSign) {
        for (let i = 1; i <= 12; i++) {
            const houseSign = getSignForHouse(i, lagnaSign);
            currentChart.signs[i] = houseSign;
        }
    }

    // Update chart based on current selections
    PLANETS.forEach(planet => {
        const house = document.getElementById(`${planet}-house`).value;
        let sign = document.getElementById(`${planet}-sign`).value;

        if (house) {
            // If house is selected, use the house's sign from lagna
            if (lagnaSign) {
                sign = currentChart.signs[house];
                // Update the sign select to match house sign
                const signSelect = document.getElementById(`${planet}-sign`);
                signSelect.innerHTML = `<option value="${sign}">${sign}</option>`;
            }

            if (!currentChart.houses[house]) {
                currentChart.houses[house] = [];
            }
            currentChart.houses[house].push(planet);
            currentChart.planets[planet] = {
                house: parseInt(house),
                sign: sign
            };
        }
    });

    // Update visual representation
    updateChartDisplay();
}

function updateChartDisplay() {
    const lagnaSign = document.getElementById('lagna-sign').value;

    // Clear and update all houses
    for (let i = 1; i <= 12; i++) {
        const houseDiv = document.getElementById(`house${i}`);
        if (houseDiv) {
            // Keep house number
            const houseNumber = houseDiv.querySelector('.house-number');
            houseDiv.innerHTML = '';
            houseDiv.appendChild(houseNumber);

            // Create house info container
            const houseInfo = document.createElement('div');
            houseInfo.className = 'house-info';

            // Add sign and lord if lagna is selected
            if (lagnaSign) {
                const houseSign = getSignForHouse(i, lagnaSign);
                const signDiv = document.createElement('div');
                signDiv.className = 'house-sign';
                signDiv.textContent = houseSign;
                houseInfo.appendChild(signDiv);

                const lordDiv = document.createElement('div');
                lordDiv.className = 'house-lord';
                lordDiv.textContent = DEFAULT_SIGN_LORDS[houseSign];
                houseInfo.appendChild(lordDiv);

                // Add house type info
                const houseTypes = [];
                for (const [type, houses] of Object.entries(HOUSE_TYPES)) {
                    if (houses.includes(i)) {
                        houseTypes.push(type);
                    }
                }
                if (houseTypes.length > 0) {
                    const typeDiv = document.createElement('div');
                    typeDiv.className = 'house-type';
                    typeDiv.textContent = houseTypes.join(', ');
                    houseInfo.appendChild(typeDiv);
                }

                // Add sign type info
                for (const [type, signs] of Object.entries(SIGN_TYPES)) {
                    if (signs.includes(houseSign)) {
                        const signTypeDiv = document.createElement('div');
                        signTypeDiv.className = 'sign-type';
                        signTypeDiv.textContent = type;
                        houseInfo.appendChild(signTypeDiv);
                    }
                }
            }

            houseDiv.appendChild(houseInfo);

            // Add planets in house
            const planets = currentChart.houses[i] || [];
            if (planets.length > 0) {
                const planetsContainer = document.createElement('div');
                planetsContainer.className = 'planets-container';
                planets.forEach(planet => {
                    const planetDiv = document.createElement('div');
                    planetDiv.className = 'planet-in-house';

                    // Get planet status
                    const sign = currentChart.planets[planet].sign;
                    const statuses = [];

                    if (EXALTED_SIGNS[planet] === sign) {
                        statuses.push('Exalted');
                    }
                    if (DEBILITATED_SIGNS[planet] === sign) {
                        statuses.push('Debilitated');
                    }
                    if (OWN_SIGNS[planet]?.includes(sign)) {
                        statuses.push('Own Sign');
                    }

                    // Get aspected houses
                    const aspects = PLANET_ASPECTS[planet] || [];
                    const aspectHouses = aspects.map(aspect => {
                        const house = (i + aspect - 1) % 12;
                        return house === 0 ? 12 : house;
                    });

                    planetDiv.textContent = planet;
                    if (statuses.length > 0) {
                        planetDiv.textContent += ` (${statuses.join(', ')})`;
                    }
                    if (aspectHouses.length > 0) {
                        planetDiv.textContent += ` → ${aspectHouses.join(', ')}`;
                    }

                    planetsContainer.appendChild(planetDiv);
                });
                houseDiv.appendChild(planetsContainer);
            }
        }
    }
}

function getSignForHouse(house, lagnaSign) {
    const lagnaIndex = SIGNS.indexOf(lagnaSign);
    const signIndex = (lagnaIndex + house - 1) % 12;
    return SIGNS[signIndex];
}

function generateJSON() {
    const planetData = [];

    PLANETS.forEach((planet, index) => {
        const signSelect = document.getElementById(`${planet}-sign`);
        const houseSelect = document.getElementById(`${planet}-house`);

        if (signSelect.value) {
            const house = parseInt(houseSelect.value);
            const sign = signSelect.value;
            planetData.push({
                id: index,
                name: planet,
                sign: sign,
                signLord: DEFAULT_SIGN_LORDS[sign],
                house: house,
                is_planet_set: false
            });
        }
    });

    document.getElementById('json-output').value = JSON.stringify(planetData, null, 2);
}

function copyJSON() {
    const jsonOutput = document.getElementById('json-output');
    navigator.clipboard.writeText(jsonOutput.value).then(() => {
        const notification = document.createElement('div');
        notification.textContent = 'JSON copied to clipboard!';
        notification.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:4px; z-index:1000;';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    });
}

// Initialize the UI when the page loads
window.onload = initializeUI;
