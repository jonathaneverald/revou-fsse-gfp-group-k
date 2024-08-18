import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreProfileProps } from "@/types/store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useCities } from "@/hooks/useCities";
import { StoreFormSchema } from "@/schemas/StoreForm";

const StoreForm: React.FC<StoreProfileProps> = ({ isOpen, setIsOpen }) => {
	const [open, setOpen] = useState(false);
	const { data: sellerProfile } = useAppSelector((state) => state.sellerProfile);
	const { cities, fetchCities } = useCities();

	const form = useForm({
		resolver: zodResolver(StoreFormSchema),
		defaultValues: {
			name: sellerProfile?.name || "",
			location_id: sellerProfile?.location_id || 0,
		},
	});

	useEffect(() => {
		if (isOpen) {
			fetchCities();
		}
	}, [isOpen, fetchCities]);

	useEffect(() => {
		if (sellerProfile) {
			form.reset({
				name: sellerProfile.name,
				location_id: sellerProfile.location_id,
			});
		}
	}, [sellerProfile, form]);

	const onSubmit = (values: z.infer<typeof StoreFormSchema>) => {
		if (sellerProfile) {
			console.log("Updating store:", values);
		} else {
			console.log("Creating store:", values);
		}
		// Perform the update or create action here.
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{sellerProfile ? "Update Store" : "Create New Store"}</DialogTitle>
					<DialogDescription>
						{sellerProfile
							? "Update the details below to edit the store. Click save when you're done."
							: "Fill in the details below to create a new store. Click save when you're done."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Input name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												className="w-full justify-between capitalize"
											>
												{field.value
													? cities.find((city) => city.id === field.value)?.city
													: "Select a location..."}
												<ChevronsUpDown className={"ml-2 h-4 w-4 shrink-0 opacity-50"} />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput placeholder="Search location..." className="h-9" />
												<CommandList className="overflow-y-auto h-[165px]">
													<CommandEmpty>No location found.</CommandEmpty>
													<CommandGroup>
														{cities.map((city) => (
															<CommandItem
																className="capitalize"
																key={city.id}
																value={city.city}
																onSelect={() => {
																	field.onChange(city.id);
																	setOpen(false);
																}}
															>
																{city.city}
																<CheckIcon
																	className={cn(
																		"ml-auto h-4 w-4",
																		field.value === city.id
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit">{sellerProfile ? "Update" : "Create"}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default StoreForm;
