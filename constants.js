const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANETS = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", 
    "Venus", "Saturn", "Rahu", "Ketu", "Ascendant"
];

const DEFAULT_SIGN_LORDS = {
    "Aries": "Mars",
    "Taurus": "Venus",
    "Gemini": "Mercury",
    "Cancer": "Moon",
    "Leo": "Sun",
    "Virgo": "Mercury",
    "Libra": "Venus",
    "Scorpio": "Mars",
    "Sagittarius": "Jupiter",
    "Capricorn": "Saturn",
    "Aquarius": "Saturn",
    "Pisces": "Jupiter"
};

const MALEFIC_PLANETS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];
const BENEFIC_PLANETS = ["Jupiter", "Venus", "Mercury", "Moon"];

const HOUSE_TYPES = {
    KENDRA: [1, 4, 7, 10],
    TRINE: [1, 5, 9],
    MARAKA: [2, 7],
    EVIL: [6, 8, 12],
    CADENT: [3, 6, 9, 12],
    SUCCEDENT: [2, 5, 8, 11]
};

const SIGN_TYPES = {
    MOVABLE: ["Aries", "Cancer", "Libra", "Capricorn"],
    FIXED: ["Taurus", "Leo", "Scorpio", "Aquarius"],
    DUAL: ["Gemini", "Virgo", "Sagittarius", "Pisces"]
};

const EXALTED_SIGNS = {
    "Sun": "Aries",
    "Moon": "Taurus", 
    "Mars": "Capricorn",
    "Mercury": "Virgo",
    "Jupiter": "Cancer",
    "Venus": "Pisces",
    "Saturn": "Libra"
};

const DEBILITATED_SIGNS = {
    "Sun": "Libra",
    "Moon": "Scorpio",
    "Mars": "Cancer",
    "Mercury": "Pisces", 
    "Jupiter": "Capricorn",
    "Venus": "Virgo",
    "Saturn": "Aries"
};

const OWN_SIGNS = {
    "Sun": ["Leo"],
    "Moon": ["Cancer"],
    "Mars": ["Aries", "Scorpio"],
    "Mercury": ["Gemini", "Virgo"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Venus": ["Taurus", "Libra"],
    "Saturn": ["Capricorn", "Aquarius"],
    "Rahu": ["Scorpio"],
    "Ketu": ["Taurus"]
};

const PLANET_ASPECTS = {
    "Sun": [7],
    "Moon": [7],
    "Mars": [4, 7, 8],
    "Mercury": [7],
    "Jupiter": [5, 7, 9],
    "Venus": [7],
    "Saturn": [3, 7, 10],
    "Rahu": [5, 7, 9],
    "Ketu": [5, 7, 9]
};

const DEFAULT_ASCENDANT_HOUSE = 1;
