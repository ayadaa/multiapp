  // store/languageSlice.js
  import { createSlice } from '@reduxjs/toolkit';
  import i18n from '../../language/i18n'; // Import your i18n instance

  const initialState = {
    currentLanguage: i18n.locale,
  };

  export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
      setLanguage: (state, action) => {
        state.currentLanguage = action.payload;
        i18n.locale = action.payload; // Update i18n-js locale
      },
    },
  });

  export const { setLanguage } = languageSlice.actions;
  export default languageSlice.reducer;