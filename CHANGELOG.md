# Changelog

All notable changes to Legends of the Arena will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-01-09

### Added - Major Features
- **10 Character Classes**: Balanced, Warrior, Tank, Glass Cannon, Bruiser, Mage, Assassin, Berserker, Paladin, Necromancer
- **Story Mode**: 25-mission campaign across 5 unique regions with star rating system
- **Gold Economy**: Currency system for buying, selling, and upgrading equipment
- **Marketplace System**: 
  - Equipment shop with rotating inventory (refreshes every 24 hours)
  - Force refresh option for 100 gold
  - Consumables shop for health and mana potions
  - Repair shop for damaged equipment
  - Sell tab for unwanted items
- **Equipment Durability**: Items degrade with use and require repairs
- **22 New Achievements**: For story mode completion and marketplace activities
- **Class-Specific Equipment**: Items with class requirements and compatibility indicators
- **Enhanced Profile Stats**: Comprehensive statistics tracking across all game modes

### Added - UI/UX Improvements
- Victory screen now has "Close & View Logs" button to review combat details
- Marketplace shows class compatibility indicators (✅/❌) for all items
- Story mode mission results with manual navigation button
- Class requirement badges with icons and color coding
- Duplicate item handling in sell tab
- Force refresh button in marketplace header

### Fixed
- Duplicate equipped items now show correctly in sell tab
- Selling items no longer refreshes the entire page
- Mission completion properly tracks player state
- Fighter class flags now persist correctly
- Curly quote syntax errors in data files
- Equipment durability calculations

### Changed
- Game rebranded from "ObjectFighterJS" to "Legends of the Arena"
- Version bumped from 3.x to 4.0.0
- Main menu buttons made smaller for better mobile display
- Equipment Manager renamed to use consistent naming
- Improved event handling with preventDefault/stopPropagation

### Technical
- Centralized game configuration in `GameConfig`
- Created comprehensive character class system with passive abilities
- Integrated achievement tracking across all systems
- Enhanced save system with new stats fields
- Improved Web Component architecture

## [3.0.0] - Previous Version

### Added
- Tournament Mode with bracket system
- Achievement System (22 achievements)
- Equipment System with rarity tiers
- Character progression and leveling
- Skill system with cooldowns
- Status effects and buffs/debuffs

### Changed
- Refactored combat system
- Improved UI design
- Enhanced save management

## [2.0.0] - Earlier Version

### Added
- Team battle mode
- Equipment drops
- Profile screen
- Settings system

## [1.0.0] - Initial Release

### Added
- Basic single combat system
- Character creation
- Turn-based combat
- Basic stats tracking

---

## Version History

- **4.0.0** - Story Mode, Marketplace, Classes Update
- **3.0.0** - Tournament & Achievement Update
- **2.0.0** - Team Battle & Equipment Update  
- **1.0.0** - Initial Release

[4.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v4.0.0
[3.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v3.0.0
[2.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v2.0.0
[1.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v1.0.0
