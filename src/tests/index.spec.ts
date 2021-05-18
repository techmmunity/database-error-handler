/* eslint-disable camelcase */

import { DbHandler } from "db-handler";
import { DefaultHandler, Handler, HttpCodeEnum, PgErrorEnum } from "index";

describe("DbHandler", () => {
	it("should handle unique violation with a single field", async () => {
		const error = {
			code: PgErrorEnum.UniqueViolation,
			detail: "Key (id)=(1) already exists.",
			table: "users",
		};

		const handler: Handler = {
			error: PgErrorEnum.UniqueViolation,
			table: "users",
			responseCode: HttpCodeEnum.Conflict,
			columns: ["id"],
			makeError: ({ id }) => ({
				errors: [`User with id "${id}" already exists`],
			}),
		};

		let result;

		try {
			await DbHandler([handler])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(409);
		expect(result.response).toStrictEqual({
			errors: ['User with id "1" already exists'],
		});
	});

	it("should handle unique violation with multiple fields", async () => {
		const error = {
			code: PgErrorEnum.UniqueViolation,
			detail:
				"Key (user_id, version, application_id)=(1, v1, 806e3fc0-931b-4f27-9a18-97ea35c959d7) already exists.",
			table: "terms_and_policies",
		};

		const handler: Handler = {
			error: PgErrorEnum.UniqueViolation,
			table: "terms_and_policies",
			responseCode: HttpCodeEnum.Conflict,
			columns: ["user_id", "version", "application_id"],
			makeError: ({ user_id, version, application_id }) => ({
				errors: [
					`User with id "${user_id}" already accepted terms and policies version "${version}" for application with id "${application_id}"`,
				],
			}),
		};

		let result;

		try {
			await DbHandler([handler])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(409);
		expect(result.response).toStrictEqual({
			errors: [
				'User with id "1" already accepted terms and policies version "v1" for application with id "806e3fc0-931b-4f27-9a18-97ea35c959d7"',
			],
		});
	});

	it("should handle foreign key violation with application field", async () => {
		const error = {
			code: PgErrorEnum.ForeignKeyViolation,
			detail:
				'Key (application_id)=(cd2122a1-e01d-4b5d-9e0f-ce217682084b) is not present in table "applications".',
			table: "user_applications",
		};

		const handler: Handler = {
			error: PgErrorEnum.ForeignKeyViolation,
			table: "user_applications",
			responseCode: HttpCodeEnum.NotFound,
			columns: ["application_id"],
			makeError: ({ application_id }) => ({
				errors: [`Application with id "${application_id}" doesn't exists.`],
			}),
		};

		let result;

		try {
			await DbHandler([handler])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(404);
		expect(result.response).toStrictEqual({
			errors: [
				'Application with id "cd2122a1-e01d-4b5d-9e0f-ce217682084b" doesn\'t exists.',
			],
		});
	});

	it("should handle foreign key violation with user field", async () => {
		const error = {
			code: PgErrorEnum.ForeignKeyViolation,
			detail:
				'Key (user_id)=(d48cf80a-8812-4a95-bae7-f19d383201a0) is not present in table "users".',
			table: "user_applications",
		};

		const handler: Handler = {
			error: PgErrorEnum.ForeignKeyViolation,
			table: "user_applications",
			responseCode: HttpCodeEnum.NotFound,
			columns: ["user_id"],
			makeError: ({ user_id }) => ({
				errors: [`User with id "${user_id}" doesn't exists.`],
			}),
		};

		let result;

		try {
			await DbHandler([handler])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(404);
		expect(result.response).toStrictEqual({
			errors: [
				'User with id "d48cf80a-8812-4a95-bae7-f19d383201a0" doesn\'t exists.',
			],
		});
	});

	it("should handle correct error with multiple handlers", async () => {
		const error = {
			code: PgErrorEnum.UniqueViolation,
			detail:
				"Key (user_id, application_id)=(d48cf80a-8812-4a95-bae7-f19d383201a0, 28ed8f70-2a46-4d64-a14e-d068d9d26842) already exists.",
			table: "user_applications",
		};

		const handlerForeignKey: Handler = {
			error: PgErrorEnum.ForeignKeyViolation,
			table: "user_applications",
			responseCode: HttpCodeEnum.NotFound,
			columns: ["user_id"],
			makeError: ({ user_id }) => ({
				errors: [`User with id "${user_id}" doesn't exists.`],
			}),
		};

		const handlerUnique: Handler = {
			error: PgErrorEnum.UniqueViolation,
			table: "user_applications",
			responseCode: HttpCodeEnum.Conflict,
			columns: ["user_id", "application_id"],
			makeError: ({ application_id }) => ({
				errors: [`User already has application with id "${application_id}"`],
			}),
		};

		let result;

		try {
			await DbHandler([handlerUnique, handlerForeignKey])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(409);
		expect(result.response).toStrictEqual({
			errors: [
				'User already has application with id "28ed8f70-2a46-4d64-a14e-d068d9d26842"',
			],
		});
	});

	it("should throw database error without handler and defaultHandler", async () => {
		const error = {
			code: PgErrorEnum.UniqueViolation,
			detail:
				"Key (user_id, application_id)=(d48cf80a-8812-4a95-bae7-f19d383201a0, 28ed8f70-2a46-4d64-a14e-d068d9d26842) already exists.",
			table: "user_applications",
		};

		const handlerForeignKey: Handler = {
			error: PgErrorEnum.ForeignKeyViolation,
			table: "user_applications",
			responseCode: HttpCodeEnum.NotFound,
			columns: ["user_id"],
			makeError: ({ user_id }) => ({
				errors: [`User with id "${user_id}" doesn't exists.`],
			}),
		};

		let result;

		try {
			await DbHandler([handlerForeignKey])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(500);
		expect(result.response).toStrictEqual(error);
	});

	it("should handle error with defaultHandler", async () => {
		const error = {
			code: PgErrorEnum.ForeignKeyViolation,
			detail:
				'Key (user_id)=(d48cf80a-8812-4a95-bae7-f19d383201a0) is not present in table "users".',
			table: "user_applications",
		};

		const handler: DefaultHandler = {
			error: "default",
			responseCode: HttpCodeEnum.InternalServerError,
			makeError: err => ({
				errors: ["Fail to save in database", err],
			}),
		};

		let result;

		try {
			await DbHandler([handler])(error);
		} catch (e) {
			result = e;
		}

		expect(result.status).toEqual(500);
		expect(result.response).toStrictEqual({
			errors: ["Fail to save in database", error],
		});
	});
});
