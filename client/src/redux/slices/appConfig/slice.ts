import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppConfigInitialStateType = {
  theme: "light" | "dark";
  font: "Roboto" | "sans-serif" | "serif" | "monospace";
  accentColor: string;
  animationsEnabled: boolean;
  iconPack: "rounded" | "square";
};

const initialState: AppConfigInitialStateType = {
  theme: "light",
  font: "sans-serif",
  accentColor: "blue",
  animationsEnabled: true,
  iconPack: "rounded",
};

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState,
  reducers: {
    changeTheme: (
      state,
      action: PayloadAction<AppConfigInitialStateType["theme"]>
    ) => {
      return { ...state, theme: action.payload };
    },
    changeFont: (
      state,
      action: PayloadAction<AppConfigInitialStateType["font"]>
    ) => {
      return { ...state, font: action.payload };
    },
    changeAccentColor: (
      state,
      action: PayloadAction<AppConfigInitialStateType["accentColor"]>
    ) => {
      return { ...state, accentColor: action.payload };
    },
    toggleAnimations: (
      state,
      action: PayloadAction<AppConfigInitialStateType["animationsEnabled"]>
    ) => {
      return { ...state, animationsEnabled: action.payload };
    },
    changeIconPack: (
      state,
      action: PayloadAction<AppConfigInitialStateType["iconPack"]>
    ) => {
      return { ...state, iconPack: action.payload };
    },
  },
});

export const {
  changeTheme,
  changeFont,
  changeAccentColor,
  toggleAnimations,
  changeIconPack,
} = appConfigSlice.actions;
export default appConfigSlice.reducer;
