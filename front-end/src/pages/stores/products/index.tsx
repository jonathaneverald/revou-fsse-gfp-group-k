import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Home, ListFilter, MoreHorizontal, Package, PanelLeft, PlusCircle, Search, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIntToIDR } from "@/utils/currency";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const products = [
	{
		name: "Wireless Earbuds",
		status: "Available",
		price: 29990,
		quantity: 150,
	},
	{
		name: "Bluetooth Speaker",
		status: "Out of Stock",
		price: 45490,
		quantity: 0,
	},
	{
		name: "Smartphone Case",
		status: "Available",
		price: 12950,
		quantity: 500,
	},
	{
		name: "Laptop Stand",
		status: "Available",
		price: 39990,
		quantity: 200,
	},
	{
		name: "Gaming Mouse",
		status: "Available",
		price: 24990,
		quantity: 350,
	},
	{
		name: "USB-C Cable",
		status: "Available",
		price: 7990,
		quantity: 1000,
	},
	{
		name: "Portable Charger",
		status: "Out of Stock",
		price: 19990,
		quantity: 0,
	},
	{
		name: "4K Monitor",
		status: "Available",
		price: 249990,
		quantity: 75,
	},
	{
		name: "Mechanical Keyboard",
		status: "Available",
		price: 89990,
		quantity: 120,
	},
	{
		name: "Wireless Mouse",
		status: "Available",
		price: 14990,
		quantity: 400,
	},
	{
		name: "Noise-Cancelling Headphones",
		status: "Available",
		price: 199990,
		quantity: 60,
	},
	{
		name: "Smartwatch",
		status: "Available",
		price: 149990,
		quantity: 90,
	},
	{
		name: "Tablet Stand",
		status: "Out of Stock",
		price: 29990,
		quantity: 0,
	},
	{
		name: "LED Desk Lamp",
		status: "Available",
		price: 34950,
		quantity: 250,
	},
	{
		name: "VR Headset",
		status: "Available",
		price: 299990,
		quantity: 40,
	},
];

const StoreProducts = () => {
	return (
		<>
			<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
				<Sheet>
					<SheetTrigger asChild>
						<Button size="icon" variant="outline" className="sm:hidden">
							<PanelLeft className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="sm:max-w-xs">
						<nav className="grid gap-6 text-lg font-medium">
							<Link href="/">
								<Image
									alt="brand logo"
									src={
										"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F2295%2FLogo-new.png&w=2048&q=75"
									}
									width={100}
									height={50}
								/>
							</Link>
							<Link
								href="#"
								className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
							>
								<Home className="h-5 w-5" />
								Dashboard
							</Link>
							<Link
								href="#"
								className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
							>
								<ShoppingCart className="h-5 w-5" />
								Orders
							</Link>
							<Link href="#" className="flex items-center gap-4 text-foreground">
								<Package className="h-5 w-5" />
								Products
							</Link>
						</nav>
					</SheetContent>
				</Sheet>

				<DynamicBreadcrumb />

				<div className="relative ml-auto flex-1 md:grow-0">
					<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search..."
						className="w-full focus:outline-none rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
					/>
				</div>
			</header>

			<div className="md:px-6 px-4 bg-gray-100">
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
					<div className="w-full h-full hidden md:flex">
						<div className="w-full space-y-2 md:block hidden h-fit rounded-md bg-white py-6 px-3 overflow-y-auto">
							<div className="mx-2 py-3 flex items-center border-b">
								<Avatar className="cursor-pointer border mr-2">
									<AvatarFallback>TB</AvatarFallback>
								</Avatar>
								<div className="flex flex-col justify-center">
									<span className="text-sm font-semibold">Toko bagus</span>
									<span className="text-xs text-gray-600">Makassar</span>
								</div>
							</div>

							<div
								className={`mx-2 p-2 flex items-center justify-between capitalize rounded-md text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer my-1 text-gray-700`}
							>
								<div className="flex items-center">
									<ShoppingCart className="mr-2 size-[18px]" />
									Orders
								</div>
								<Badge variant={"destructive"} className="text-[10px] flex justify-center items-center">
									200
								</Badge>
							</div>
							<div
								className={`mx-2 p-2 flex items-center justify-between capitalize rounded-md text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer my-1 text-gray-700`}
							>
								<div className="flex items-center">
									<Package className="mr-2 size-[18px]" />
									Products
								</div>
								<Badge variant={"destructive"} className="text-[10px] flex justify-center items-center">
									2
								</Badge>
							</div>
						</div>
					</div>
					<div className="col-span-1 md:col-span-2 lg:col-span-3">
						<main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
							<div>
								<div className="ml-auto flex justify-between items-center gap-2 mb-2 mt-2 md:mt-0">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm" className="h-9 gap-1">
												<ListFilter className="h-3.5 w-3.5" />
												<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
													Filter
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start">
											<DropdownMenuLabel>Filter by</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<Link href={"products/add"}>
										<Button size="sm" className="h-9 gap-1">
											<PlusCircle className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
												Add Product
											</span>
										</Button>
									</Link>
								</div>
								<Card className="p-0 mb-5">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="hidden w-[100px] sm:table-cell">
													<span className="sr-only">Image</span>
												</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Price</TableHead>
												<TableHead className="hidden md:table-cell">Total Sales</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead>
													<span className="sr-only">Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>

										<TableBody>
											{products.map((product, index) => (
												<TableRow>
													<TableCell className="hidden sm:table-cell">
														<Image
															alt="Product image"
															className="aspect-square rounded-md object-cover"
															height="64"
															src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
															width="64"
														/>
													</TableCell>
													<TableCell className="font-medium">{product.name}</TableCell>
													<TableCell>
														<Badge variant="outline">{product.status}</Badge>
													</TableCell>
													<TableCell>{formatIntToIDR(product.price)}</TableCell>
													<TableCell className="hidden md:table-cell">
														{product.quantity}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														2023-07-12 10:42 AM
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	aria-haspopup="true"
																	size="icon"
																	variant="ghost"
																>
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Toggle menu</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem>Edit</DropdownMenuItem>
																<DropdownMenuItem>Delete</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
									<CardFooter>
										<div className="text-xs text-muted-foreground">
											Showing <strong>1-10</strong> of <strong>32</strong> products
										</div>
									</CardFooter>
								</Card>
							</div>
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

export default StoreProducts;
