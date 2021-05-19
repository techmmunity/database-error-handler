import { getDefaultHandler } from "./helpers/get-default-handler";
import { getHandler } from "./helpers/get-handler";
import { getValues } from "./helpers/get-values";

import { Handlers, Throwler } from "./types";

export const DbHandlerMaker =
	(Throwler: Throwler) => (handlers: Handlers) => async (err: any) => {
		const fieldValues = getValues(err);

		const handler = getHandler({ handlers, err, fieldValues });

		if (handler) {
			throw new Throwler(
				await handler.makeError(fieldValues),
				handler.responseCode,
			);
		}

		const defaultHandler = getDefaultHandler(handlers);

		if (defaultHandler) {
			throw new Throwler(
				await defaultHandler.makeError(err),
				defaultHandler.responseCode,
			);
		}

		throw new Throwler(err, 500);
	};
