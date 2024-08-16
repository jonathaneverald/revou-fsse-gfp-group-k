import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

const StoreSearch: React.FC = () => (
	<div className="relative ml-auto flex-1 md:grow-0">
		<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
		<Input
			type="text"
			placeholder="Search..."
			className="w-full focus:outline-none rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
		/>
	</div>
);

export default StoreSearch;
