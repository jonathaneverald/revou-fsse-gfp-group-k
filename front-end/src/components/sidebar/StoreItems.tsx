import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import { SellerProfile } from "@/types/seller";

interface StoreItemsProps {
	sellerProfile: SellerProfile | null;
	handleOpenStoreForm: () => void;
}

const StoreSideItems: React.FC<StoreItemsProps> = ({ sellerProfile, handleOpenStoreForm }) => {
	return (
		<>
			<div className="py-3 flex items-center border-b">
				<Avatar className="cursor-pointer border mr-2">
					<AvatarFallback>
						{sellerProfile?.name
							.split(" ")
							.map((word) => word[0])
							.join("") || "U"}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center">
					<span
						className="text-sm font-semibold hover:underline cursor-pointer"
						onClick={handleOpenStoreForm}
					>
						{sellerProfile?.name}
					</span>
					<span className="text-xs text-gray-600">Makassar</span>
				</div>
			</div>

			<Link
				href={"/stores/orders"}
				className={`p-2 flex items-center justify-between capitalize rounded-md text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer my-1 text-gray-700`}
			>
				<div className="flex items-center">
					<ShoppingCart className="mr-2 size-[18px]" />
					Orders
				</div>
				<Badge variant={"destructive"} className="text-[10px] flex justify-center items-center">
					200
				</Badge>
			</Link>
			<Link
				href={"/stores/products"}
				className={`p-2 flex items-center justify-between capitalize rounded-md text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer my-1 text-gray-700`}
			>
				<div className="flex items-center">
					<Package className="mr-2 size-[18px]" />
					Products
				</div>
				<Badge variant={"destructive"} className="text-[10px] flex justify-center items-center">
					2
				</Badge>
			</Link>
		</>
	);
};

export default StoreSideItems;
