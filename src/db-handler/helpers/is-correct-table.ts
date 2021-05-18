import { Handler } from "db-handler/types";

export const isCorrectTable = (err: any, handler: Handler) =>
	err.table === handler.table;
