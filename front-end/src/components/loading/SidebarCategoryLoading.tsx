import React from "react";
import { Skeleton } from "../ui/skeleton";

const SidebarItemLoading = ({ type }: { type: string }) => {
	return (
		<>
			<div className="mx-2 text-sm font-bold my-2">
				<span>{type}</span>
			</div>
			<div className="mb-4 mx-2">
				<Skeleton className="bg-gray-300 h-9 w-full" />
			</div>
			{Array.from({ length: 2 }).map((_, index) => (
				<div key={index}>
					<div className="mb-1 mx-2">
						<Skeleton className="bg-gray-300 h-7 w-3/5" />
					</div>
					<div className="mb-1 mx-2">
						<Skeleton className="bg-gray-300 h-7 w-4/5" />
					</div>
					<div className="mb-1 mx-2">
						<Skeleton className="bg-gray-300 h-7 w-2/5" />
					</div>
					<div className="mb-1 mx-2">
						<Skeleton className="bg-gray-300 h-7 w-3/5" />
					</div>
				</div>
			))}
		</>
	);
};

export default SidebarItemLoading;
