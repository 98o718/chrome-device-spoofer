const userAgentInput = document.querySelector<HTMLInputElement>('#user-agent');
const platformInput = document.querySelector<HTMLInputElement>('#platform');
const submitButton = document.querySelector('#submit');

submitButton?.addEventListener('click', async () => {
	if (userAgentInput === null || platformInput === null) {
		return;
	}

	const userAgent = userAgentInput.value === '' ? undefined : userAgentInput.value;
	const platform = platformInput.value === '' ? undefined : platformInput.value;

	await chrome.storage.local.set({
		platform,
		userAgent,
	});

	chrome.runtime.sendMessage({
		type: "change-device",
		platform,
		userAgent,
	});
});
