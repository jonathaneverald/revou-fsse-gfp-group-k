import useSWR from "swr";
import { useRouter } from "next/router";
import { User } from "@/types/user";
import { getToken, setToken } from "@/utils/tokenUtils";

const useUserProfile = () => {
	const router = useRouter();

	const fetcher = async (url: string) => {
		setToken(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzE4OTcyOCwianRpIjoiMDQ4NjJiOTctM2YxOC00NTU0LTljOGMtNGUxNjRlMWJkYjRmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzMTg5NzI4LCJjc3JmIjoiODIxOWI2OGYtNDcxYy00NzY1LWJlNmUtNWQ5ZjZjNGYyOGYzIiwiZXhwIjoxNzIzMTkzMzI4fQ.D1Fk8YTYGXRo1Hj2esyrZ-E55y6u7RebCl9f79E3wgA"
		);
		const token = getToken();

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			router.push("/");
		}

		const data = await response.json();

		if (data.msg == "Token has expired") {
			router.push("/");
		}

		return data.data;
	};

	// const fetcher = async (url: string) => {
	// 	await new Promise((resolve) => setTimeout(resolve, 5000));
	// 	const response = await fetch(url);
	// 	return response.json();
	// };

	const { data: user, error } = useSWR<User>("http://127.0.0.1:5000/profile", fetcher);

	return { user, error, isLoading: !error && !user };
};

export default useUserProfile;
