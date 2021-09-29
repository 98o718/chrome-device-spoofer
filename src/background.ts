import { Message, MessageType, State } from './types';

chrome.runtime.onMessage.addListener(async (message: Message) => {
	const tabId = await getActiveTabId();

	if (message.type === MessageType.ChangeState && tabId !== undefined) {
		await handleDeviceChange(tabId);
	}
});

chrome.tabs.onActivated.addListener(({ tabId }: chrome.tabs.TabActiveInfo) => handleDeviceChange(tabId));

chrome.debugger.onDetach.addListener(async () => {
	const { enabled } = await getAllLocalStorageData();

	if (!enabled) {
		return;
	}

	await chrome.storage.local.set({ enabled: false });
});

async function getActiveTabId(): Promise<number | undefined> {
	const tabs = await chrome.tabs.query({ active: true });

	if (tabs.length === 0) {
		return undefined;
	}

	return tabs[0].id;
}

async function handleDeviceChange(tabId: number): Promise<void> {
	const { userAgent, platform, enabled } = await getAllLocalStorageData();

	chrome.debugger.detach({ tabId }, () => {
		if (chrome.runtime.lastError) {
			// there is nothing to detach
		}
	});

	if (!enabled) {
		return;
	}

	chrome.debugger.attach({ tabId }, '1.3', () => {
		chrome.debugger.sendCommand({ tabId }, 'Emulation.setUserAgentOverride', {
			userAgent: userAgent ?? navigator.userAgent,
			platform: platform ?? navigator.platform,
		});
	});
}

function getAllLocalStorageData(): Promise<State> {
	return new Promise((resolve: (state: State) => void, reject: (reason?: unknown) => void) => {
		chrome.storage.local.get(null, (state: State) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}

			resolve(state);
		});
	});
}
