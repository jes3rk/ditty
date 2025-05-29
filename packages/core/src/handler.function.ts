import { Token } from "@dtty/simpldi";

export type HandlerFunction = (...args: any[]) => any;

export interface IHandler {
  handler: HandlerFunction;
  injectionTokens?: Token<unknown>[];
}
