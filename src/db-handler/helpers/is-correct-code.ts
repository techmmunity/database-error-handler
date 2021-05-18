import { Handler } from "db-handler/types";

export const isCorrectCode = (err: any, handler: Handler) =>
	err.code === handler.error;
