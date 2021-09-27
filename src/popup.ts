const userAgentInput = document.querySelector<HTMLInputElement>('#user-agent');
const platformInput = document.querySelector<HTMLInputElement>('#platform');
const submitButton = document.querySelector('#submit');

submitButton?.addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab.id === undefined) {
		return;
	}

	await chrome.storage.local.set({
		platform: platformInput?.value,
		userAgent: userAgentInput?.value,
	});

	chrome.tabs.reload(tab.id);
});
