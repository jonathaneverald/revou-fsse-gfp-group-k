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
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzk5NTk5OSwianRpIjoiYWMzM2Y5ZmItMTM2OS00MGFiLWFhN2UtMjBlODM2ODY5OTc0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzOTk1OTk5LCJjc3JmIjoiZmRjMDQ2ZDEtM2JkNS00YTA3LTkyM2YtMjdjNjk2M2I3ZDI1IiwiZXhwIjoxNzI0MDgyMzk5fQ.ZRiNLhg3uTd1GTq1MufNUo74Cem_JWwbPy97WO4C50w"
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
				router.push("/login");
				return;
			}

			const data = await response.json();

			if (data.msg === "Token has expired") {
				removeToken();
				router.push("/login");
				return;
			}

			dispatch(setUserData(data.data));
		} catch (err) {
			router.push("/login");
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
