import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductCard from "../card/ProductCard";
import { Product } from "@/types/product";
import useFetchProducts from "@/hooks/useFetchProducts";
import ProductCartLoading from "../loading/ProductCartLoading";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

const ProductList = () => {
	const router = useRouter();
	const { category, location, product_name, page = 1, per_page = 12 } = router.query;

	const [currentPage, setCurrentPage] = useState<number>(Number(page));

	const { products, isLoading, isError } = useFetchProducts({
		page: currentPage,
		per_page: Number(per_page),
		category: category as string,
		location: location as string,
		product_name: product_name as string,
	});

	useEffect(() => {
		if (Number(page) !== currentPage) {
			setCurrentPage(Number(page));
		}
	}, [page]);

	useEffect(() => {
		if (Number(page) !== currentPage) {
			router.push({
				pathname: router.pathname,
				query: { ...router.query, page: currentPage },
			});
		}
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
				<ProductCartLoading />
			</div>
		);
	}

	if (isError) {
		return <p>Failed to load products</p>;
	}

	const { total_pages, next_page, prev_page } = products.pagination;

	return (
		<div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
				{products.data.map((product: Product) => (
					<ProductCard
						key={product.id}
						image="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
						name={product.name}
						product_slug={product.slug}
						description={product.description}
						originalPrice={product.price}
						type={product.type}
						seller_name={product.seller_name}
						seller_slug={product.seller_slug}
					/>
				))}
			</div>
			<div className="mt-10">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" onClick={() => handlePageChange(prev_page || 1)} />
						</PaginationItem>
						{[...Array(total_pages)].map((_, index) => (
							<PaginationItem key={index}>
								<PaginationLink
									href="#"
									isActive={index + 1 === currentPage}
									onClick={() => handlePageChange(index + 1)}
								>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						{total_pages > 3 && <PaginationEllipsis />}
						<PaginationItem>
							<PaginationNext href="#" onClick={() => handlePageChange(next_page || total_pages)} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};

export default ProductList;
