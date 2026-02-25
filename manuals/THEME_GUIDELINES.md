# CyberTasker Theme Guidelines

This document defines the rules, variables, and structural standards for creating and maintaining themes within the CyberTasker ecosystem.

## 1. The Core Variable System

Every theme MUST define the following CSS variables inside a specific `.theme-[name]` block in `src/index.css`. **Do not use hardcoded HEX or RGB colors in your React components.**

### Essential Palette
- `--theme-bg`: The main background color of the application.
- `--theme-surface`: Background color for panels and secondary distinct areas.
- `--theme-border`: Default border color.
- `--theme-primary`: The primary branding color, used for active states, borders, and main buttons.
- `--theme-secondary`: The secondary accent color.
- `--theme-accent`: Third-level accent color.
- `--theme-card`: Background color for highly elevated elements like cards or the directive dossier (usually `rgba(..., 0.8)`).

### Status Colors
- `--theme-success`: Green equivalent (used for completion/success).
- `--theme-warning`: Yellow/Orange equivalent (used for medium priority/warnings).
- `--theme-danger`: Red equivalent (used for overdue tasks/destructive actions).
- `--theme-info`: Blue equivalent (used for informational highlights).

### Typography & Extras
- `--theme-text`: The primary text color (e.g., `#ffffff` for dark themes).
- `--theme-font`: The primary font-family used across the app (e.g., `'Courier New', monospace`).
- `--theme-radius`: The border-radius for buttons and cards (e.g., `0.5rem` or `0rem` for blocky themes).

### Shadows (Glows)
- `--shadow-primary`: `0 0 10px var(--theme-primary)` etc.
- `--shadow-secondary`: Used for secondary glowing elements.
- `--shadow-accent`: Used for accent glowing elements.

*(Note: These `--theme-` variables are internally mapped to Tailwind's colors via the `@theme` directive at the bottom of `index.css`, giving React components access to classes like `bg-cyber-primary` and `text-cyber-danger`.)*

## 2. Component Implementation Rules

1. **No Hardcoded Colors in JSX:** You must NEVER write `style={{ backgroundColor: '#ff0000' }}` or Tailwind classes like `bg-[#ff0000]` in a `.jsx` file.
2. **Use Tailwind Context:** CyberTasker extends Tailwind in `tailwind.config.js` to map these CSS variables to Tailwind utility classes (e.g., `bg-cyber-primary`, `text-cyber-danger`, `border-cyber-secondary`).
4. **Borders & Shadows:** The signature CyberTasker look relies heavily on glowing borders. The framework provides classes like `shadow-cyber-primary`. In your theme definition in `index.css`, you control the intensity of this shadow via the `--shadow-primary` variable.

## 3. Creating a New Theme

To add a new theme (e.g., "Mensch-Maschine"):

1. **Define the CSS:** Add `.theme-mensch-maschine { ... }` to `src/index.css` defining all variables listed in section 1.
2. **Register the Key:** Add the translation key (e.g., `"mensch-maschine": "Mensch-Maschine"`) to `public/locales/en/translation.json` under `profile.themes`.
3. **Register in Context:** Update the `themes` array in `src/utils/ThemeContext.jsx` with the new theme ID.
4. **Create a Profile UI Card:** Edit `src/components/ProfileModal.jsx` to render a selectable card for the new theme, including a visually appropriate SVG icon that matches the aesthetic.
5. **Ensure Legibility:** When creating a new theme, the readability of all UI elements with labels/text must be guaranteed. Pay special attention to contrast on hover states, form inputs, and buttons.
6. **Run the Checks:** Execute `npm run check:all` to ensure no validation scripts fail.

## 4. Light Mode vs. Dark Mode Considerations

While CyberTasker is rooted in a Dark Mode (Cyberpunk) aesthetic, it is **NOT** exclusively limited to dark themes.

- **Universal Legibility:** For **ALL** themes, the readability of all texts and UI controls must be strictly ensured.
- **Light Themes (like *Megacorp Executive*):**
  - `--theme-text` must become a dark color (e.g., `#111827`).
  - `--theme-bg` becomes white or very light gray.
  - **Contrast on Controls:** This legibility rule naturally applies to light themes as well. If dark controls (like bold buttons) appear in a light theme, the text on those controls must be correspondingly lighter to ensure high contrast and readability.
  - Watch out for glowing shadows. Light mode shadows should be subtle drop-shadows rather than vibrant neon glows. Adjust the `--shadow-[x]` variables to use darker, more opaque alphas instead of bright neon glows.
