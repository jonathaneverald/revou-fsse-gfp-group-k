import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUserProfile from "@/hooks/useAuthenticatedUser";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import EditProfile from "@/components/form/EditProfile";
import { useState } from "react";

const ProfileDropdown: React.FC = () => {
	const { user, error, isLoading } = useUserProfile();
	const [isOpen, setIsOpen] = useState(false);

	if (isLoading) {
		return <Skeleton className="h-10 w-10 bg-gray-300 rounded-full" />;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<EditProfile isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="cursor-pointer">
						<AvatarFallback>{user?.email?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56 mr-6">
					<DropdownMenuLabel>{user?.email || "My Account"}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer">
							Profile
						</DropdownMenuItem>

						<Link href={"/transaction"}>
							<DropdownMenuItem className="cursor-pointer">Transaction</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuItem>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default ProfileDropdown;
