const useFetchProductDetail = async (slug: string, token: string) => {
	try {
		const res = await fetch(`http://127.0.0.1:5000/product/${slug}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return res.json();
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export default useFetchProductDetail;
