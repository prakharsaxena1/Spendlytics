import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppConfigInitialStateType = {
  theme: "light" | "dark";
  font: "sans-serif" | "serif";
};

const initialState: AppConfigInitialStateType = {
  theme: "light",
  font: "sans-serif",
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
  },
});

export const { changeTheme, changeFont } = appConfigSlice.actions;
export default appConfigSlice.reducer;
