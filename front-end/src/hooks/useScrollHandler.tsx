import { useState } from "react";

const useScrollHandler = (maxScrollWidth: number) => {
	const [scrollX, setScrollX] = useState<number>(0);

	const handleScroll = (scrollOffset: number) => {
		const container = document.querySelector(".scroll-container");

		if (container) {
			const newX = scrollX + scrollOffset;

			if (newX >= 0 && newX <= maxScrollWidth + 100) {
				container.scrollTo({
					left: newX,
					behavior: "smooth",
				});

				setScrollX(newX);
			}
		}
	};

	return handleScroll;
};

export default useScrollHandler;
