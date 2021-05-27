import { getDefaultHandler } from "./helpers/get-default-handler";
import { getHandler } from "./helpers/get-handler";
import { getValues } from "./helpers/get-values";

import { Handlers, DbHandlerMakerConfig } from "./types";

export const DbHandlerMaker =
	({ throwler: Throwler, globalDefaultHandler }: DbHandlerMakerConfig) =>
	(handlers: Handlers) =>
	async (err: any) => {
		const fieldValues = getValues(err);

		const handler = getHandler({ handlers, err, fieldValues });

		if (handler) {
			const fieldValuesObj = Object.fromEntries(fieldValues) as Record<
				string,
				string
			>;

			throw new Throwler(
				await handler.makeError(fieldValuesObj),
				handler.responseCode,
			);
		}

		const defaultHandler = getDefaultHandler(handlers) || globalDefaultHandler;

		if (defaultHandler) {
			throw new Throwler(
				await defaultHandler.makeError(err),
				defaultHandler.responseCode,
			);
		}

		throw new Throwler(err, 500);
	};
