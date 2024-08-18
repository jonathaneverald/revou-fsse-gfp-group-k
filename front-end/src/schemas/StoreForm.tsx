import * as z from "zod";

export const StoreFormSchema = z.object({
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
