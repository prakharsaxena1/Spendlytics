import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppConfigInitialStateType = {
  theme: "light" | "dark";
};

const initialState: AppConfigInitialStateType = {
  theme: "light",
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
  },
});

export const { changeTheme } = appConfigSlice.actions;
export default appConfigSlice.reducer;
