import { getDefaultHandler } from "./helpers/get-default-handler";
import { getHandler } from "./helpers/get-handler";
import { getValues } from "./helpers/get-values";

import { Handlers, DbHandlerMakerConfig } from "./types";

export const dbHandlerMaker =
	({ throwler, globalDefaultHandler }: DbHandlerMakerConfig) =>
	(handlers: Handlers) =>
	async (err: any) => {
		const fieldValues = getValues(err);

		const handler = getHandler({ handlers, err, fieldValues });

		if (handler) {
			const fieldValuesObj = Object.fromEntries(fieldValues) as Record<
				string,
				string
			>;

			throw new throwler(
				await handler.makeError(fieldValuesObj),
				handler.responseCode,
			);
		}

		const defaultHandler = getDefaultHandler(handlers) || globalDefaultHandler;

		if (defaultHandler) {
			throw new throwler(
				await defaultHandler.makeError(err),
				defaultHandler.responseCode,
			);
		}

		throw new throwler(err, 500);
	};
