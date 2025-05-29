import { HandlerFunction } from "./handler.function";

export interface IHandlerProvider {
  invokeHandler: () => unknown;
}

function handlerFunction(
  handler: HandlerFunction,
  dependencies: any[],
): IHandlerProvider {
  return {
    invokeHandler: () => handler(...dependencies),
  };
}

export class HandlerProviderBuilder {
  constructor(private readonly handler: HandlerFunction) {}

  public build = (...dependencies: any[]): IHandlerProvider => {
    // This is an arrow function to force the scope to be
    // consistent
    return handlerFunction(this.handler, dependencies);
  };
}
