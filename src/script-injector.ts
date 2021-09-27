chrome.storage.local.get(['platform', 'userAgent'], ({ platform, userAgent }) => {
	const script = document.createElement("script");
	
	script.id = 'device-spoofer';
	script.dataset.userAgent = userAgent;
	script.dataset.platform = platform;
	
	script.src = chrome.runtime.getURL('dist/client-script.js');
	
	document.documentElement.prepend(script);
});
