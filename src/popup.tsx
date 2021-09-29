import { Component, createEffect } from 'solid-js';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import { MessageType, State } from './types';

import * as s from './popup.styles';

const Popup: Component = () => {
	const [state, setState] = createStore<State>({});

	createEffect(() => {
		chrome.storage.local.get(null, (savedState: State) => {
			setState(savedState);
		});
	});

	return (
		<div style={s.wrapper}>
			<label for="user-agent">User-Agent</label>
			<input
				style={s.input}
				type="text"
				id="user-agent"
				value={state.userAgent ?? ''}
				placeholder="default"
				onInput={(event) => setState({ userAgent: event.currentTarget.value })}
			/>
			<label for="platform">Platform</label>
			<input
				style={s.input}
				type="text"
				id="platform"
				value={state.platform ?? ''}
				placeholder="default"
				onInput={(event) => setState({ platform: event.currentTarget.value })}
			/>
			<div style={s.buttonsWrapper}>
				<button style={s.button} onClick={handleSubmit}>
					Submit
				</button>
				<button style={s.button} onClick={toggleSpoofing}>
					{state.enabled ? 'Disable' : 'Enable'}
				</button>
			</div>
		</div>
	);

	async function handleSubmit(): Promise<void> {
		await chrome.storage.local.set({
			userAgent: state.userAgent,
			platform: state.platform,
		});

		handleStateChange();
	}

	async function toggleSpoofing(): Promise<void> {
		setState((prevState: State) => {
			const enabled = !prevState.enabled;

			chrome.storage.local.set({ enabled }, () => {
				handleStateChange();
			});

			return { ...prevState, enabled };
		});
	}
};

function handleStateChange(): void {
	chrome.runtime.sendMessage({ type: MessageType.ChangeState });
}

const root = document.getElementById('root');

if (root !== null) {
	render(() => <Popup />, root);
}
