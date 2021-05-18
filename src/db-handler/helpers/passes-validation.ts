import { Handler } from "../types";

export const itPassesValidation = async (
	fieldValues: Record<string, string>,
	handler: Handler,
) => {
	const { validate } = handler;

	if (!validate) return true;

	if (Object.keys(fieldValues).length < 1) return false;

	return validate(fieldValues);
};
