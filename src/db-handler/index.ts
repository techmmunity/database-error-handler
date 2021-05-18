import { HttpException } from "@nestjs/common";

import { getDefaultHandler } from "./helpers/get-default-handler";
import { getHandler } from "./helpers/get-handler";
import { getValues } from "./helpers/get-values";

import { Handlers } from "./types";

export const DbHandler = (handlers: Handlers) => async (err: any) => {
	const fieldValues = getValues(err);

	const handler = getHandler({ handlers, err, fieldValues });

	if (handler) {
		throw new HttpException(
			await handler.makeError(fieldValues),
			handler.responseCode,
		);
	}

	const defaultHandler = getDefaultHandler(handlers);

	if (defaultHandler) {
		throw new HttpException(
			await defaultHandler.makeError(err),
			defaultHandler.responseCode,
		);
	}

	throw new HttpException(err, 500);
};
