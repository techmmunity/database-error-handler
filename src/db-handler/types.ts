import { HttpCodeEnum } from "../enums/http-code";
import { PgErrorEnum } from "../enums/pg-error";

export interface Handler {
	table: string;
	error: PgErrorEnum;
	responseCode: HttpCodeEnum | number;
	makeError: (values: Record<string, string>) => any | Promise<any>;
	columns?: Array<string>;
	validate?: (values: Record<string, string>) => boolean;
}

export interface DefaultHandler {
	error: "default";
	responseCode: HttpCodeEnum | number;
	makeError: (err: any) => any | Promise<any>;
}

export type ErrorKeysAndValues = Record<string, string>;

export type MakeErrorContent = (errorMessage: string) => any;

export type Handlers = Array<Handler | DefaultHandler>;

export type Throwler = new (response: any, status: number) => any;
