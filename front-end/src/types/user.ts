export interface User {
	id: string;
	name: string;
	email: string;
	address: string;
	phone_number: string;
}

export interface EditProfileProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: User | undefined;
}
