import { Loader, Search } from "lucide-react";
import React, { useState, useCallback, useRef } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/router";

const SearchForm: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setIsLoading(true);

			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			debounceTimeout.current = setTimeout(() => {
				setIsLoading(true);

				const isProductsPage = router.pathname === "/products";
				const query = isProductsPage ? { ...router.query } : {};

				if (searchTerm) {
					query.product_name = searchTerm;
				} else {
					delete query.product_name;
				}

				router
					.push({
						pathname: "/products",
						query,
					})
					.finally(() => {
						setIsLoading(false);
					});
			}, 1000);
		},
		[searchTerm, router]
	);

	return (
		<form onSubmit={handleSubmit} className="ml-auto flex-1 sm:flex-initial">
			<div className="relative">
				<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Search products..."
					className="pl-8 focus:outline-none sm:w-[300px] md:w-[200px] lg:w-[300px]"
					disabled={isLoading}
				/>
				{isLoading && <Loader className="animate-spin absolute right-2.5 top-3 h-4 w-4 " />}
			</div>
		</form>
	);
};

export default SearchForm;
