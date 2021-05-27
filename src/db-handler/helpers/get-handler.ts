import { hasCorrectColumns } from "./has-correct-columns";
import { isCorrectCode } from "./is-correct-code";
import { isCorrectTable } from "./is-correct-table";
import { itPassesValidation } from "./passes-validation";

import { Handlers } from "../types";

interface GetHandersParams {
	err: any;
	handlers: Handlers;
	fieldValues: Map<string, string>;
}

export const getHandler = ({ handlers, err, fieldValues }: GetHandersParams) =>
	handlers.find(handler => {
		if (handler.error === "default") {
			return false;
		}

		return (
			isCorrectCode(err, handler) &&
			isCorrectTable(err, handler) &&
			hasCorrectColumns(fieldValues, handler) &&
			itPassesValidation(fieldValues, handler)
		);
	});
