import { cn } from "@/lib/utils";
import React, { useState } from "react";
import StoreHeader from "./layouts/StoreHeader";
import StoreSidebar from "./sidebar/StoreSidebar";
import StoreForm from "./form/StoreForm";
import { useAppSelector } from "@/hooks/reduxHooks";
import useSellerProfile from "@/hooks/useSellerProfile";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
	const { data: sellerProfile } = useAppSelector((state) => state.sellerProfile);
	useSellerProfile();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleOpenStoreForm = () => setIsOpen(true);

	return (
		<div className={cn("flex flex-col min-h-screen bg-gray-100 text-gray-900")}>
			<StoreHeader sellerProfile={sellerProfile} handleOpenStoreForm={handleOpenStoreForm} />
			<div className="grid md:grid-cols-4 mx-4 md:mx-6 gap-4">
				<StoreSidebar sellerProfile={sellerProfile} handleOpenStoreForm={handleOpenStoreForm} />
				<main className="col-span-3">{children}</main>
			</div>
			<StoreForm isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};

export default StoreLayout;
