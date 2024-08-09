import Sidebar from "@/components/layouts/Sidebar";
import ProductList from "@/components/products/ProductList";
import Categories from "@/components/sidebar/Categories";
import Cities from "@/components/sidebar/Cities";
import FilterSheet from "@/components/sidebar/FilterSheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const Products: React.FC = () => {
	return (
		<div className="md:container px-4 bg-gray-100 pb-5">
			<div className="flex justify-between items-center">
				<DynamicBreadcrumb />
				<FilterSheet />
			</div>
			<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div className="w-full hidden md:flex">
					<Sidebar />
				</div>
				<div className="md:col-span-2 lg:col-span-3">
					<ProductList />
				</div>
			</div>
		</div>
	);
};

export default Products;
