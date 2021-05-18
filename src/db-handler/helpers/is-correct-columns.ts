import { Handler } from "db-handler/types";

export const isCorrectColumns = (err: any, handler: Handler) =>
	handler.columns.every(column => err.detail.includes(column));
