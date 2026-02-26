import i18n from '../i18n';

let csrfToken = null;

export const setCsrfToken = (token) => {
    csrfToken = token;
};

export const apiFetch = async (url, options = {}) => {
    let lang = i18n.language || localStorage.getItem('i18nextLng') || 'en';
    if (lang.includes('-')) lang = lang.split('-')[0];

    const headers = {
        'X-App-Language': lang,
        ...options.headers,
    };

    if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken;
        } else {
            console.warn('apiFetch: Perform state-changing request without CSRF token.');
        }
    }

    return fetch(url, { ...options, headers });
};
