import { createI18n } from 'vue-i18n'

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
    const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages = {};
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key).default;
        }
    })
    return messages;
}

function checkDefaultLanguage() {
    let matched = null;
    let languages = loadLocaleMessages();
    Object.getOwnPropertyNames(languages).forEach(lang => {
        if (lang === navigator.language) {
            matched = lang;
        }
    });
    if (!matched) {
        let languagePartials = navigator.language.split('-')[0].toLowerCase()
        Object.getOwnPropertyNames(languages).forEach(lang => {
            if (lang === languagePartials) {
                matched = lang;
            }
        })
    }
    return matched;
}

export const selectedLocale = checkDefaultLanguage() || process.env.EGI_ISM_LOCALE || 'en';
export const languages = Object.getOwnPropertyNames(loadLocaleMessages());
export const languageNames = { en: "English", it: "Italiano" };
export default createI18n({
    locale: selectedLocale,
    fallbackLocale: process.env.EGI_ISM_FALLBACK_LOCALE || 'it',
    messages: loadLocaleMessages()
})