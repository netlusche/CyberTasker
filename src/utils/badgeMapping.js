/**
 * utility to calculate the tier and title badge based on numeric user level
 */

// Max level for badge calculation. Can be expanded in the future.
export const BADGE_MAX_LEVEL = 50;

export const calculateBadge = (level) => {
    // 1. Capping: All levels above BADGE_MAX_LEVEL are treated as BADGE_MAX_LEVEL.
    const effectiveLevel = Math.min(Math.max(1, level), BADGE_MAX_LEVEL);

    // 2. Tier Calculation (1 to 5)
    // Rotates every level: Level 1 -> 1, Level 2 -> 2 ... Level 5 -> 5, Level 6 -> 1
    const tierIndex = ((effectiveLevel - 1) % 5) + 1;

    // 3. Title Calculation (1 to 10)
    // Progresses every 5 levels: Level 1-5 -> 1, Level 6-10 -> 2 ... Level 46-50 -> 10
    const titleIndex = Math.floor((effectiveLevel - 1) / 5) + 1;

    return {
        tierKey: `gamification.tier_${tierIndex}`,
        titleKey: `gamification.title_${titleIndex}`
    };
};
