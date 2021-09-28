chrome.runtime.onMessage.addListener(async (message) => {
	const tabId = await getActiveTabId();

	if (message.type === 'change-device' && tabId !== undefined) {
		handleDeviceChange(tabId, message.platform, message.userAgent);
	}
});

chrome.tabs.onActivated.addListener(async ({ tabId }: chrome.tabs.TabActiveInfo) => {
	const { platform, userAgent } = await getAllLocalStorageData();

	handleDeviceChange(tabId, platform, userAgent);
});

async function getActiveTabId(): Promise<number | undefined> {
	const [{ id }] = await chrome.tabs.query({active: true, currentWindow: true});

	return id;
}

function handleDeviceChange(tabId: number, platform?: string, userAgent?: string): void {
	chrome.debugger.detach({ tabId }, () => {
		if(chrome.runtime.lastError) {
			// there is nothing to detach
		}
	});

	chrome.debugger.attach({ tabId }, '1.3', () => {
		chrome.debugger.sendCommand(
			{ tabId },
			'Emulation.setUserAgentOverride',
			{
				userAgent: userAgent ?? navigator.userAgent,
				platform: platform ?? navigator.platform,
			}
		);
	});
}

function getAllLocalStorageData(): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, (items) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}

			resolve(items);
		});
	});
}
