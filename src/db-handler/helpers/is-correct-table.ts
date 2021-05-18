import { Handler } from "../types";

export const isCorrectTable = (err: any, handler: Handler) =>
	err.table === handler.table;
