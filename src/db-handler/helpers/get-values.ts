const getBruteKeysAndValues = (err: any) =>
	// Key (application, code)=(UNIQUE_LOGIN_SYSTEM, example) already exists.
	(err.detail as string)
		// ["(application, code)", "(UNIQUE_LOGIN_SYSTEM, example)"]
		.match(/\((.*?)\)/g);

const sanitizeKeysAndValues = (keysAndValues: RegExpMatchArray) =>
	keysAndValues.map(
		// ["(application, code)", "(UNIQUE_LOGIN_SYSTEM, example)"]
		keysOrValues =>
			keysOrValues // "(application, code)"
				?.replace("(", "") // "application, code)"
				?.replace(")", "") // "application, code"
				?.split(", "), // ["application", "code"]
	); // [ ["application", "code"], ["UNIQUE_LOGIN_SYSTEM", "example"] ]

const formatKeysAndValues = ([keys, values]: Array<Array<string>>) =>
	/**
	 * The first array will be the keys,
	 * and the second array will be the values
	 */
	new Map(keys.map((key, index) => [key, values[index]]));

export const getValues = (err: any) => {
	const bruteKeysAndValues = getBruteKeysAndValues(err);

	if (!bruteKeysAndValues || bruteKeysAndValues.length !== 2) {
		return new Map();
	}

	const keysAndValuesSanitized = sanitizeKeysAndValues(bruteKeysAndValues);

	return formatKeysAndValues(keysAndValuesSanitized);
};
