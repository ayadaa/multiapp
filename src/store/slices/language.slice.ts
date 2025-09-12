import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../language/i18n'; // Import your i18n instance
import { I18nManager } from 'react-native';
import { Restart } from 'fiction-expo-restart';

const initialState = {
  currentLanguage: i18n.locale,
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      i18n.locale = action.payload; // Update i18n-js locale
      // Set RTL layout for the entire app if the current locale is RTL
      const isRTL = action.payload == 'ar';
      I18nManager.forceRTL(isRTL);
      Restart();
    }
  }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
