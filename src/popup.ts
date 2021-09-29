import { MessageType } from './types';

const userAgentInput = document.querySelector<HTMLInputElement>('#user-agent');
const platformInput = document.querySelector<HTMLInputElement>('#platform');
const submitButton = document.querySelector('#submit');
const disableButton = document.querySelector('#disable');
const enableButton = document.querySelector('#enable');

submitButton?.addEventListener('click', async () => {
	if (userAgentInput === null || platformInput === null) {
		return;
	}

	await chrome.storage.local.set({
		userAgent: userAgentInput.value !== '' ? userAgentInput.value : undefined,
		platform: platformInput.value !== '' ? platformInput.value : undefined,
	});

	handleStateChange();
});

enableButton?.addEventListener('click', () => toggleSpoofing(true));
disableButton?.addEventListener('click', () => toggleSpoofing(false));

async function toggleSpoofing(enabled: boolean): Promise<void> {
	await chrome.storage.local.set({ enabled });

	handleStateChange();
}

function handleStateChange(): void {
	chrome.runtime.sendMessage({ type: MessageType.ChangeState });
}
