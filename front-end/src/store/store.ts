import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sellerProfileReducer from "./sellerProfileSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		sellerProfile: sellerProfileReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
