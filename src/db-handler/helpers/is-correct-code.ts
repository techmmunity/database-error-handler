import { Handler } from "../types";

export const isCorrectCode = (err: any, handler: Handler) =>
	err.code === handler.error;
