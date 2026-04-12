export default function useEnterKey(callback: any) {
	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			callback();
			// If enabled, buttons cannot be clicked via "Enter".
			// e.preventDefault();
		}
	};

	onMounted(() => {
		window.addEventListener("keydown", handleEnterKey);
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleEnterKey);
	});
}
