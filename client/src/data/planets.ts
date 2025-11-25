<<<<<<< HEAD

=======
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
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
  },
  // Additional Dwarf Planets
  {
    name: "Gonggong",
    size: 0.18,
    color: "#8B8B7A",
    orbitRadius: 66,
    orbitSpeed: 0.035,
    rotationSpeed: 0.016,
    tokenReward: 190,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.7,
    mintingCost: 180,
    orbitalInclination: 0.126,
    facts: {
      description: "A scattered disk object with a reddish tint, Gonggong is one of the largest known dwarf planets beyond Neptune.",
      diameter: "1,230 km",
      distanceFromSun: "7.5 billion km",
      orbitalPeriod: "552 Earth years",
      dayLength: "19.4 hours",
      moons: "1 known moon",
      funFact: "Gonggong is named after a water deity in Chinese mythology!"
    }
  },
  {
    name: "Orcus",
    size: 0.17,
    color: "#5F4A3C",
    orbitRadius: 63,
    orbitSpeed: 0.042,
    rotationSpeed: 0.014,
    tokenReward: 185,
    type: "dwarfPlanet",
    passiveIncomeRate: 0.7,
    mintingCost: 180,
    orbitalInclination: 0.089,
    facts: {
      description: "A plutino in the Kuiper Belt with a mysterious dark surface, Orcus is similar in size to Pluto.",
      diameter: "910 km",
      distanceFromSun: "6.0 billion km",
      orbitalPeriod: "245 Earth years",
      dayLength: "10.5 hours",
      moons: "1 (Vanth)",
      funFact: "Orcus is the god of oaths and the underworld in Roman mythology!"
    }
  }
];

