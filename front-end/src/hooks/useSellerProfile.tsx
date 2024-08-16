import useSWR from "swr";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import axios from "axios";
import { getToken } from "@/utils/tokenUtils";
import { setSellerProfileData, setSellerProfileLoading, setSellerProfileError } from "../store/sellerProfileSlice";
import { SellerProfile } from "@/types/seller";

const fetcher = async (url: string) => {
	const token = getToken();
	const response = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.data;
};

const useSellerProfile = () => {
	const dispatch = useAppDispatch();
	const { data: sellerProfile, loading, error } = useAppSelector((state) => state.sellerProfile);

	const { data, error: swrError } = useSWR<SellerProfile>("http://127.0.0.1:5000/seller-profile", fetcher);

	useEffect(() => {
		if (!data && !swrError) {
			dispatch(setSellerProfileLoading(true));
		}

		if (data) {
			dispatch(setSellerProfileData(data));
		}

		if (swrError) {
			dispatch(setSellerProfileError(swrError.message));
		}
	}, [data, swrError, dispatch]);

	return { sellerProfile, isLoading: loading, isError: error };
};

export default useSellerProfile;
