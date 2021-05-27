import { Handler } from "../types";

export const hasCorrectColumns = (
	fieldValues: Map<string, string>,
	handler: Handler,
) => handler?.columns?.every(column => fieldValues.has(column)) ?? true;
