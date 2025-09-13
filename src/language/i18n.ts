import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
// import { useAppSelector } from './../store/hooks';
import { I18nManager } from 'react-native';

const i18n = new I18n({
  en: require('./locales/en.json'),
  ar: require('./locales/ar.json'),
  // Add other languages as needed
});

// Set the locale based on the device's locale
const deviceLanguage = Localization.getLocales()[0].languageCode || 'ar'; // Set initial locale from device
i18n.locale = deviceLanguage;

// Enable fallback to default locale if a specific translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'ar'; // Set a default locale

// Set RTL layout for the entire app if the current locale is RTL
const isRTL = deviceLanguage == 'ar';
// I18nManager.forceRTL(isRTL);
I18nManager.allowRTL(true); // Allow RTL for the app

// Set the locale based on the user's device preferences
// const { locale, isRTL } = Localization.getLocales()[0]; // Get the first preferred locale

// const currentLanguage = () => { 
//   const language = useAppSelector((state) => state.language.currentLanguage);
//   return language;
// }
// const language: string = currentLanguage();
// i18n.locale = language;

// const handleCurrentLanguage = () => { 
//   const language = useAppSelector((state) => state.language.currentLanguage);
//   i18n.locale = language;
//   return ;
// }
// handleCurrentLanguage();

export const updateLocale = async (langcode: string) => {
  i18n.locale = langcode.toString();
};

export default i18n;