// Asteroids as PlanetData objects (simple geometric shapes)
export const asteroidData: PlanetData[] = [
  // Common Asteroids
  {
    name: "Vesta",
    size: 0.12,
    color: "#D4A574",
    orbitRadius: 25,
    orbitSpeed: 0.3,
    rotationSpeed: 0.025,
    tokenReward: 5,
    type: "asteroid",
    passiveIncomeRate: 0.1,
    mintingCost: 5,
    orbitalInclination: 0.089,
    facts: {
      description: "The brightest asteroid in the night sky, Vesta is one of the largest objects in the asteroid belt.",
      diameter: "525 km",
      distanceFromSun: "353 million km",
      orbitalPeriod: "3.63 years",
      dayLength: "5.3 hours",
      moons: "0",
      funFact: "Vesta is so bright that it can be seen from Earth with the naked eye on rare occasions!"
    }
  },
  {
    name: "Pallas",
    size: 0.13,
    color: "#8B8680",
    orbitRadius: 26,
    orbitSpeed: 0.28,
    rotationSpeed: 0.018,
    tokenReward: 5,
    type: "asteroid",
    passiveIncomeRate: 0.1,
    mintingCost: 5,
    orbitalInclination: 0.131,
    facts: {
      description: "An exceptionally large asteroid with an irregular shape, Pallas is the second-largest body in the asteroid belt.",
      diameter: "582 km",
      distanceFromSun: "413 million km",
      orbitalPeriod: "4.62 years",
      dayLength: "7.8 hours",
      moons: "0",
      funFact: "Pallas has one of the highest orbital inclinations of any asteroid, making it rarely pass through the ecliptic!"
    }
  },
  // Uncommon Asteroids
  {
    name: "Juno",
    size: 0.11,
    color: "#A9927D",
    orbitRadius: 27,
    orbitSpeed: 0.25,
    rotationSpeed: 0.022,
    tokenReward: 8,
    type: "asteroid",
    passiveIncomeRate: 0.15,
    mintingCost: 8,
    orbitalInclination: 0.128,
    facts: {
      description: "A metallic asteroid discovered in 1804, Juno is one of the original four asteroids known.",
      diameter: "247 km",
      distanceFromSun: "503 million km",
      orbitalPeriod: "5.35 years",
      dayLength: "7.2 hours",
      moons: "0",
      funFact: "Juno was the first asteroid discovered on New Year's Day!"
    }
  },
  {
    name: "Hygiea",
    size: 0.14,
    color: "#696969",
    orbitRadius: 28,
    orbitSpeed: 0.24,
    rotationSpeed: 0.019,
    tokenReward: 8,
    type: "asteroid",
    passiveIncomeRate: 0.15,
    mintingCost: 8,
    orbitalInclination: 0.108,
    facts: {
      description: "The fourth-largest asteroid in the solar system, Hygiea has a dark surface similar to carbonaceous chondrite meteorites.",
      diameter: "407 km",
      distanceFromSun: "550 million km",
      orbitalPeriod: "5.35 years",
      dayLength: "27.6 hours",
      moons: "0",
      funFact: "Hygiea is named after the Greek goddess of health and hygiene!"
    }
  },
  {
    name: "Astraea",
    size: 0.1,
    color: "#C0C0C0",
    orbitRadius: 29,
    orbitSpeed: 0.22,
    rotationSpeed: 0.021,
    tokenReward: 8,
    type: "asteroid",
    passiveIncomeRate: 0.15,
    mintingCost: 8,
    orbitalInclination: 0.105,
    facts: {
      description: "A stony asteroid discovered in 1845, Astraea is linked to Greek mythology of justice.",
      diameter: "119 km",
      distanceFromSun: "580 million km",
      orbitalPeriod: "4.13 years",
      dayLength: "16.8 hours",
      moons: "0",
      funFact: "Astraea is the goddess of justice in Greek mythology!"
    }
  },
  // Rare Asteroids
  {
    name: "Apophis",
    size: 0.15,
    color: "#CD7F32",
    orbitRadius: 35,
    orbitSpeed: 0.18,
    rotationSpeed: 0.026,
    tokenReward: 12,
    type: "asteroid",
    passiveIncomeRate: 0.2,
    mintingCost: 12,
    orbitalInclination: 0.191,
    facts: {
      description: "A near-Earth asteroid with its own moon, Apophis will make a close approach to Earth in 2029.",
      diameter: "390 m",
      distanceFromSun: "varies",
      orbitalPeriod: "0.90 years",
      dayLength: "30.4 hours",
      moons: "1 moon",
      funFact: "Apophis will pass closer to Earth than some satellites on April 13, 2029!"
    }
  },
  {
    name: "Bennu",
    size: 0.14,
    color: "#8B4513",
    orbitRadius: 36,
    orbitSpeed: 0.17,
    rotationSpeed: 0.024,
    tokenReward: 12,
    type: "asteroid",
    passiveIncomeRate: 0.2,
    mintingCost: 12,
    orbitalInclination: 0.204,
    facts: {
      description: "A carbonaceous asteroid studied by NASA's OSIRIS-REx spacecraft, Bennu provides clues to the solar system's origin.",
      diameter: "560 m",
      distanceFromSun: "varies",
      orbitalPeriod: "1.20 years",
      dayLength: "4.3 hours",
      moons: "0",
      funFact: "NASA collected samples from Bennu in 2020 and brought them back to Earth in 2023!"
    }
  },
  {
    name: "Itokawa",
    size: 0.13,
    color: "#A9A9A9",
    orbitRadius: 37,
    orbitSpeed: 0.16,
    rotationSpeed: 0.023,
    tokenReward: 12,
    type: "asteroid",
    passiveIncomeRate: 0.2,
    mintingCost: 12,
    orbitalInclination: 0.312,
    facts: {
      description: "A near-Earth asteroid explored by Japan's Hayabusa spacecraft, Itokawa resembles a floating rubble pile.",
      diameter: "535 m",
      distanceFromSun: "varies",
      orbitalPeriod: "1.52 years",
      dayLength: "12.8 hours",
      moons: "0",
      funFact: "Itokawa's shape has been compared to a peanut or potato!"
    }
  },
  // Epic Asteroids
  {
    name: "Eros",
    size: 0.16,
    color: "#FFB347",
    orbitRadius: 40,
    orbitSpeed: 0.15,
    rotationSpeed: 0.027,
    tokenReward: 18,
    type: "asteroid",
    passiveIncomeRate: 0.3,
    mintingCost: 18,
    orbitalInclination: 0.223,
    facts: {
      description: "A large S-type asteroid that is one of the largest near-Earth asteroids, visited by NASA's NEAR spacecraft.",
      diameter: "16.8 × 16.2 × 34.4 km",
      distanceFromSun: "varies",
      orbitalPeriod: "1.76 years",
      dayLength: "5.27 hours",
      moons: "0",
      funFact: "NEAR Shoemaker spacecraft orbited Eros for over a year, the first spacecraft to orbit an asteroid!"
    }
  },
  {
    name: "Psyche",
    size: 0.17,
    color: "#D3D3D3",
    orbitRadius: 41,
    orbitSpeed: 0.14,
    rotationSpeed: 0.025,
    tokenReward: 18,
    type: "asteroid",
    passiveIncomeRate: 0.3,
    mintingCost: 18,
    orbitalInclination: 0.131,
    facts: {
      description: "A metallic asteroid possibly composed of iron and nickel, Psyche is the target of NASA's Psyche mission.",
      diameter: "226 km",
      distanceFromSun: "505 million km",
      orbitalPeriod: "4.99 years",
      dayLength: "4.196 hours",
      moons: "0",
      funFact: "Psyche might be the exposed iron core of a protoplanet - worth an estimated $700 quintillion!"
    }
  },
  {
    name: "Varda",
    size: 0.15,
    color: "#4B0082",
    orbitRadius: 42,
    orbitSpeed: 0.13,
    rotationSpeed: 0.026,
    tokenReward: 18,
    type: "asteroid",
    passiveIncomeRate: 0.3,
    mintingCost: 18,
    orbitalInclination: 0.088,
    facts: {
      description: "A scattered disk object with a moonlet, Varda is one of the more unusual distant objects.",
      diameter: "1,000 km",
      distanceFromSun: "6.4 billion km",
      orbitalPeriod: "559 years",
      dayLength: "3.8 hours",
      moons: "1 known moon",
      funFact: "Varda means 'destiny' in Tolkien's Elvish - fitting for a distant, mysterious object!"
    }
  },
  // Legendary Asteroids
  {
    name: "Oumuamua",
    size: 0.18,
    color: "#FF4500",
    orbitRadius: 48,
    orbitSpeed: 0.08,
    rotationSpeed: 0.035,
    tokenReward: 35,
    type: "asteroid",
    passiveIncomeRate: 0.5,
    mintingCost: 35,
    orbitalInclination: 1.193,
    facts: {
      description: "An interstellar visitor from another star system, Oumuamua is the first known interstellar asteroid.",
      diameter: "100-160 m",
      distanceFromSun: "varies (leaving)",
      orbitalPeriod: "N/A (hyperbolic orbit)",
      dayLength: "~8 hours",
      moons: "0",
      funFact: "Oumuamua means 'a messenger from afar' in Hawaiian - discovered in 2017, it's the first known object from another star!"
    }
  },
  {
    name: "Comet Halley (Core)",
    size: 0.19,
    color: "#FFFACD",
    orbitRadius: 49,
    orbitSpeed: 0.07,
    rotationSpeed: 0.033,
    tokenReward: 35,
    type: "asteroid",
    passiveIncomeRate: 0.5,
    mintingCost: 35,
    orbitalInclination: 0.162,
    facts: {
      description: "The famous periodic comet nucleus, returns to Earth's vicinity every 75-76 years.",
      diameter: "15 × 8 × 7 km",
      distanceFromSun: "varies (35.3 AU at aphelion)",
      orbitalPeriod: "75-76 years",
      dayLength: "varies",
      moons: "0",
      funFact: "Halley's Comet is named after Edmund Halley, who first predicted its return - it was last visible in 1986!"
    }
  },
  {
    name: "Chiron",
    size: 0.16,
    color: "#DEB887",
    orbitRadius: 50,
    orbitSpeed: 0.06,
    rotationSpeed: 0.029,
    tokenReward: 35,
    type: "asteroid",
    passiveIncomeRate: 0.5,
    mintingCost: 35,
    orbitalInclination: 0.383,
    facts: {
      description: "A rare comet-asteroid hybrid orbiting between Saturn and Uranus, behaving as both asteroid and comet.",
      diameter: "219 km",
      distanceFromSun: "varies (8.5-18.9 AU)",
      orbitalPeriod: "50.7 years",
      dayLength: "5.91 hours",
      moons: "0",
      funFact: "Chiron is named after the wise centaur in Greek mythology - it's the first Centaur discovered in the outer solar system!"
    }
  }
];

// Combine all celestial objects
export const allCelestialObjects = [
  ...planetsData,
  ...asteroidData
];

// Dwarf planet set for set bonus
export const dwarfPlanets = planetsData.filter(p => p.type === "dwarfPlanet");

// Asteroid set for set bonus
export const asteroids = allCelestialObjects.filter(p => p.type === "asteroid");
