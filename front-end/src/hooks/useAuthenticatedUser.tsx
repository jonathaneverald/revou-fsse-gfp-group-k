import { useRouter } from "next/router";
import { User } from "@/types/user";
import { getToken, removeToken, setToken } from "@/utils/tokenUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setUserData, setLoading, setError } from "../store/userSlice";
import { useEffect, useCallback, useRef } from "react";

const useUserProfile = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: user, loading, error } = useAppSelector((state) => state.user);
	const fetchedRef = useRef(false);

	const fetchUserData = useCallback(async () => {
		if (fetchedRef.current) return;
		fetchedRef.current = true;

		dispatch(setLoading(true));
		try {
			if (!getToken()) {
				setToken(
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzk5NjA5MCwianRpIjoiMGI4OWZhOTAtMmM1ZS00MjE5LTk5NDgtNmUyZmYzYjc0ZGU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzOTk2MDkwLCJjc3JmIjoiMDU4OWE4NjktNTc2YS00ODc4LTg2ODItNTFjOGY4YzE1YmFmIiwiZXhwIjoxNzI0MDgyNDkwfQ.116uMc_RZtwyH9f3Gii2aJqk5vLVEN5FpoyYt6ARC4o"
				);
			}

			const token = getToken();

			const response = await fetch("http://127.0.0.1:5000/profile", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				removeToken();
				console.log(response);
				return;
			}

			const data = await response.json();

			if (data.msg === "Token has expired") {
				removeToken();
				console.log(data);
				return;
			}

			dispatch(setUserData(data.data));
		} catch (err) {
			console.log(err);
		} finally {
			dispatch(setLoading(false));
		}
	}, [dispatch, router]);

	useEffect(() => {
		if (!loading && !user) {
			fetchUserData();
		}
	}, [loading, user]);

	return { user: user as User, error, isLoading: loading };
};

export default useUserProfile;
