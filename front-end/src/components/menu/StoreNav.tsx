import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Store } from "lucide-react";
import StoreForm from "../form/StoreForm";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Skeleton } from "../ui/skeleton";
import { City } from "@/types/city";

const StoreNav = ({ cities }: { cities: City[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: user } = useAppSelector((state) => state.user);

	const handleOpenStoreForm = () => setIsOpen(true);

	const SellerButton = () => (
		<Link href="/stores/products">
			<Button variant="outline" className="rounded-full md:w-28 h-10 w-10 p-3">
				<Store className="h-5 w-5 md:h-4 md:w-4" />
				<span className="hidden md:inline ml-2">Store</span>
			</Button>
		</Link>
	);

	const GuestButton = () => (
		<>
			<Button onClick={handleOpenStoreForm} variant="outline" className="rounded-full md:w-28 h-10 w-10 p-3">
				<Store className="h-5 w-5 md:h-4 md:w-4" />
				<span className="hidden md:inline ml-2">Store</span>
			</Button>
			<StoreForm
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				seller={{ name: "ilham", location_id: 1 }}
				cities={cities}
			/>
		</>
	);

	const renderStoreButton = () => {
		if (!user) {
			return <Skeleton className="h-10 w-10 md:w-28 md:h-10 rounded-full" />;
		}
		return user.role === "seller" ? <SellerButton /> : <GuestButton />;
	};

	return <>{renderStoreButton()}</>;
};

export default StoreNav;
