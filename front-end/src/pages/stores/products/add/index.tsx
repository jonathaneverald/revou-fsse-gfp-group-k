import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save } from "lucide-react";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const FormSchema = z.object({
	productName: z.string().min(2, { message: "Product Name must be at least 2 characters long." }),
	description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
	category: z.string().min(1, { message: "Category is required." }),
	type: z.string().min(1, { message: "Type is required." }),
	status: z.string().min(1, { message: "Status is required." }),
	price: z.coerce.number().positive({ message: "Price must be a positive number." }),
	quantity: z.coerce
		.number()
		.int({ message: "Quantity must be an integer." })
		.positive({ message: "Quantity must be a positive integer." }),
});

type FormValues = z.infer<typeof FormSchema>;

const ProductForm = () => {
	const { categories, isLoading, error } = useFetchCategories();

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			productName: "",
			description: "",
			category: "",
			type: "",
			status: "",
			price: 0,
			quantity: 1,
		},
	});

	const onSubmit = (data: FormValues) => {
		console.log(data);
	};

	return (
		<div className="px-4 md:px-6">
			<div className="flex justify-between items-center">
				<DynamicBreadcrumb />
				<Button type="submit" size="sm" className="gap-1" form="product-form">
					<Save className="h-4 w-4" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Save Product</span>
				</Button>
			</div>

			<Form {...form}>
				<form
					id="product-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="pb-4 grid md:grid-cols-3 gap-4"
				>
					<div className="md:col-span-2 flex flex-col gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">General Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="productName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Product Name</FormLabel>
											<FormControl>
												<Input placeholder="Product Name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea placeholder="Type your Description here." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Category & Type</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-2 grid-cols-2">
								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Product Category</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger id="category" aria-label="Select category">
														<SelectValue placeholder="Select a category" />
													</SelectTrigger>
													<SelectContent>
														{categories.map((category) => (
															<SelectItem
																key={category.slug}
																value={category.slug}
																className="capitalize"
															>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger id="type" aria-label="Select type">
														<SelectValue placeholder="Select type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="standard">Standard</SelectItem>
														<SelectItem value="premium">Premium</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</div>
					<div className="flex flex-col gap-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Product Status</CardTitle>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger id="status" aria-label="Select status">
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="draft">Draft</SelectItem>
														<SelectItem value="published">Active</SelectItem>
														<SelectItem value="archived">Archived</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Pricing & Inventory</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-2">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input type="number" placeholder="Price" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="quantity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantity</FormLabel>
											<FormControl>
												<Input type="number" placeholder="Quantity" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ProductForm;
