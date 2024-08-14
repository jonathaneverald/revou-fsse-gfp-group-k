import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreProfileProps } from "@/types/store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ArrowUpDown, CheckIcon, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	location_id: z
		.number({
			invalid_type_error: "Location is required and must be a number.",
		})
		.min(1, {
			message: "A valid location must be selected.",
		}),
});

const StoreForm: React.FC<StoreProfileProps> = ({ isOpen, setIsOpen, seller, cities }) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		// form.reset();
		// setIsOpen(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Store</DialogTitle>
					<DialogDescription>
						Fill in the details below to create a new store. Click save when you're done.
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
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default StoreForm;
