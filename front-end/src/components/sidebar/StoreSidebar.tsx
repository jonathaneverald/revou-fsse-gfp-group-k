import { SellerProfile } from "@/types/seller";
import StoreSideItems from "./StoreItems";

interface StoreSidebarProps {
	sellerProfile: SellerProfile | null;
	handleOpenStoreForm: () => void;
}

const StoreSidebar: React.FC<StoreSidebarProps> = ({ sellerProfile, handleOpenStoreForm }) => (
	<div className="w-full hidden md:flex">
		<div className="w-full space-y-2 md:block hidden h-fit rounded-md bg-white py-6 px-3 overflow-y-auto">
			<StoreSideItems sellerProfile={sellerProfile} handleOpenStoreForm={handleOpenStoreForm} />
		</div>
	</div>
);

export default StoreSidebar;
