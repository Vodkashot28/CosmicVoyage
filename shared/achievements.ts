/**
 * Achievement System
 * Define all player achievements and milestone tracking
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "discovery" | "earning" | "burning" | "prestige" | "collection";
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  reward?: {
    star?: number;
    title?: string;
  };
}

export interface PlayerStats {
  totalDiscovered: number;
  totalNFTsMinted: number;
  totalStarEarned: number;
  totalStarBurned: number;
  maxPassiveIncomeStreak: number;
  immortalityScore: number;
  currentImmortalityTier: string;
  playTime: number; // hours
  referralCount: number;
  setBonusesAchieved: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Discovery Achievements
  {
    id: "first_planet",
    name: "Cosmic Explorer",
    description: "Discover your first planet",
    category: "discovery",
    icon: "🌍",
    condition: (stats) => stats.totalDiscovered >= 1,
  },
  {
    id: "inner_planets",
    name: "Inner System Master",
    description: "Discover all 4 inner planets (Mercury, Venus, Earth, Mars)",
    category: "discovery",
    icon: "🪨",
    condition: (stats) => stats.totalDiscovered >= 4,
  },
  {
    id: "all_main_planets",
    name: "Solar System Navigator",
    description: "Discover all 8 main planets",
    category: "discovery",
    icon: "🌌",
    condition: (stats) => stats.totalDiscovered >= 8,
  },
  {
    id: "dwarf_planet_hunter",
    name: "Dwarf Planet Hunter",
    description: "Discover all 7 dwarf planets",
    category: "discovery",
    icon: "💫",
    condition: (stats) => stats.totalDiscovered >= 15,
  },
  {
    id: "complete_celestial",
    name: "Complete Celestial Master",
    description: "Discover all 28 celestial objects",
    category: "discovery",
    icon: "⭐",
    condition: (stats) => stats.totalDiscovered >= 28,
  },

  // NFT Collection Achievements
  {
    id: "first_nft",
    name: "NFT Collector",
    description: "Mint your first planet NFT",
    category: "collection",
    icon: "🎨",
    condition: (stats) => stats.totalNFTsMinted >= 1,
  },
  {
    id: "planet_collection",
    name: "Planetary Collector",
    description: "Own 8 planet NFTs",
    category: "collection",
    icon: "🪐",
    condition: (stats) => stats.totalNFTsMinted >= 8,
  },
  {
    id: "elite_collection",
    name: "Elite Collector",
    description: "Own 20 NFTs across planets and dwarfs",
    category: "collection",
    icon: "👑",
    condition: (stats) => stats.totalNFTsMinted >= 20,
  },

  // Earning Achievements
  {
    id: "first_passive",
    name: "Passive Income Earner",
    description: "Claim passive income from NFT holdings",
    category: "earning",
    icon: "💰",
    condition: (stats) => stats.totalStarEarned >= 1,
  },
  {
    id: "thousand_star",
    name: "Thousand STAR Club",
    description: "Earn 1,000 STAR tokens",
    category: "earning",
    icon: "💎",
    condition: (stats) => stats.totalStarEarned >= 1000,
  },
  {
    id: "hundred_thousand_star",
    name: "Hundred Thousand Star Club",
    description: "Earn 100,000 STAR tokens",
    category: "earning",
    icon: "👑",
    condition: (stats) => stats.totalStarEarned >= 100000,
  },
  {
    id: "daily_login_week",
    name: "Dedicated Player",
    description: "Maintain 7-day daily login streak",
    category: "earning",
    icon: "🔥",
    condition: (stats) => stats.maxPassiveIncomeStreak >= 7,
  },

  // Burning Achievements
  {
    id: "first_burn",
    name: "Token Burner",
    description: "Burn your first STAR token",
    category: "burning",
    icon: "🔥",
    condition: (stats) => stats.totalStarBurned >= 1,
  },
  {
    id: "refinement_collector",
    name: "Refinement Master",
    description: "Burn 500 STAR on refinements",
    category: "burning",
    icon: "✨",
    condition: (stats) => stats.totalStarBurned >= 500,
  },
  {
    id: "utility_power",
    name: "Cosmic Utility Master",
    description: "Burn 2,000 STAR on cosmic utilities",
    category: "burning",
    icon: "⚡",
    condition: (stats) => stats.totalStarBurned >= 2000,
  },

  // Prestige Achievements
  {
    id: "burning_soul",
    name: "Burning Soul",
    description: "Achieve 'Burning Soul' immortality tier",
    category: "prestige",
    icon: "🔥",
    condition: (stats) =>
      stats.immortalityScore >= 501 && stats.immortalityScore < 2001,
  },
  {
    id: "stellar_collector",
    name: "Stellar Collector",
    description: "Achieve 'Stellar Collector' immortality tier",
    category: "prestige",
    icon: "💫",
    condition: (stats) =>
      stats.immortalityScore >= 2001 && stats.immortalityScore < 10001,
  },
  {
    id: "immortal_collector",
    name: "Immortal Collector",
    description: "Achieve 'Immortal Collector' status",
    category: "prestige",
    icon: "👑",
    condition: (stats) =>
      stats.immortalityScore >= 10001 && stats.immortalityScore < 50001,
  },
  {
    id: "cosmic_deity",
    name: "Cosmic Deity",
    description: "Achieve the highest 'Cosmic Deity' tier",
    category: "prestige",
    icon: "⭐",
    condition: (stats) => stats.immortalityScore >= 50001,
  },
];

/**
 * Get all achievements unlocked for player stats
 */
export function getUnlockedAchievements(stats: PlayerStats): Achievement[] {
  return ACHIEVEMENTS.filter((ach) => ach.condition(stats));
}

/**
 * Get progress towards next achievement
 */
export function getNextAchievements(
  stats: PlayerStats,
  category?: string
): Achievement[] {
  const unlocked = new Set(getUnlockedAchievements(stats).map((a) => a.id));
  return ACHIEVEMENTS.filter(
    (ach) =>
      !unlocked.has(ach.id) &&
      (!category || ach.category === category)
  );
}

/**
 * Calculate achievement completion percentage
 */
export function getAchievementProgress(stats: PlayerStats): number {
  const unlocked = getUnlockedAchievements(stats);
  return (unlocked.length / ACHIEVEMENTS.length) * 100;
}
