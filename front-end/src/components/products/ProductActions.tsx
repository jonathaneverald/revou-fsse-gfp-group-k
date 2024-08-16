import { ListFilter, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

const ProductActions: React.FC = () => (
	<div className="ml-auto flex justify-between items-center gap-2 mb-2 mt-2 md:mt-0">
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="h-9 gap-1">
					<ListFilter className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
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
				<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
			</Button>
		</Link>
	</div>
);

export default ProductActions;
