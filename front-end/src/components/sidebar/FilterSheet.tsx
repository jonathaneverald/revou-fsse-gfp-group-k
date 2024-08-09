import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import Categories from "./Categories";
import Cities from "./Cities";

const FilterSheet = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="flex md:hidden size-7" variant="outline" size={"icon"}>
					<SlidersHorizontal className="size-4" />
				</Button>
			</SheetTrigger>
			<SheetContent side={"left"} className="overflow-y-auto">
				<SheetTitle className="hidden">Filter</SheetTitle>
				<Categories />
				<Cities />
			</SheetContent>
		</Sheet>
	);
};

export default FilterSheet;
