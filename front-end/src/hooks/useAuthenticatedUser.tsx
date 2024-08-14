import { useRouter } from "next/router";
import { User } from "@/types/user";
import { getToken, setToken } from "@/utils/tokenUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setUserData, setLoading, setError } from "../store/userSlice";
import { useEffect } from "react";

const useUserProfile = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: user, loading, error } = useAppSelector((state) => state.user);

	useEffect(() => {
		const fetchUserData = async () => {
			dispatch(setLoading(true));
			try {
				setToken(
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzYyNDEzOCwianRpIjoiMDRlNmI3MWYtOGZkZi00ODQyLWIxY2EtNzllOWRhNjIyOTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzNjI0MTM4LCJjc3JmIjoiNjk4NGMwZDAtODc1OC00MThjLWE1MmItZmYxMmVjNDM5NWYwIiwiZXhwIjoxNzIzNzEwNTM4fQ.i-X8XlGRL9U8SDv3N7uOVtwXdRfqzx_cCAylOhCnqEY"
				);
				const token = getToken();

				const response = await fetch("http://127.0.0.1:5000/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();

				if (data.msg === "Token has expired") {
					throw new Error("Token has expired");
				}

				dispatch(setUserData(data.data));
			} catch (err) {
				if (err instanceof Error) {
					dispatch(setError(err.message));
				} else {
					dispatch(setError("An unknown error occurred"));
				}
				router.push("/");
			}
		};

		fetchUserData();
	}, [dispatch, router]);

	return { user: user as User, error, isLoading: loading };
};

export default useUserProfile;
