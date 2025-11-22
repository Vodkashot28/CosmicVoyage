export interface PlanetFacts {
  description: string;
  diameter: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  dayLength: string;
  moons: string;
  funFact: string;
}

export interface PlanetData {
  name: string;
  size: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  tokenReward: number;
  type: "planet" | "dwarfPlanet" | "asteroid";
  passiveIncomeRate?: number; // tokens per hour (dwarf planets have higher)
  mintingCost?: number; // gas cost in TON or token equivalent
  orbitalInclination?: number; // orbital plane tilt in radians
  facts: PlanetFacts;
}

export const planetsData: PlanetData[] = [
  {
    name: "Mercury",
    size: 0.4,
    color: "#8B7D6B",
    orbitRadius: 8,
    orbitSpeed: 0.8,
    rotationSpeed: 0.01,
    tokenReward: 10,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.1,
    orbitalInclination: 0.12,
    facts: {
      description: "The smallest planet and closest to the Sun, Mercury is a rocky world with extreme temperatures.",
      diameter: "4,879 km",
      distanceFromSun: "57.9 million km",
      orbitalPeriod: "88 Earth days",
      dayLength: "59 Earth days",
      moons: "0",
      funFact: "Mercury has no atmosphere, so its surface is covered with craters like Earth's Moon!"
    }
  },
  {
    name: "Venus",
    size: 0.95,
    color: "#FFC649",
    orbitRadius: 12,
    orbitSpeed: 0.6,
    rotationSpeed: 0.008,
    tokenReward: 15,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.1,
    orbitalInclination: 0.054,
    facts: {
      description: "Often called Earth's twin, Venus is the hottest planet in our solar system due to its thick atmosphere.",
      diameter: "12,104 km",
      distanceFromSun: "108.2 million km",
      orbitalPeriod: "225 Earth days",
      dayLength: "243 Earth days",
      moons: "0",
      funFact: "A day on Venus is longer than its year! It rotates very slowly backwards."
    }
  },
  {
    name: "Earth",
    size: 1.0,
    color: "#2E8B57",
    orbitRadius: 16,
    orbitSpeed: 0.5,
    rotationSpeed: 0.02,
    tokenReward: 20,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.1,
    orbitalInclination: 0.0,
    facts: {
      description: "Our home planet, the only known place in the universe where life exists.",
      diameter: "12,742 km",
      distanceFromSun: "149.6 million km",
      orbitalPeriod: "365.25 days",
      dayLength: "24 hours",
      moons: "1 (The Moon)",
      funFact: "Earth is the only planet not named after a Greek or Roman god!"
    }
  },
  {
    name: "Mars",
    size: 0.53,
    color: "#E27B58",
    orbitRadius: 20,
    orbitSpeed: 0.4,
    rotationSpeed: 0.018,
    tokenReward: 25,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.1,
    orbitalInclination: 0.032,
    facts: {
      description: "The Red Planet is a cold desert world with the tallest volcano in our solar system.",
      diameter: "6,779 km",
      distanceFromSun: "227.9 million km",
      orbitalPeriod: "687 Earth days",
      dayLength: "24.6 hours",
      moons: "2 (Phobos & Deimos)",
      funFact: "Mars has the largest dust storms in the solar system, lasting for months!"
    }
  },
  {
    name: "Jupiter",
    size: 2.5,
    color: "#C88B3A",
    orbitRadius: 28,
    orbitSpeed: 0.2,
    rotationSpeed: 0.04,
    tokenReward: 50,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.15,
    orbitalInclination: 0.023,
    facts: {
      description: "The largest planet in our solar system, Jupiter is a gas giant with a famous Great Red Spot storm.",
      diameter: "139,820 km",
      distanceFromSun: "778.5 million km",
      orbitalPeriod: "12 Earth years",
      dayLength: "10 hours",
      moons: "95 known moons",
      funFact: "Jupiter's Great Red Spot is a storm bigger than Earth that has been raging for over 300 years!"
    }
  },
  {
    name: "Saturn",
    size: 2.2,
    color: "#FAD5A5",
    orbitRadius: 36,
    orbitSpeed: 0.15,
    rotationSpeed: 0.038,
    tokenReward: 75,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.15,
    orbitalInclination: 0.054,
    facts: {
      description: "Famous for its spectacular ring system, Saturn is a gas giant made mostly of hydrogen and helium.",
      diameter: "116,460 km",
      distanceFromSun: "1.43 billion km",
      orbitalPeriod: "29 Earth years",
      dayLength: "10.7 hours",
      moons: "146 known moons",
      funFact: "Saturn's rings are made of billions of pieces of ice and rock, some as small as grains of sand!"
    }
  },
  {
    name: "Uranus",
    size: 1.8,
    color: "#4FD0E0",
    orbitRadius: 44,
    orbitSpeed: 0.1,
    rotationSpeed: 0.03,
    tokenReward: 100,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.15,
    orbitalInclination: 0.014,
    facts: {
      description: "An ice giant that rotates on its side, Uranus has a unique tilted rotation axis.",
      diameter: "50,724 km",
      distanceFromSun: "2.87 billion km",
      orbitalPeriod: "84 Earth years",
      dayLength: "17 hours",
      moons: "27 known moons",
      funFact: "Uranus rotates on its side, so its poles get more sunlight than its equator!"
    }
  },
  {
    name: "Neptune",
    size: 1.7,
    color: "#4169E1",
    orbitRadius: 52,
    orbitSpeed: 0.08,
    rotationSpeed: 0.032,
    tokenReward: 150,
    type: "planet",
    passiveIncomeRate: 0.5,
    mintingCost: 0.15,
    orbitalInclination: 0.031,
    facts: {
      description: "The windiest planet in our solar system, Neptune is a deep blue ice giant with supersonic winds.",
      diameter: "49,244 km",
      distanceFromSun: "4.5 billion km",
      orbitalPeriod: "165 Earth years",
      dayLength: "16 hours",
      moons: "14 known moons",
      funFact: "Neptune has winds up to 2,000 km/h - the fastest in the solar system!"
    }
  },
  // Dwarf Planets
  {
    name: "Pluto",
    size: 0.2,
    color: "#C0C0C0",
    orbitRadius: 60,
    orbitSpeed: 0.05,
    rotationSpeed: 0.015,
    tokenReward: 200,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.75,
    mintingCost: 200,
    orbitalInclination: 0.299,
    facts: {
      description: "Once the 9th planet, Pluto is a dwarf planet with a heart-shaped region on its surface.",
      diameter: "2,377 km",
      distanceFromSun: "5.9 billion km",
      orbitalPeriod: "248 Earth years",
      dayLength: "6.4 Earth days",
      moons: "5 known moons",
      funFact: "Pluto was reclassified as a dwarf planet in 2006, but its heart-shaped Tombaugh Regio is still beloved by astronomers!"
    }
  },
  {
    name: "Ceres",
    size: 0.25,
    color: "#A9A9A9",
    orbitRadius: 42,
    orbitSpeed: 0.12,
    rotationSpeed: 0.025,
    tokenReward: 180,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.75,
    orbitalInclination: 0.076,
    mintingCost: 200,
    facts: {
      description: "The largest object in the asteroid belt, Ceres is a dwarf planet with water-ice on its surface.",
      diameter: "946 km",
      distanceFromSun: "413 million km",
      orbitalPeriod: "4.6 Earth years",
      dayLength: "9.1 hours",
      moons: "0",
      funFact: "Ceres contains about a third of the asteroid belt's total mass and has bright spots that are still mysterious!"
    }
  },
  {
    name: "Eris",
    size: 0.19,
    color: "#696969",
    orbitRadius: 65,
    orbitSpeed: 0.04,
    rotationSpeed: 0.012,
    tokenReward: 220,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.75,
    mintingCost: 200,
    facts: {
      description: "One of the largest known dwarf planets, Eris is further from the Sun than Pluto and highly eccentric in orbit.",
      diameter: "2,326 km",
      distanceFromSun: "9.6 billion km",
      orbitalPeriod: "559 Earth years",
      dayLength: "25.9 hours",
      moons: "1 (Dysnomia)",
      funFact: "Eris's discovery in 2005 led to the creation of the dwarf planet category!"
    }
  },
  {
    name: "Haumea",
    size: 0.22,
    color: "#D2B48C",
    orbitRadius: 62,
    orbitSpeed: 0.045,
    rotationSpeed: 0.08,
    tokenReward: 210,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.75,
    mintingCost: 200,
    facts: {
      description: "A rugby ball-shaped dwarf planet that rotates incredibly fast, Haumea spins on its axis every 3.9 hours.",
      diameter: "1,960 km (2,322 km long)",
      distanceFromSun: "6.5 billion km",
      orbitalPeriod: "283 Earth years",
      dayLength: "3.9 hours",
      moons: "2 known moons",
      funFact: "Haumea is the fastest rotating large object in the solar system, literally flying apart in slow motion!"
    }
  },
  {
    name: "Makemake",
    size: 0.21,
    color: "#CD853F",
    orbitRadius: 64,
    orbitSpeed: 0.043,
    rotationSpeed: 0.018,
    tokenReward: 215,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.75,
    mintingCost: 200,
    facts: {
      description: "A distant dwarf planet with methane ice on its surface, Makemake is one of the brightest objects in the Kuiper Belt.",
      diameter: "1,430 km",
      distanceFromSun: "6.8 billion km",
      orbitalPeriod: "303 Earth years",
      dayLength: "22.8 hours",
      moons: "1 (S/2015 MK 2)",
      funFact: "Makemake means 'creation' in the Rapa Nui language and was likely the one bright object visible in the night sky to ancient Easter Islanders!"
    }
  }
];

export const asteroidData = [
  {
    name: "Ceres-A1",
    rarity: "common",
    passiveIncomeRate: 0.1,
    tokenReward: 5
  },
  {
    name: "Vesta",
    rarity: "uncommon",
    passiveIncomeRate: 0.15,
    tokenReward: 10
  },
  {
    name: "Pallas",
    rarity: "rare",
    passiveIncomeRate: 0.2,
    tokenReward: 15
  },
  {
    name: "Juno",
    rarity: "epic",
    passiveIncomeRate: 0.3,
    tokenReward: 25
  },
  {
    name: "Hygiea",
    rarity: "epic",
    passiveIncomeRate: 0.3,
    tokenReward: 25
  },
  {
    name: "Apophis",
    rarity: "legendary",
    passiveIncomeRate: 0.5,
    tokenReward: 50
  },
  {
    name: "Bennu",
    rarity: "legendary",
    passiveIncomeRate: 0.5,
    tokenReward: 50
  }
];

// Dwarf planet set for set bonus
export const dwarfPlanets = planetsData.filter(p => p.type === "dwarfPlanet");
