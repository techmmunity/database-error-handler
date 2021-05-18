import { DefaultHandler, Handlers } from "../types";

export const getDefaultHandler = (handlers: Handlers) =>
	handlers.find(handler => handler.error === "default") as
		| undefined
		| DefaultHandler;
