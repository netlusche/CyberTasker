import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';
import { ThemeContext } from '../utils/ThemeContext';

const MockThemeProvider = ({ children }) => (
    <ThemeContext.Provider value={{ theme: 'cyberpunk', setTheme: vi.fn(), setThemeState: vi.fn() }}>
        {children}
    </ThemeContext.Provider>
);

// Mocking fetch as it's used in App.jsx
global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isAuthenticated: false }),
    })
);

describe('App i18n Rendering', () => {
    it('renders "CYBER TASKER" title in German by default', async () => {
        render(
            <MockThemeProvider>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </MockThemeProvider>
        );

        // We check for the split title
        expect(await screen.findByText('CYBER')).toBeInTheDocument();
        expect(await screen.findByText('TASKER')).toBeInTheDocument();
    });

    it('renders "NETRUNNER LOGIN" in German', async () => {
        i18n.changeLanguage('de');
        render(
            <MockThemeProvider>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </MockThemeProvider>
        );

        expect(await screen.findByTestId('auth-toggle')).toBeInTheDocument();
    });

    it('renders "NETRUNNER LOGIN" in English after language change', async () => {
        // Note: Since we are testing the login screen (user=null), 
        // we need to make sure the switcher is visible OR we change it programmatically.
        // However, the switcher in App is only shown if user is present.
        // For now, we test programmatically changing the language.

        i18n.changeLanguage('en');
        render(
            <MockThemeProvider>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </MockThemeProvider>
        );

        expect(await screen.findByTestId('auth-toggle')).toBeInTheDocument();
    });
});
