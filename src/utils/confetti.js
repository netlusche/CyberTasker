import confetti from 'canvas-confetti';

export const triggerNeonConfetti = (theme = 'cyberpunk') => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    const colorMap = {
        'lcars': ['#33cc99', '#ffcc33', '#dd4444', '#ff7700'],
        'matrix': ['#00ff41', '#008f11', '#003b00', '#ffffff'],
        'weyland': ['#ffb000', '#cc8400', '#885500', '#ffcc00'],
        'robco': ['#14ff00', '#009900', '#33ff33', '#003b00'],
        'grid': ['#00f3ff', '#0077ff', '#ffffff', '#00ffff'],
        'section9': ['#ff3300', '#cc0000', '#ff9900', '#ffffff'],
        'outrun': ['#ff00ff', '#00ffff', '#ffb800', '#ff00aa'],
        'steampunk': ['#d4af37', '#b87333', '#8b4513', '#ffd700'],
        'force': ['#00bfff', '#ff3333', '#33ff33', '#ffffff'],
        'arrakis': ['#ff9933', '#cc6600', '#ffd700', '#8b4513'],
        'klingon': ['#ff0000', '#990000', '#c0c0c0', '#ffffff'],
        'got': ['#8cb8cc', '#ffffff', '#c0392b', '#111a24'],
        'marvel': ['#e62429', '#f0e442', '#ffffff', '#005ce6'],
        'dc': ['#005ce6', '#ffcc00', '#d9d9e6', '#cc0000']
    };

    const colors = colorMap[theme] || ['#00ffff', '#ff00ff', '#39ff14'];

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
            colors: colors,
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
