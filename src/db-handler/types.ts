import { HttpCodeEnum } from "../enums/http-code";
import { PgErrorEnum } from "../enums/pg-error";

export interface Handler {
	table: string;
	error: PgErrorEnum;
	responseCode: HttpCodeEnum | number;
	makeError: (values: Record<string, string>) => Promise<any> | any;
	columns?: Array<string>;
	validate?: (values: Record<string, string>) => boolean;
}

export interface DefaultHandler {
	error: "default";
	responseCode: HttpCodeEnum | number;
	makeError: (err: any) => Promise<any> | any;
}

export type MakeErrorContent = (errorMessage: string) => any;

export type Handlers = Array<DefaultHandler | Handler>;

export type Throwler = new (response: any, status: number) => any;

export interface DbHandlerMakerConfig {
	throwler: Throwler;
	globalDefaultHandler?: DefaultHandler;
}
