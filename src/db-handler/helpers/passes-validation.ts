import { Handler } from "../types";

export const itPassesValidation = (
	fieldValues: Map<string, string>,
	handler: Handler,
) => {
	const { validate } = handler;

	if (!validate) return true;

	if (fieldValues.size < 1) return false;

	const fieldValuesObj = Object.fromEntries(fieldValues);

	return validate(fieldValuesObj);
};
