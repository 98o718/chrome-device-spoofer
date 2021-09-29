export interface State {
	platform?: string;
	userAgent?: string;
	enabled?: boolean;
}

export const enum MessageType {
	ChangeState,
}

export interface Message {
	type: MessageType;
}
