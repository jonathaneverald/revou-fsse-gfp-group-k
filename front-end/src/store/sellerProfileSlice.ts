import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SellerProfile } from "@/types/seller";

interface SellerProfileState {
	data: SellerProfile | null;
	loading: boolean;
	error: string | null;
}

const initialState: SellerProfileState = {
	data: null,
	loading: false,
	error: null,
};

const sellerProfileSlice = createSlice({
	name: "sellerProfile",
	initialState,
	reducers: {
		setSellerProfileData: (state, action: PayloadAction<SellerProfile>) => {
			state.data = action.payload;
			state.loading = false;
			state.error = null;
		},
		setSellerProfileLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setSellerProfileError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const { setSellerProfileData, setSellerProfileLoading, setSellerProfileError } = sellerProfileSlice.actions;

export default sellerProfileSlice.reducer;
