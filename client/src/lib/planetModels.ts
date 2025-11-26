// Asset configuration for all 28 celestial objects
// Maps planet names to their 3D model configuration

interface PlanetModelConfig {
  name: string;
  modelPath: string;
  scale: number;
  rotationSpeed: number;
}

const planetModelsConfig: Record<string, PlanetModelConfig> = {
  // Main Planets (8)
  Mercury: {
    name: "Mercury",
    modelPath: "/models/mercury.glb",
    scale: 0.4,
    rotationSpeed: 0.01,
  },
  Venus: {
    name: "Venus",
    modelPath: "/models/venus.glb",
    scale: 0.95,
    rotationSpeed: 0.008,
  },
  Earth: {
    name: "Earth",
    modelPath: "/models/earth.glb",
    scale: 1.0,
    rotationSpeed: 0.02,
  },
  Mars: {
    name: "Mars",
    modelPath: "/models/mars.glb",
    scale: 0.53,
    rotationSpeed: 0.018,
  },
  Jupiter: {
    name: "Jupiter",
    modelPath: "/models/jupiter.glb",
    scale: 2.5,
    rotationSpeed: 0.04,
  },
  Saturn: {
    name: "Saturn",
    modelPath: "/models/saturn.glb",
    scale: 2.2,
    rotationSpeed: 0.038,
  },
  Uranus: {
    name: "Uranus",
    modelPath: "/models/uranus.glb",
    scale: 1.8,
    rotationSpeed: 0.03,
  },
  Neptune: {
    name: "Neptune",
    modelPath: "/models/neptune.glb",
    scale: 1.7,
    rotationSpeed: 0.032,
  },

  // Dwarf Planets (7)
  Pluto: {
    name: "Pluto",
    modelPath: "/models/pluto.glb",
    scale: 0.2,
    rotationSpeed: 0.015,
  },
  Ceres: {
    name: "Ceres",
    modelPath: "/models/ceres.glb",
    scale: 0.25,
    rotationSpeed: 0.025,
  },
  Eris: {
    name: "Eris",
    modelPath: "/models/eris.glb",
    scale: 0.19,
    rotationSpeed: 0.012,
  },
  Haumea: {
    name: "Haumea",
    modelPath: "/models/haumea.glb",
    scale: 0.22,
    rotationSpeed: 0.08,
  },
  Makemake: {
    name: "Makemake",
    modelPath: "/models/makemake.glb",
    scale: 0.21,
    rotationSpeed: 0.018,
  },
  Gonggong: {
    name: "Gonggong",
    modelPath: "/models/gonggong.glb",
    scale: 0.18,
    rotationSpeed: 0.016,
  },
  Orcus: {
    name: "Orcus",
    modelPath: "/models/orcus.glb",
    scale: 0.17,
    rotationSpeed: 0.014,
  },

  // Asteroids (13)
  Vesta: {
    name: "Vesta",
    modelPath: "/models/vesta.glb",
    scale: 0.12,
    rotationSpeed: 0.025,
  },
  Pallas: {
    name: "Pallas",
    modelPath: "/models/pallas.glb",
    scale: 0.13,
    rotationSpeed: 0.018,
  },
  Juno: {
    name: "Juno",
    modelPath: "/models/juno.glb",
    scale: 0.11,
    rotationSpeed: 0.022,
  },
  Hygiea: {
    name: "Hygiea",
    modelPath: "/models/hygiea.glb",
    scale: 0.14,
    rotationSpeed: 0.019,
  },
  Astraea: {
    name: "Astraea",
    modelPath: "/models/astraea.glb",
    scale: 0.1,
    rotationSpeed: 0.021,
  },
  Apophis: {
    name: "Apophis",
    modelPath: "/models/apophis.glb",
    scale: 0.15,
    rotationSpeed: 0.026,
  },
  Bennu: {
    name: "Bennu",
    modelPath: "/models/bennu.glb",
    scale: 0.14,
    rotationSpeed: 0.024,
  },
  Itokawa: {
    name: "Itokawa",
    modelPath: "/models/itokawa.glb",
    scale: 0.13,
    rotationSpeed: 0.023,
  },
  Eros: {
    name: "Eros",
    modelPath: "/models/eros.glb",
    scale: 0.16,
    rotationSpeed: 0.027,
  },
  Psyche: {
    name: "Psyche",
    modelPath: "/models/psyche.glb",
    scale: 0.17,
    rotationSpeed: 0.025,
  },
  Varda: {
    name: "Varda",
    modelPath: "/models/varda.glb",
    scale: 0.15,
    rotationSpeed: 0.026,
  },
  "Oumuamua": {
    name: "Oumuamua",
    modelPath: "/models/oumuamua.glb",
    scale: 0.18,
    rotationSpeed: 0.035,
  },
  "Comet Halley (Core)": {
    name: "Comet Halley (Core)",
    modelPath: "/models/comet-halley.glb",
    scale: 0.19,
    rotationSpeed: 0.033,
  },
};

/**
 * Get model configuration for a celestial object
 * @param objectName - Name of the celestial object (e.g., "Earth", "Mars")
 * @returns Model configuration or null if not found
 */
export function getPlanetModelConfig(
  objectName: string
): PlanetModelConfig | null {
  return planetModelsConfig[objectName] || null;
}

/**
 * Check if a model file exists/is configured
 * @param objectName - Name of the celestial object
 * @returns True if model is configured
 */
export function hasModelConfigured(objectName: string): boolean {
  return objectName in planetModelsConfig;
}

/**
 * Get all configured models
 * @returns Array of all model configurations
 */
export function getAllModelConfigs(): PlanetModelConfig[] {
  return Object.values(planetModelsConfig);
}

/**
 * Preload all planet models for better performance
 * Call this in useEffect on app mount
 */
export function preloadAllModels(): void {
  const { preloadModel } = require("@/components/3d/PlanetModel");
  
  Object.values(planetModelsConfig).forEach((config: PlanetModelConfig) => {
    try {
      preloadModel(config.modelPath);
    } catch (error) {
      console.warn(`Failed to preload ${config.name}:`, error);
    }
  });
}

/**
 * Get model statistics
 * @returns Count of configured models by type
 */
export function getModelStats() {
  return {
    total: Object.keys(planetModelsConfig).length,
    planets: 8,
    dwarfPlanets: 7,
    asteroids: 13,
  };
}
