export function formatMessageTime(date) {
	console.log(date, "dkfkfk");

	const parsedDate = new Date(date);

	// ✅ Check if the date is valid
	if (isNaN(parsedDate.getTime())) {
		console.warn("Invalid date provided to formatMessageTime:", date);
		return "";
	}

	return parsedDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}
