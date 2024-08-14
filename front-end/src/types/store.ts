import { City } from "./city";

export interface Seller {
	location_id: number;
	name: string;
}

export interface StoreProfileProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	seller: Seller | undefined;
	cities: City[];
}
