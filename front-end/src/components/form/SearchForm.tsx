import { LoaderCircle, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/router";

const SearchForm: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setDebouncedSearchTerm(searchTerm);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			const isProductsPage = router.pathname === "/products";
			const query = isProductsPage ? { ...router.query } : {};

			if (debouncedSearchTerm) {
				query.product_name = debouncedSearchTerm;
			} else {
				delete query.product_name;
			}

			router.push({
				pathname: "/products",
				query,
			});

			setLoading(false);
		}, 1000);

		return () => {
			clearTimeout(handler);
		};
	}, [debouncedSearchTerm, router.pathname]);

	return (
		<form onSubmit={handleSubmit} className="ml-auto flex-1 sm:flex-initial">
			<div className="relative">
				{loading ? (
					<LoaderCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
				) : (
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				)}
				<Input
					type="search"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Search products..."
					disabled={loading}
					className="pl-8 rounded-full focus:outline-none sm:w-[300px] md:w-[200px] lg:w-[300px]"
				/>
			</div>
		</form>
	);
};

export default SearchForm;
