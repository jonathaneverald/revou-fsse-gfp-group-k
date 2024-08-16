import { City } from "./city";
import { SellerProfile } from "./seller";

export interface Seller {
	location_id: number;
	name: string;
}

export interface StoreProfileProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	cities: City[];
}
