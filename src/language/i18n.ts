// i18n.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { useAppSelector } from './../store/hooks';

const i18n = new I18n({
  en: require('./locales/en.json'),
  ar: require('./locales/ar.json'),
  // Add other languages as needed
});

i18n.enableFallback = true;
i18n.locale = Localization.getLocales()[0].languageCode || 'ar'; // Set initial locale from device

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
  i18n.locale=langcode.toString();  
}

export default i18n;