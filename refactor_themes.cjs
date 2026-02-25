const fs = require('fs');
const path = './src/components/ProfileModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// The regex will look for '<button' then any characters until 'data-testid="theme-switch-', then 'data-tooltip-content={...}', up to the '>'
// We need to match the entire button section, including its children, up to '</button>'
// Since Regex for nested tags is hard, we can just find 'data-tooltip-content' inside button declarations, extract them, and remove them.
// Then we wrap the button. Wait, wrapping requires knowing where the button ends.

// Let's do a simple string replacement since the structure is very consistent.
const buttons = [
    'cyberpunk', 'lcars', 'matrix', 'weyland', 'robco', 'grid', 'section9', 'outrun', 'steampunk', 'force',
    'arrakis', 'renaissance', 'klingon', 'got', 'marvel', 'dc', 'computerwelt', 'mensch-maschine', 'neon-syndicate', 'megacorp-executive'
];

for (const themeId of buttons) {
    // 1. Find the start of the button.
    const testIdStr = `data-testid="theme-switch-${themeId}"`;
    const startIdx = content.indexOf(testIdStr);
    if (startIdx === -1) {
        console.log("Not found:", themeId);
        continue;
    }

    // Backtrack to find '<button'
    const buttonStartIdx = content.lastIndexOf('<button', startIdx);

    // Find the end of the opening button tag
    const buttonOpenEndIdx = content.indexOf('>', startIdx) + 1;

    let buttonOpening = content.substring(buttonStartIdx, buttonOpenEndIdx);

    // Find tooltip content
    const tooltipMatch = buttonOpening.match(/data-tooltip-content=\{([^}]+)\}/);
    if (!tooltipMatch) {
        console.log("No tooltip found for:", themeId);
        continue;
    }

    const tooltipText = tooltipMatch[0];
    const tooltipInner = tooltipMatch[1];

    // Remove tooltip from button opening
    let newButtonOpening = buttonOpening.replace(/\s*data-tooltip-content=\{[^}]+\}/, '');

    // Wrap button opening
    let wrapperStart = `<div data-tooltip-content={${tooltipInner}} className="w-full relative">\n${newButtonOpening}`;

    // Replace opening
    content = content.substring(0, buttonStartIdx) + wrapperStart + content.substring(buttonOpenEndIdx);

    // Now we need to find the matching </button> and add </div> afterwards.
    // To do this reliably, we search forward from the NEW button open end index for </button>
    // Since there are no nested buttons inside the theme buttons, the very next </button> is the end of this button!
    const searchFrom = buttonStartIdx + wrapperStart.length;
    const buttonEndIdx = content.indexOf('</button>', searchFrom) + '</button>'.length;

    content = content.substring(0, buttonEndIdx) + '\n                                </div>' + content.substring(buttonEndIdx);

    // Also fix any transparent backgrounds
    if (themeId === 'robco') {
        content = content.replace('bg-[#001100]/80', 'bg-[#001100]');
    }
    if (themeId === 'grid') {
        content = content.replace('bg-[#020d1a]/80', 'bg-[#020d1a]');
    }
    if (themeId === 'section9') {
        content = content.replace('bg-[#0e0e12]/80', 'bg-[#0e0e12]');
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Refactored all 20 theme buttons.");
