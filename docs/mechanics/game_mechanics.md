
# Game Mechanics

## Discovery System

### Planet Discovery (Sequential)
Players discover planets in order: Mercury → Venus → Earth → Mars → Jupiter → Saturn → Uranus → Neptune.

**Token Rewards:**
| Planet | Reward | Cumulative |
|--------|--------|-----------|
| Mercury | 10 STAR | 10 |
| Venus | 15 STAR | 25 |
| Earth | 20 STAR | 45 |
| Mars | 25 STAR | 70 |
| Jupiter | 50 STAR | 120 |
| Saturn | 75 STAR | 195 |
| Uranus | 100 STAR | 295 |
| Neptune | 150 STAR | 445 |

### Dwarf Planets (Unlock Required)
Cost: 200 STAR burn per unlock

| Dwarf Planet | Reward | Passive Rate |
|-------------|--------|--------------|
| Pluto | 200 STAR | 0.75/hr |
| Ceres | 180 STAR | 0.75/hr |
| Eris | 220 STAR | 0.75/hr |
| Haumea | 190 STAR | 0.75/hr |
| Makemake | 210 STAR | 0.75/hr |

### Asteroids
7+ types with rarity-based rewards (30-75 STAR) and passive income (0.1-0.5 STAR/hr).

## NFT System

### Minting
- **Cost**: 0.1-0.15 TON gas fee OR 75 STAR (Celestial Shield utility)
- **Benefit**: Passive income generation begins immediately
- **Ownership**: Permanent blockchain record

### Set Bonuses
- **Inner Planets** (4): +25 STAR one-time
- **Outer Planets** (4): +50 STAR one-time  
- **Complete Set** (8): +100 STAR one-time

## Daily Login System
- **Base**: 10 STAR/day
- **7-day streak**: +25 STAR bonus
- **30-day streak**: +100 STAR bonus

## Implementation Status
✅ Discovery system working  
✅ NFT data structure complete  
⚠️ Daily login needs UI button  
⚠️ Set bonuses calculated but not distributed  
❌ Dwarf planet unlock mechanism pending

**See:** [API Guide](../api/api_guide.md) for backend integration
