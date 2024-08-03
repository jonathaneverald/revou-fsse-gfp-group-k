import { useEffect, useState } from "react";

const useContainerScroll = () => {
	const [maxScrollWidth, setMaxScrollWidth] = useState<number>(0);

	useEffect(() => {
		const updateMaxScrollWidth = () => {
			const container = document.querySelector(".scroll-container");
			if (container) {
				setMaxScrollWidth(container.scrollWidth - container.clientWidth);
			}
		};

		updateMaxScrollWidth();
		window.addEventListener("resize", updateMaxScrollWidth);

		return () => {
			window.removeEventListener("resize", updateMaxScrollWidth);
		};
	}, []);

	return maxScrollWidth;
};

export default useContainerScroll;
