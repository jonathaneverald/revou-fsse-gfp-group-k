import { SellerProfile } from "@/types/seller";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";
import StoreSideItems from "../sidebar/StoreItems";
import StoreSearch from "../form/StoreSearch";
import dynamic from "next/dynamic";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

interface StoreHeaderProps {
	sellerProfile: SellerProfile | null;
	handleOpenStoreForm: () => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ sellerProfile, handleOpenStoreForm }) => (
	<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="outline" className="sm:hidden">
					<PanelLeft className="h-5 w-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="sm:max-w-xs">
				<nav className="flex flex-col text-lg font-medium">
					<StoreSideItems sellerProfile={sellerProfile} handleOpenStoreForm={handleOpenStoreForm} />
				</nav>
			</SheetContent>
		</Sheet>

		<DynamicBreadcrumb />

		<StoreSearch />
	</header>
);

export default StoreHeader;
