import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateBadge } from '../utils/badgeMapping';

const LevelBar = ({ level, currentXP, totalXPForLevel, isLevelUp }) => {
    const { t } = useTranslation();
    // Simple calculation: progress = (currentXP % 100) assuming fixed 100XP per level or passed totalXP
    // For this simplified version: let's assume levels are every 100 XP.
    const progress = (currentXP % 100);

    // Calculate Game-Badge Tier and Title
    const safeLevel = level || 1;
    const { tierKey, titleKey } = calculateBadge(safeLevel);

    // Strip bracket context meant only for translators (e.g. "Novice [Skill Level]" -> "Novice")
    const displayTier = t(tierKey).replace(/\s*\[.*?\]\s*/g, '').trim();
    const displayTitle = t(titleKey).replace(/\s*\[.*?\]\s*/g, '').trim();

    return (
        <div className={`w-full mb-6 p-4 rounded-lg bg-cyber-dark border transition-all duration-500 lvl-bar-container ${isLevelUp ? 'border-cyber-secondary shadow-cyber-secondary scale-105' : 'border-cyber-secondary shadow-cyber-secondary'}`}>
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-2 gap-2">
                <div>
                    <span className="text-xs text-gray-300 uppercase tracking-widest">{t('dashboard.operator_level', 'Operator Level')}</span>
                    <div className="text-3xl font-bold text-white font-mono leading-none animate-pulse whitespace-nowrap mb-1">
                        {isLevelUp ? t('dashboard.level_up', 'LEVEL UP!') : `${t('dashboard.lvl_prefix', 'LVL')} ${level}`}
                    </div>
                    {/* Gamification Badge */}
                    <div className="text-cyber-primary text-sm font-bold tracking-widest uppercase">
                        {displayTier} {displayTitle}
                    </div>
                </div>
                <div className="text-left sm:text-right mt-1 sm:mt-0 w-full sm:w-auto">
                    <span className="text-cyber-secondary font-bold text-xl xp-text">{currentXP}</span>
                    <span className="text-gray-300 text-sm"> {t('dashboard.xp_total', 'XP Total')}</span>
                </div>
            </div>

            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-secondary to-cyber-primary transition-all duration-1000 ease-out xp-progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
                {/* Striped overlay for cyberpunk effect */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
            </div>
            <div className="text-right text-[10px] text-gray-500 mt-1 font-mono tracking-wider break-words w-full overflow-hidden">
                {t('dashboard.next_rank_required', { xp: 100 - progress, defaultValue: `NEXT RANK: ${100 - progress} XP REQUIRED` })}
            </div>
        </div>
    );
};

export default LevelBar;
