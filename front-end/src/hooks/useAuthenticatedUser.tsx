import { useRouter } from "next/router";
import { User } from "@/types/user";
import { getToken, removeToken, setToken } from "@/utils/tokenUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setUserData, setLoading, setError } from "../store/userSlice";
import { useEffect, useCallback } from "react";

const useUserProfile = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: user, loading, error } = useAppSelector((state) => state.user);

	const fetchUserData = useCallback(async () => {
		dispatch(setLoading(true));
		try {
			if (!getToken()) {
				setToken(
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzc0MjQ2NSwianRpIjoiNmQzMzNmMjktMDM4Yy00MDIyLTg5ZjctMzY2NDk4Y2E0NDUxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzNzQyNDY1LCJjc3JmIjoiOGEzNmUzODQtODdjNS00NmJlLWE2NjItNzNlNTkwYTRlY2JiIiwiZXhwIjoxNzIzODI4ODY1fQ.WxitKHQVXtTnjEWC9hntfKRttp7ZLSkJJsuXQ61gWts"
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
				router.push("/");
				return;
			}

			const data = await response.json();

			if (data.msg === "Token has expired") {
				removeToken();
				router.push("/");
				return;
			}

			dispatch(setUserData(data.data));
		} catch (err) {
			router.push("/");
		} finally {
			dispatch(setLoading(false));
		}
	}, [dispatch, router]);

	useEffect(() => {
		if (!loading && !user) {
			fetchUserData();
		}
	}, [fetchUserData, loading, user]);

	return { user: user as User, error, isLoading: loading };
};

export default useUserProfile;
