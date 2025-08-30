import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthApis, type UserType } from "../../services/auth";

export type AppConfigInitialStateType = UserType["appearanceSettings"];

const initialState: AppConfigInitialStateType = {
  theme: "light",
  fontFamily: "sans-serif",
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
      action: PayloadAction<AppConfigInitialStateType["fontFamily"]>
    ) => {
      return { ...state, fontFamily: action.payload };
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
    setInitialConfig: (
      state,
      action: PayloadAction<AppConfigInitialStateType>
    ) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        AuthApis.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (payload.user.appearanceSettings) {
            return { ...state, ...payload.user.appearanceSettings };
          }
          return state;
        }
      )
      .addMatcher(
        AuthApis.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          if (payload.user.appearanceSettings) {
            return { ...state, ...payload.user.appearanceSettings };
          }
          return state;
        }
      )
      .addMatcher(
        AuthApis.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          if (payload.user.appearanceSettings) {
            return { ...state, ...payload.user.appearanceSettings };
          }
          return state;
        }
      );
  },
});

export const {
  changeTheme,
  changeFont,
  changeAccentColor,
  toggleAnimations,
  changeIconPack,
  setInitialConfig,
} = appConfigSlice.actions;
export default appConfigSlice.reducer;
