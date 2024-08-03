import Sidebar from "@/components/layouts/Sidebar";

export default function Home() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 bg-gray-50 px-4">
			<Sidebar />
		</div>
	);
}
