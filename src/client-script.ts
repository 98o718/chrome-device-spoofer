const script = document.querySelector<HTMLElement>('#device-spoofer');

const userAgent = script?.dataset.userAgent;

if (userAgent !== undefined) {
	Object.defineProperty(navigator, 'userAgent', {
		value: userAgent,
	});
}

const platform = script?.dataset.platform;

if (platform !== undefined) {
	Object.defineProperty(navigator, 'platform', {
		value: platform,
	});
}

script?.remove();
