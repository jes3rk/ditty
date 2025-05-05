import { HandlerFunction } from "./handler.function";

export class DttyCore {
  public handleRequest(handler: HandlerFunction): any {
    return handler();
  }
}
